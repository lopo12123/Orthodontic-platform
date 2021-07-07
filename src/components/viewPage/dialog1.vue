<template>
    <el-dialog
        :visible="visible"
        :modal="false"
        width="50%"
        :show-close="false">
        <template slot="title">
            查看原始模型
        </template>
        <template>
            <el-container style="height:400px;">
                <el-aside width="20%">
                    <div style="position:relative;width:100%;height:100%">
                        <span id="labelText">选择查看的模型</span>
                        <el-select v-model="currentIndex" size="mini" style="position:relative;width:80%;margin:10px auto;display:block" @change="opButton(currentIndex==0?'upper':'lower')">
                            <el-option value="0" label="上颌牙" :disabled="ifDisable[0]">上颌牙</el-option>
                            <el-option value="1" label="下颌牙" :disabled="ifDisable[1]">下颌牙</el-option>
                        </el-select>
                    </div>
                </el-aside>
                <el-main>
                    <div style="position:relative;width:100%;height:100%; outline:solid 1px #cccccc">
                        <single-model-viewer ref="upperOrigin" v-show="currentIndex==='0'" :canvasId="upperOriginId"/>
                        <single-model-viewer ref="lowerOrigin" v-show="currentIndex==='1'" :canvasId="lowerOriginId"/>
                    </div>
                </el-main>
            </el-container>
        </template>
        <template slot="footer">
            <el-button @click="opButton('cancel')" size="mini" plain type="danger">关闭</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import SingleModelViewer from '@/components/viewPage/SingleModelViewer.vue'

// @ts-ignore
@Component({
    components: {
        SingleModelViewer
    }
})
export default class Dialog1 extends Vue {
    @Prop({required:true}) uid!:string
    @Prop({required:true}) visible!:boolean
    @Prop({default:() => [false, false]}) ifDisable?:[boolean, boolean]

    upperOriginId:string = "upperOrigin"
    lowerOriginId:string = "lowerOrigin"
    
    currentIndex:number|string = ''
    ifDownload:[boolean, boolean] = [false, false]
    downloadMSG:string = ''

    opButton(btnName:string):void {
        if(btnName === 'cancel') {
            (this.$parent as any).dialogButton(1, 'cancel')
        }
        else if(btnName === 'upper') {
            if(!this.ifDownload[0]) {
                // download uppermodel
                (this.$refs.upperOrigin as any).showModel(this.uid, "UP")
                this.ifDownload[0] = true
            }
        }
        else if(btnName === 'lower') {
            if(!this.ifDownload[1]) {
                // download lowermodel
                (this.$refs.lowerOrigin as any).showModel(this.uid, "LOW")
                this.ifDownload[1] = true
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#labelText {
    width: 100%;
    text-align: center;
    font-family: cursive;
    display: block;
}
</style>