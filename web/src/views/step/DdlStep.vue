<template>
    <div style="height:100%; overflow: auto;">
        <h3 style="margin-left: 10px;">DDL(仅支持MySQL):</h3>
        <el-input type="textarea" resize="both" :autosize="{ minRows: 10 }" v-model="ddl" />
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, nextTick, onMounted, unref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { getTablesByDdl } from '@/api/marketplace'
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
            ddl:
                "CREATE TABLE `demo` (\n" +
                "  `demo_id` bigint NOT NULL COMMENT '主键ID',\n" +
                "  `demo_name` varchar(255) DEFAULT NULL COMMENT '名称',\n" +
                "  `create_time` datetime DEFAULT NULL COMMENT '创建时间',\n" +
                "  `update_time` datetime DEFAULT NULL COMMENT '修改时间',\n" +
                "  PRIMARY KEY (`demo_id`)\n" +
                ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Demo';",
            openBefore() {

            },
            validate(callback) {
                if (!dataMap.ddl) {
                    ElMessageBox.alert('请输入DDL', '错误', {
                        confirmButtonText: '确定',
                        type: 'error', callback() { },
                        'close-on-press-escape': true
                    })
                } else {
                    getTablesByDdl(dataMap.ddl).then((response) => {
                        state.tables = response.data;
                        callback(true);
                    });
                }
            }
        })
        onMounted(() => {
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
