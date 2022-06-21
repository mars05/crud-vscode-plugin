import * as vscode from 'vscode';
import { WebviewManager } from './WebviewManager'


export function activate(context: vscode.ExtensionContext) {
	console.log("扩展activate", context)

	WebviewManager.processWebview(context, [
		{ id: 'crud.templateImport', title: '模板导入', route: '/templateImport' },
		{ id: 'crud.myTemplate', title: '我的模板', route: '/myTemplate' },
		{ id: 'crud.projectGenerate', title: '项目生成', route: '/projectGenerate' },
		{ id: 'crud.codeGenerate', title: '代码生成', route: '/codeGenerate' },
	])

}

export function deactivate() {

}
