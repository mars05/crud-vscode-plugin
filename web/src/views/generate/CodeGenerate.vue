<template>
    <div class="app-container" style="width:600px;margin-left: auto;margin-right: auto;">
        <div>
            <el-carousel height="350px" :key="carouselKey" ref="carousel" indicator-position="none" :autoplay="false"
                :loop="false" arrow="never">
                <el-carousel-item>
                    <MyTemplateStep :state="state" ref="myTemplateStep"></MyTemplateStep>
                </el-carousel-item>
                <el-carousel-item>
                    <DdlStep :state="state" ref="ddlStep"></DdlStep>
                </el-carousel-item>
                <el-carousel-item>
                    <CodeStep :state="state" ref="codeStep"></CodeStep>
                </el-carousel-item>
            </el-carousel>
        </div>
        <div slot="footer" class="footer">
            <el-button v-if="stepIndex == 0" disabled @click="prev">上一步</el-button>
            <el-button v-else @click="prev">上一步</el-button>
            <el-button v-if="stepIndex + 1 < Object.keys(indexAndStepMap).length" @click="next">下一步</el-button>
            <el-button v-else @click="finish">完成</el-button>
            <el-button @click="() => { }">取消</el-button>
        </div>
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, nextTick, onMounted, unref } from 'vue'
import MyTemplateStep from '@/views/step/MyTemplateStep.vue'
import DdlStep from '@/views/step/DdlStep.vue'
import CodeStep from '@/views/step/CodeStep.vue'
import { generateCode } from '@/api/marketplace'
import * as projectTemplateService from '@/service/ProjectTemplateService'
import * as vscode from '@/utils/vscode'
export default defineComponent({
    components: {
        MyTemplateStep,
        DdlStep,
        CodeStep
    },
    setup() {
        const carousel = ref()
        const myTemplateStep = ref()
        const ddlStep = ref()
        const codeStep = ref()

        const dataMap = reactive({
            carouselKey: 0,
            stepIndex: 0,
            indexAndStepMap: {
                0: myTemplateStep,
                1: ddlStep,
                2: codeStep
            },
            state: {

            },
            prev() {
                dataMap.stepIndex--;
                unref(carousel).setActiveItem(dataMap.stepIndex);
            },
            next() {
                dataMap.indexAndStepMap[dataMap.stepIndex].validate(valid => {
                    if (valid) {
                        dataMap.indexAndStepMap[dataMap.stepIndex + 1].openBefore();
                        dataMap.stepIndex++;
                        unref(carousel).setActiveItem(dataMap.stepIndex);
                    }
                })
            },
            finish() {
                dataMap.indexAndStepMap[dataMap.stepIndex].validate(valid => {
                    if (valid) {
                        const state = dataMap.state;
                        console.log("完成", state)
                        const data = {
                            projectTemplate: projectTemplateService.detail(state.ptId),
                            projectPath: state.projectPath,
                            basePackage: state.basePackage,
                            nameList: state.nameList,
                            tables: state.tables,
                        }
                        generateCode(data).then(response => {
                            vscode.generateCode({
                                projectPath: state.projectPath,
                                files: response.data.files
                            })
                        })
                    }
                })
            }
        })
        return { ...toRefs(dataMap), myTemplateStep, ddlStep, codeStep, carousel }
    }
})
</script>

<style>
.footer {
    text-align: right;
    padding-top: 10px;
}
</style>
