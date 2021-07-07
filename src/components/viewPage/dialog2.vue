<template>
    <el-dialog
        id="dialog2"
        :visible="visible"
        :modal="false"
        width="20%"
        :show-close="false">
        <template slot="title">
            <span> {{ dialogTitle[workType] }} </span>
            <div class="title">
                <el-steps simple style="height:20px; padding:5px 20px;" :active="opStep" finish-status="success">
                    <el-step title="选择" icon="el-icon-edit"></el-step>
                    <el-step title="等待" icon="el-icon-download"></el-step>
                </el-steps>
            </div>
        </template>
        <template>
            <div class="body centerShow" v-show="opStep==0">
                <el-checkbox v-model="mySelect[0]" :disabled="ifDisable[0]" border>上颌牙</el-checkbox>
                <el-checkbox v-model="mySelect[1]" :disabled="ifDisable[1]" border>下颌牙</el-checkbox>
            </div>
            <div class="body" v-show="opStep==1">
                上颌牙: <span v-show="!mySelect[0]">[未选择]</span><br>
                <el-progress :percentage="downloadP[0]"></el-progress><br>
                下颌牙: <span v-show="!mySelect[1]">[未选择]</span><br>
                <el-progress :percentage="downloadP[1]"></el-progress>
            </div>
            <div class="body" v-show="opStep==2">
                <img v-if="!ifFinish" src="@/assets/load.gif">
                <p v-else> {{ dialogTitle[workType] }} 完成</p>
            </div>
        </template>
        <template slot="footer">
            <el-button @click="opButton('cancel')" size="mini" plain type="danger" v-show="opStep==0">取消</el-button>
            <el-button @click="opButton('check')" size="mini" plain type="success">确认</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { AxiosRequestConfig } from 'axios'
import { Vue, Component, Prop } from 'vue-property-decorator'

enum DialogType {
    DOWNLOAD,
    SAVEONLINE,
    CONFIRM
}

@Component({})
export default class Dialog2 extends Vue {
    @Prop({required:true}) uid!:string
    @Prop({required:true}) workType!:DialogType
    @Prop({required:true}) visible!:boolean
    @Prop({default:() => [false, false]}) ifDisable?:[boolean, boolean]

    get url_path():string {
        return ((process.env.NODE_ENV === 'development') ? process.env.VUE_APP_BASEURL_DEV : process.env.VUE_APP_BASEURL_PRO) + '/teethAPI2.0/api/data/model?patientUid='
    }
    get url_file():string {
        return ((process.env.NODE_ENV === 'development') ? process.env.VUE_APP_BASEURL_DEV : process.env.VUE_APP_BASEURL_PRO) + '/ModelApi'
    }

    dialogTitle = ["下载预定位模型", "方案在线保存", "方案保存并确认"]

    ifFinish:boolean = false

    mySelect:[boolean, boolean] = [false, false]
    downloadP:[number, number] = [0, 0]

    opStep:number = 0

    opButton(btnName:string):void {
        if(btnName === 'cancel') {
            (this.$parent as any).dialogButton(2, 'cancel')
        }
        else if(btnName === 'check') {
            switch(this.workType) {
                case DialogType["DOWNLOAD"]:
                    if(this.opStep === 0) {
                        if(!this.mySelect[0] && !this.mySelect[1]) {
                            return
                        }
                        else {
                            this.opStep += 1

                            // download models
                            this.downloadFiles()
                        }
                    }
                    else if(this.opStep === 1) {
                        (this.$parent as any).dialogButton(2, 'cancel')

                        // reset all tags
                        this.mySelect = [false, false]
                        this.downloadP = [0, 0]
                        this.opStep = 0
                        this.ifFinish = false
                    }
                    break
                case DialogType["SAVEONLINE"]:
                    // if(this.opStep === 0) {
                    //     if(!this.mySelect[0] && !this.mySelect[1]) {
                    //         return
                    //     }
                    //     else {
                    //         this.opStep += 2

                    //         // upload file
                    //         this.$emit("saveonline", {
                    //             select: this.mySelect
                    //         })
                            
                    //     }
                    // }
                    // else if(this.opStep === 2) {
                    //     (this.$parent as any).dialogButton(2, 'cancel')

                    //         // reset all tags
                    //         this.mySelect = [false, false]
                    //         this.downloadP = [0, 0]
                    //         this.opStep = 0
                    //         this.ifFinish = false
                    // }
                    break
                case DialogType["CONFIRM"]:
                    if(this.opStep === 0) {
                        if(!this.mySelect[0] && !this.mySelect[1]) {
                            return
                        }
                        else {
                            this.opStep += 2

                            // upload file
                            this.$emit("confirm", {
                                select: this.mySelect
                            })
                            
                        }
                    }
                    else if(this.opStep === 2) {
                        (this.$parent as any).dialogButton(2, 'cancel')

                        // reset all tags
                        this.mySelect = [false, false]
                        this.downloadP = [0, 0]
                        this.opStep = 0
                        this.ifFinish = false
                    }
                    break
            }
        }
    }

