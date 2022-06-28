<template>
    <div style="height:100%; overflow: auto;">
        <h3 style="margin-left: 10px;">代码参数:</h3>
        <el-form class="form" label-position="left" :model="form" label-width="100px">
            <el-form-item label="项目路径:">
                <el-input v-model="form.projectPath">
                    <template #append>
                        <el-button @click="selectProjectPath" :icon="FolderOpened" />
                    </template>
                </el-input>
            </el-form-item>
            <!-- Java、Maven项目 -->
            <div v-if="projectType == 1 || projectType == 2">
                <el-form-item label="basePackage:">
                    <el-input v-model="form.basePackage" />
                </el-form-item>
            </div>
            <el-form-item label="代码模板:">
                <div>
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="form.nameList" @change="handleCheckedChange">
                        <el-checkbox v-for="name in nameOptions" :label="name" :key="name">{{ name }}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </el-form-item>
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
                projectPath: generateDao.getProjectPath(),
                basePackage: 'com.example.demo',
                nameList: []
            },
            checkAll: true,
            nameOptions: [],
            isIndeterminate: false,
            handleCheckAllChange(val) {
                dataMap.form.nameList = val ? dataMap.nameOptions : [];
                dataMap.isIndeterminate = false;
            },
            handleCheckedChange(value) {
                let checkedCount = value.length;
                dataMap.checkAll = checkedCount === dataMap.nameOptions.length;
                dataMap.isIndeterminate =
                    checkedCount > 0 && checkedCount < dataMap.nameOptions.length;
            },
            selectProjectPath() {
                vscode.selectProjectPath(dataMap.form.projectPath)
            },
            openBefore() {
                const projectTemplate = projectTemplateService.detail(state.ptId);
                dataMap.projectType = projectTemplate.projectType
                dataMap.nameOptions = [...projectTemplate.fileTemplateList]
                    .filter((item) => {
                        return item.type == 2; //代码模板
                    })
                    .map((item) => {
                        return item.name;
                    });
                dataMap.form = {
                    projectPath: generateDao.getProjectPath(),
                    basePackage: 'com.example.demo',
                    nameList: dataMap.nameOptions
                }
            },
            validate(callback) {
                if (!dataMap.form.projectPath) {
                    ElMessageBox.alert('请输入项目路径', '错误', {
                        confirmButtonText: '确定',
                        type: 'error', callback() { },
                        'close-on-press-escape': true
                    })
                    return
                }
                if (dataMap.projectType == 1 || dataMap.projectType == 2) {
                    if (!dataMap.form.basePackage) {
                        ElMessageBox.alert('请输入basePackage', '错误', {
                            confirmButtonText: '确定',
                            type: 'error', callback() { },
                            'close-on-press-escape': true
                        })
                        return
                    }
                }
                if (!dataMap.form.nameList.length) {
                    ElMessageBox.alert('请选择代码模板', '错误', {
                        confirmButtonText: '确定',
                        type: 'error', callback() { },
                        'close-on-press-escape': true
                    })
                    return
                }
                state.projectPath = dataMap.form.projectPath;
                state.basePackage = dataMap.form.basePackage;
                state.nameList = dataMap.form.nameList;

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
