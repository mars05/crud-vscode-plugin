import * as vscode from '@/utils/vscode';
const dataKey = "projectTemplates";

export function selectById(id) {
    var obj = getDataList().filter(obj => { return obj.id == id })
    return obj ? obj[0] : null;
}

export function selectList() {
    return getDataList();
}

export function insert(data) {
    if (!data.id) {
        throw new Error("ID不能为空");
    }
    var dataList = getDataList();
    if (dataList.filter(obj => { return obj.id == data.id }).length > 0) {
        throw new Error("ID冲突");
    }
    dataList.push(data);
    setDataList(dataList);
}

export function updateById(data) {
    if (!data.id) {
        throw new Error("ID不能为空");
    }
    var dataList = getDataList();
    for (var i = 0; i < dataList.length; i++) {
        if (dataList[i].id == data.id) {
            dataList[i] = data
            setDataList(dataList)
            return
        }
    }
    throw new Error("目标不存在,ID:" + data.id);
}

export function deleteById(id) {
    var delIndex = -1;
    var dataList = getDataList();
    for (var i = 0; i < getDataList().length; i++) {
        if (dataList[i].id == id) {
            delIndex = i;
            break;
        }
    }
    if (delIndex < 0) {
        throw new Error("目标不存在,ID:" + id);
    }
    dataList.splice(delIndex, 1)
    setDataList(dataList)
}

function getDataList() {
    var state = vscode.getState()
    var dataList = [];
    dataList = state[dataKey]
    if (!dataList) {
        dataList = []
    }
    return [...dataList];
}

function setDataList(dataList) {
    var state = vscode.getState()
    state[dataKey] = dataList || []
    vscode.setState(state)
}