    uploadFinish():void {
        this.ifFinish = true
    }

    async downloadFiles():Promise<void> {
        let config1:AxiosRequestConfig = {
            responseType: 'blob',
            onDownloadProgress: (e) => {
                let nowP = Math.ceil(e.loaded / e.total * 100)
                this.downloadP.splice(0, 1, nowP)
            }
        }
        let config2:AxiosRequestConfig = {
            responseType: 'blob',
            onDownloadProgress: (e) => {
                let nowP = Math.ceil(e.loaded / e.total * 100)
                this.downloadP.splice(1, 1, nowP)
            }
        }

        if(this.mySelect[0]) {  // upper
            let path1 = ''
            
            await (this as any).axios.get(this.url_path + encodeURI(this.uid) + '&modelType=UpperConfig')
            .then((res:any) => {
                if(res.data.data) {
                    path1 = res.data.data
                }
                else {
                    (this as any).$message({
                        message: "下载失败，无此文件",
                        type: "error",
                        center: true
                    })
                    return
                }
            })
            .catch((err:any) => {
                (this as any).$message({
                    message: "下载失败，无此文件",
                    type: "error",
                    center: true
                })
            })

            await (this as any).axios.get(this.url_file + path1, config1)
            .then((res:any) => {
                const readerUpper = new FileReader()
                let blobUpper = new Blob([res.data], {type: 'application/octet-stream'})

                readerUpper.onload = () => {
                    let cadoFile1:ArrayBuffer = readerUpper.result as ArrayBuffer
                    let dv1 = new DataView(cadoFile1)

                    let stlLength1 = dv1.getUint32(80, true) * 50 + 84

                    let stlFile1 = cadoFile1.slice(0, stlLength1)  // stl part

                    let xmlBlobFile1 = new Blob([cadoFile1.slice(stlLength1)])
                    let xmlReader1 = new FileReader()

                    xmlReader1.onload = () => {
                        let param1 = {
                            type: "upper",
                            stl: stlFile1,
                            xml: xmlReader1.result as string
                        }

                        this.$emit('parsed', param1)
                    }
                    xmlReader1.readAsText(xmlBlobFile1)
                }
                readerUpper.readAsArrayBuffer(blobUpper)
            })
        }

        if(this.mySelect[1]) {  // lower
            let path2 = ''
            
            await (this as any).axios.get(this.url_path + encodeURI(this.uid) + '&modelType=LowerConfig')
            .then((res:any) => {
                if(res.data.data) {
                    path2 = res.data.data
                }
                else {
                    (this as any).$message({
                        message: "下载失败，无此文件",
                        type: "error",
                        center: true
                    })
                    return
                }
            })
            .catch((err:any) => {
                (this as any).$message({
                    message: "下载失败，无此文件",
                    type: "error",
                    center: true
                })
            })

            await (this as any).axios.get(this.url_file + path2, config2)
            .then((res:any) => {
                const readerLower = new FileReader()
                let blobLower = new Blob([res.data], {type: 'application/octet-stream'})

                readerLower.onload = () => {
                    let cadoFile2:ArrayBuffer = readerLower.result as ArrayBuffer
                    let dv2 = new DataView(cadoFile2)

                    let stlLength2 = dv2.getUint32(80, true) * 50 + 84

                    let stlFile2 = cadoFile2.slice(0, stlLength2)  // stl part

                    let xmlBlobFile2 = new Blob([cadoFile2.slice(stlLength2)])
                    let xmlReader2 = new FileReader()

                    xmlReader2.onload = () => {
                        let param2 = {
                            type: "lower",
                            stl: stlFile2,
                            xml: xmlReader2.result
                        }

                        this.$emit('parsed', param2)
                    }
                    xmlReader2.readAsText(xmlBlobFile2)
                }
                readerLower.readAsArrayBuffer(blobLower)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    width: 90%;
    height: 40px;
    margin: auto;
    margin-top: 20px;
}
.body {
    width: 90%;
    height: 100%;
    margin: auto;

    img {
        position: relative;
        width: 50px;
        height: 50px;
        margin: 50px auto;
        display: block;
    }

    p {
        position: relative;
        width: 200px;
        height: 32px;
        font-size: 16px;
        text-align: center;
        line-height: 200%;
        margin: 68px auto;
        display: block;
    }
}
.centerShow {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

<style lang="scss">
#dialog2 {
    .el-dialog__body {
        padding: 5px;
    }
}
</style>