<template>
    <div style="height:100%; overflow: auto;">
        <h3 style="margin-left: 10px;">项目参数:</h3>
        <el-form class="form" label-position="left" :model="form" label-width="100px">
            <el-form-item label="项目名称:">
                <el-input v-model="form.projectName" />
            </el-form-item>
            <el-form-item label="项目路径:">
                <el-input v-model="form.projectPath">
                    <template #append>
                        <el-button @click="selectProjectPath" :icon="FolderOpened" />
                    </template>
                </el-input>
            </el-form-item>
            <!-- Java项目 -->
            <div v-if="projectType == 1">
                <el-divider />
                <el-form-item label="basePackage:">
                    <el-input v-model="form.basePackage" />
                </el-form-item>
            </div>
            <!-- Maven项目 -->
            <div v-if="projectType == 2">
                <el-divider />
                <el-form-item label="Maven参数:">
                </el-form-item>
                <el-form-item label="groupId:">
                    <el-input v-model="form.groupId" />
                </el-form-item>
                <el-form-item label="artifactId:">
                    <el-input v-model="form.artifactId" />
                </el-form-item>
                <el-form-item label="version:">
                    <el-input v-model="form.version" />
                </el-form-item>
                <el-form-item label="basePackage:">
                    <el-input v-model="form.basePackage" />
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, nextTick, onMounted, unref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { FolderOpened } from '@element-plus/icons-vue'
import * as projectTemplateService from '@/service/ProjectTemplateService'
import * as vscode from '@/utils/vscode'
import * as generateDao from '@/dao/GenerateDao'
export default defineComponent({
    props: {
        state: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const state = unref(props.state)
        const dataMap = reactive({
            projectType: undefined,
            form: {
                projectName: 'demo',
                projectPath: generateDao.getProjectPath(),
                basePackage: 'com.example.demo',
                groupId: "com.example",
                artifactId: "demo",
                version: "0.0.1-SNAPSHOT",
            },
            selectProjectPath() {
                vscode.selectProjectPath(dataMap.form.projectPath)
            },
            openBefore() {
                dataMap.projectType = projectTemplateService.detail(state.ptId).projectType
            },
            validate(callback) {
                if (!dataMap.form.projectName) {
                    ElMessageBox.alert('请输入项目名称', '错误', {
                        confirmButtonText: '确定',
                        type: 'error', callback() { },
                        'close-on-press-escape': true
                    })
                    return
                }
                if (!dataMap.form.projectPath) {
                    ElMessageBox.alert('请输入项目路径', '错误', {
                        confirmButtonText: '确定',
                        type: 'error', callback() { },
                        'close-on-press-escape': true
                    })
                    return
                }
                if (dataMap.projectType == 1) {
                    if (!dataMap.form.basePackage) {
                        ElMessageBox.alert('请输入basePackage', '错误', {
                            confirmButtonText: '确定',
                            type: 'error', callback() { },
                            'close-on-press-escape': true
                        })
                        return
                    }
                }
                if (dataMap.projectType == 2) {
                    if (!dataMap.form.groupId) {
                        ElMessageBox.alert('请输入groupId', '错误', {
                            confirmButtonText: '确定',
                            type: 'error', callback() { },
                            'close-on-press-escape': true
                        })
                        return
                    }
                    if (!dataMap.form.artifactId) {
                        ElMessageBox.alert('请输入artifactId', '错误', {
                            confirmButtonText: '确定',
                            type: 'error', callback() { },
                            'close-on-press-escape': true
                        })
                        return
                    }
                    if (!dataMap.form.version) {
                        ElMessageBox.alert('请输入version', '错误', {
                            confirmButtonText: '确定',
                            type: 'error', callback() { },
                            'close-on-press-escape': true
                        })
                        return
                    }
                    if (!dataMap.form.basePackage) {
                        ElMessageBox.alert('请输入basePackage', '错误', {
                            confirmButtonText: '确定',
                            type: 'error', callback() { },
                            'close-on-press-escape': true
                        })
                        return
                    }
                }

                state.projectName = dataMap.form.projectName;
                state.projectPath = dataMap.form.projectPath;
                state.basePackage = dataMap.form.basePackage;
                state.groupId = dataMap.form.groupId;
                state.artifactId = dataMap.form.artifactId;
                state.version = dataMap.form.version;

                generateDao.setProjectPath(state.projectPath);
                callback(true);
            }
        })
        onMounted(() => {
        })
        window.addEventListener('message', event => {
            const message = event.data; // The JSON data our extension sent
            switch (message.command) {
                case 'projectPath':
                    if (message.data) {
                        dataMap.form.projectPath = message.data
                    }
                    generateDao.setProjectPath(dataMap.form.projectPath)
                    break;
            }
        })
        return { ...toRefs(dataMap), FolderOpened }
    }
})
</script>

<style>
.form {
    margin-left: 10px;
}
</style>
