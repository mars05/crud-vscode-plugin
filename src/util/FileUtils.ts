import * as vscode from 'vscode';
import * as path from 'path';

export function asWebviewUri(context: vscode.ExtensionContext, panel: vscode.WebviewPanel) {
    // Get path to resource on disk
    const onDiskPath = vscode.Uri.file(
        path.join(context.extensionPath, 'media', 'cat.gif')
    );
    // And get the special URI to use with the webview
    const catGifSrc = panel.webview.asWebviewUri(onDiskPath);
    console.log("呵呵呵呵");

}