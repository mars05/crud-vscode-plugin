const vscode = typeof acquireVsCodeApi == 'undefined' ? null : acquireVsCodeApi();

export function getState() {
    return JSON.parse(localStorage.vscodeState);
}

export function setState(data) {
    localStorage.vscodeState = JSON.stringify(data)
    if (vscode) {
        vscode.postMessage({ command: 'setState', data: getState() })
    }
}
export function selectProjectPath(projectPath) {
    if (vscode) {
        vscode.postMessage({ command: 'projectPath', data: projectPath })
    }
}
export function generateProject(data) {
    if (vscode) {
        vscode.postMessage({ command: 'generateProject', data: data })
    }
}
export function generateCode(data) {
    if (vscode) {
        vscode.postMessage({ command: 'generateCode', data: data })
    }
}