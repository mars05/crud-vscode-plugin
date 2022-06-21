<template>
    <div style="height:100%; overflow: auto;">
        <h3 style="margin-left: 10px;">选择项目:</h3>
        <el-table class="my-table" :data="list" style="width: 100%" highlight-current-row
            @current-change="handleCurrentChange">
            <el-table-column>
                <template #default="{ row }">
                    <span>{{ row.organizationName }} / {{ row.name }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, nextTick, onMounted, unref } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as projectTemplateService from '@/service/ProjectTemplateService'
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
            list: [],
            currTemplate: {},
            handleCurrentChange(row) {
                dataMap.currTemplate = Object.assign({}, row)
            },
            async getList() {
                dataMap.list = projectTemplateService.list();
                dataMap.currTemplate = {}
            },
            openBefore() {

            },
            validate(callback) {
                if (!dataMap.currTemplate.id) {
                    ElMessageBox.alert('请选择模板', '错误', {
                        confirmButtonText: '确定',
                        type: 'error', callback() { },
                        'close-on-press-escape': true
                    })
                } else {
                    state.ptId = dataMap.currTemplate.id;
                    callback(true);
                }
            }
        })
        onMounted(() => {
            dataMap.getList()
        })
        return { ...toRefs(dataMap) }
    }
})
</script>

<style>
.my-table .el-table__header-wrapper {
    display: none;
}
</style>
