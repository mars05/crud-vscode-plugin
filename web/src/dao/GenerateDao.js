import * as vscode from '@/utils/vscode';
const dataKey = "generateInfo";

export function getProjectPath() {
    return getData().projectPath;
}

export function setProjectPath(projectPath) {
    var data = getData();
    data.projectPath = projectPath;
    return setData(data);
}

function getData() {
    var state = vscode.getState()
    var data = state[dataKey]
    if (!data) {
        data = {}
    }
    return data;
}

function setData(data) {
    var state = vscode.getState()
    state[dataKey] = data || {}
    vscode.setState(state)
}