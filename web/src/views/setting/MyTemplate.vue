<template>
    <div class="app-container" v-loading="listLoading">
        <div class="filter-container">
            <el-button style="margin-left: 12px;" @click="handleRefresh()">刷新模板</el-button>
            <el-button @click="handleDelete()">删除模板</el-button>
        </div>
        <div>
            <el-scrollbar height="200px">
                <el-table class="my-table" :data="list" style="width: 100%" highlight-current-row
                    @current-change="handleCurrentChange">
                    <el-table-column>
                        <template #default="{ row }">
                            <span>{{ row.organizationName }} / {{ row.name }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-scrollbar>
            <el-descriptions v-show="currTemplate.name" class="margin-top" title="模板详情" :column="2" border>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            项目模板名称
                        </div>
                    </template>
                    {{ currTemplate.name }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            所属组织
                        </div>
                    </template>
                    {{ currTemplate.organizationName }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            修改时间
                        </div>
                    </template>
                    {{ currTemplate.updateTime }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            创建人
                        </div>
                    </template>
                    {{ currTemplate.createName }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            描述
                        </div>
                    </template>
                    {{ currTemplate.description }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, nextTick, onMounted, unref } from 'vue'
import { ElForm, ElMessage, ElMessageBox } from 'element-plus'
import { list, get, getByToken } from '@/api/marketplace'
import * as projectTemplateService from '@/service/ProjectTemplateService'
// import Pagination from '@/components/Pagination/index.vue'
export default defineComponent({
    components: {
        // Pagination
    },
    setup() {
        const dataForm = ref(ElForm)
        const dataMap = reactive({
            tableKey: 0,
            list: [],
            currTemplate: {},
            total: 0,
            listLoading: false,
            listQuery: {
                keyword: '',
                pageNumber: 1,
                pageSize: 20,
            },
            rules: {
                title: [{ required: true, message: 'title is required', trigger: 'blur' }]
            },
            handleCurrentChange(row) {
                dataMap.currTemplate = Object.assign({}, row)
            },
            async getList() {
                // Just to simulate the time of the request
                dataMap.list = projectTemplateService.list();
                dataMap.currTemplate = {}
            },
            async handleRefresh(row) {
                if (!dataMap.currTemplate.name) {
                    ElMessageBox.alert('请选择模板', '错误', {
                        confirmButtonText: '确定',
                        type: 'error', callback() { }
                    })
                    return
                }
                var obj = projectTemplateService.detail(dataMap.currTemplate.id)
                if (obj.publicFlag == 1) {
                    const response = await get(obj.id)
                    obj = response.data
                } else {
                    const response = await getByToken(obj.accessToken)
                    obj = response.data
                }
                ElMessageBox.confirm(dataMap.currTemplate.name, '确定刷新?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info',
                }).then(() => {
                    projectTemplateService.update(obj)
                    ElMessage({
                        type: 'success',
                        message: `刷新成功`,
                    })
                    dataMap.getList()
                }).catch(() => { });
            },
            handleDelete() {
                if (!dataMap.currTemplate.name) {
                    ElMessageBox.alert('请选择模板', '错误', {
                        confirmButtonText: '确定',
                        type: 'error', callback() { }
                    })
                    return
                }
                ElMessageBox.confirm(dataMap.currTemplate.name, '确定删除?', {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    projectTemplateService.del(dataMap.currTemplate.id)
                    ElMessage({
                        type: 'success',
                        message: `删除成功`,
                    })
                    dataMap.getList()
                }).catch(() => { });
            },
        })
        onMounted(() => {
            dataMap.getList()
        })
        window.addEventListener('message', event => {
            const message = event.data; // The JSON data our extension sent
            switch (message.command) {
                case 'state':
                    localStorage.vscodeState = JSON.stringify(message.data)
                    dataMap.getList()
                    break;
            }
        });
        return { ...toRefs(dataMap), dataForm }
    }
})
</script>

<style>
.my-table .el-table__header-wrapper {
    display: none;
}

.filter-container {
    margin-bottom: 5px;
}
</style>
