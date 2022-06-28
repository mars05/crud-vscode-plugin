import * as vscode from "vscode";
import * as fs from 'fs';
import * as path from 'path';
import { ProjectService } from "./service/ProjectService";
import { State, STATE_VERSION } from "./State";
import { DEFAULT_TEMPLATE_DATA } from "./template/DefaultTemplate";

export interface WebviewCommand {
    id: string,
    title: string,
    route: string
}

export class WebviewManager {
    private static panelMap: Map<string, vscode.WebviewPanel> = new Map();

    public static processWebview(context: vscode.ExtensionContext, commands: WebviewCommand[]) {
        commands.forEach(command => {
            context.subscriptions.push(
                vscode.commands.registerCommand(
                    command.id, () => {
                        WebviewManager.createOrShow(command, context);
                    },
                ));
        })
    }
    private static createOrShow(command: WebviewCommand, context: vscode.ExtensionContext) {
        const extensionUri = context.extensionUri;

        const columnToShowIn = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        var panel = WebviewManager.panelMap.get(command.id)
        // If we already have a panel, show it.   
        if (panel) {
            panel.reveal(columnToShowIn);
            return;
        }
        // Otherwise, create a new panel. 
        panel = vscode.window.createWebviewPanel(
            command.id,
            command.title,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'dist'),
                ]
            },
        );
        WebviewManager.panelMap.set(command.id, panel);

        var state: State | undefined = context.globalState.get("state")
        if (!state || state.version != STATE_VERSION) {
            state = {
                "generateInfo": {},
                "projectTemplates": DEFAULT_TEMPLATE_DATA,
                "version": STATE_VERSION
            }
            context.globalState.update("state", state);
        }
        if (command.id == 'crud.codeGenerate') {
            const wfs = vscode.workspace.workspaceFolders;
            if (wfs) {
                state.generateInfo.projectPath = wfs[0].uri.fsPath
            }
        }

        // 接收消息
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'setState':
                    console.log("web到扩展", message);
                    context.globalState.update("state", message.data);
                    WebviewManager.panelMap.forEach((panel) => {
                        panel.webview.postMessage({ command: 'state', data: context.globalState.get("state") });
                    })
                    break;
                case 'projectPath':
                    vscode.window.showOpenDialog({
                        title: "项目路径选择",
                        canSelectFiles: false,
                        canSelectFolders: true,
                        canSelectMany: false,
                        defaultUri: vscode.Uri.file(''),
                    }).then(res => {
                        let fsPath = "";
                        if (res && res[0]) {
                            fsPath = res[0].fsPath
                        }
                        panel?.webview.postMessage({ command: 'projectPath', data: fsPath });
                    });
                    break;
                case 'generateProject': {
                    const projectPath = message.data.projectPath;
                    const files = message.data.files;
                    if (fs.existsSync(projectPath)) {
                        vscode.window.showErrorMessage("项目路径已被占用: " + projectPath)
                        return
                    }
                    try {
                        const newWindow = "新窗口打开";
                        const currentWindow = "当前窗口打开";
                        vscode.window.showQuickPick([newWindow, currentWindow], {
                            placeHolder: '请选择打开新项目的方式',
                        }).then((item) => {
                            if (!item) {
                                return
                            }
                            ProjectService.processFileToDisk(projectPath, files)
                            if (item == newWindow) {
                                let uri = vscode.Uri.file(projectPath);
                                vscode.commands.executeCommand('vscode.openFolder', uri, {
                                    forceNewWindow: true
                                })
                            } else if (item == currentWindow) {
                                let uri = vscode.Uri.file(projectPath);
                                vscode.commands.executeCommand('vscode.openFolder', uri)
                            }
                        })
                    } catch (error: any) {
                        vscode.window.showErrorMessage("项目生成失败: " + error.message)
                    }
                    break;
                }
                case 'generateCode': {
                    const projectPath = message.data.projectPath;
                    const files = message.data.files;
                    if (!fs.existsSync(projectPath)) {
                        vscode.window.showErrorMessage("项目路径不存在: " + projectPath)
                        return
                    }
                    try {
                        const successList = ProjectService.processFileToDisk(projectPath, files)
                        vscode.window.showInformationMessage("代码生成完成"
                            + "\n生成数量: " + successList.length
                            + "\n失败数量: " + (files.length - successList.length)
                            + "\n项目路径: " + projectPath)

                    } catch (error: any) {
                        vscode.window.showErrorMessage("代码生成失败: " + error.message)
                    }
                    break;
                }
            }
        }, undefined, context.subscriptions);

        panel.webview.postMessage({ command: 'state', data: state });
        panel.webview.postMessage({ command: 'route', data: command.route });

        WebviewManager.setHtmlForWebview(panel.webview, context.extensionUri);

        panel.onDidDispose(
            () => {
                WebviewManager.panelMap.delete(command.id)
            },
            null,
            context.subscriptions
        );
    }

    private static setHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri): void {
        const htmlUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, "dist/webview", "index.html")
        );
        var htmlPath = htmlUri.fsPath;
        var htmlText = fs.readFileSync(htmlUri.fsPath).toString();
        htmlText = WebviewManager.buildPath(htmlText, webview, path.resolve(htmlPath, ".."));
        webview.html = htmlText;
    }

    private static buildPath(data: string, webview: vscode.Webview, contextPath: string): string {
        // return data.replace(/((src|href)=("|'))(.+?\.(css|js))\b/gi, "$1" + webview.asWebviewUri(vscode.Uri.file(`${contextPath}`)) + "/$4");
        return data.replace(/((src|href)=("|'))/gi, "$1" + webview.asWebviewUri(vscode.Uri.file(`${contextPath}`)) + "/");
    }

}


