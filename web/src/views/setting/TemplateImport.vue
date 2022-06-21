<template>
    <div class="app-container" v-loading="listLoading">
        <div class="filter-container">
            <el-input v-model="listQuery.keyword" placeholder="关键字" style="width: 200px" class="filter-item"
                @keyup.enter="handleFilter" />
            <el-button style="margin-left: 12px;" @click="handleFilter">市场搜索
            </el-button>
            <el-button @click="handleTokenImport">令牌导入</el-button>
            <el-button @click="handleImport">导入</el-button>
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
                dataMap.listLoading = true
                const response = await list(dataMap.listQuery)
                // Just to simulate the time of the request
                setTimeout(() => {
                    dataMap.list = response.data.list;
                    dataMap.listLoading = false
                    dataMap.currTemplate = {}
                }, 0.5 * 1000)
            },
            handleFilter() {
                dataMap.listQuery.pageNumber = 1
                dataMap.getList()
            },
            handleImport() {
                if (!dataMap.currTemplate.name) {
                    ElMessageBox.alert('请选择模板', '错误', {
                        confirmButtonText: '确定',
                        type: 'error', callback() { }
                    })
                } else {
                    get(dataMap.currTemplate.id).then((response) => {
                        try {
                            projectTemplateService.create(Object.assign({}, response.data))
                        } catch (e) {
                            ElMessageBox.alert(e.message, '错误', {
                                confirmButtonText: '确定',
                                type: 'error', callback() { }
                            })
                            throw e;
                        }
                        ElMessageBox.alert('导入成功', '提示', {
                            confirmButtonText: '确定',
                            type: 'success', callback() { }
                        })
                    });
                }
            },
            handleTokenImport() {
                ElMessageBox.prompt('令牌', "令牌导入", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern:
                        /\s*\S+?/,
                    inputErrorMessage: '令牌不能为空',
                }).then(({ value }) => {
                    getByToken(value).then((response) => {
                        try {
                            projectTemplateService.create(Object.assign({}, response.data))
                        } catch (e) {
                            ElMessageBox.alert(e.message, '错误', {
                                confirmButtonText: '确定',
                                type: 'error', callback() { }
                            })
                            throw e;
                        }
                        ElMessage({
                            type: 'success',
                            message: `导入成功`,
                        })
                    });
                }).catch(() => { });
            }
        })
        onMounted(() => {
            dataMap.getList()
        })
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
