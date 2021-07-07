<template>
    <div :id="canvasId" class="container">
        <span>下载中: [ {{downloaded}}% ]</span>
    </div>
</template>

<script lang="ts">
// vtkjs does [not fully] support typescript
// there is no npm package named @types/vtk.js
import { Vue, Component, Prop } from 'vue-property-decorator'
import { AxiosRequestConfig } from 'axios'

// @ts-ignore
import myRenderWindow from './myRenderWindow.js'
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor'
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper'
import vtkSTLReader from 'vtk.js/Sources/IO/Geometry/STLReader'

import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow'
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer'

@Component({})
export default class SingleModelViewer extends Vue {
    @Prop({}) canvasId!:string

    get url_path():string {
        return ((process.env.NODE_ENV === 'development') ? process.env.VUE_APP_BASEURL_DEV : process.env.VUE_APP_BASEURL_PRO) + '/teethAPI2.0/api/data/model?patientUid='
    }
    get url_file():string {
        return ((process.env.NODE_ENV === 'development') ? process.env.VUE_APP_BASEURL_DEV : process.env.VUE_APP_BASEURL_PRO) + '/ModelApi'
    }

    downloaded:number = 0

    async showModel(uid:string, upOrLow:"UP"|"LOW"):Promise<void> {
        let param = (upOrLow == "UP") ? "&modelType=UpperTeethModel" : "&modelType=LowerTeethModel"
        let path = ''

        await this.axios.get(this.url_path + encodeURI(uid) + param)
        .then((res) => {
            if(res.data.data) {
                path = res.data.data
            }
            else {
                this.$message({
                    message: "下载失败，无此文件",
                    type: "error",
                    center: true
                })
                return
            }
        })

        let config:AxiosRequestConfig = {
            responseType: 'blob',
            onDownloadProgress: (e) => {
                let nowP = Math.ceil(e.loaded / e.total * 100)
                this.downloaded = nowP
            }
        }

        await this.axios.get(this.url_file + path, config)
        .then((res) => {
            const reader = new FileReader()
            let blobFile = new Blob([res.data], {type: 'application/vnd.ms-pki.stl'})

            reader.onload = () => {
                this.showSTL((reader.result as ArrayBuffer))
            }
            reader.readAsArrayBuffer(blobFile)
        })
    }

    showSTL(stlFile:ArrayBuffer):void {
        const reader = vtkSTLReader.newInstance()
        const mapper = vtkMapper.newInstance({scalarVisibility:false})
        const actor = vtkActor.newInstance()

        actor.setMapper(mapper)
        actor.getProperty().setColor(1, 1, 1)
        mapper.setInputConnection(reader.getOutputPort())


        reader.parseAsArrayBuffer(stlFile)

        let myScreenRenderder = myRenderWindow.newInstance({background:[1, 1, 0.94], targetId: this.canvasId})
        let renderer = myScreenRenderder.getRenderer()
        let rendererWindow = myScreenRenderder.getRenderWindow()

        renderer.addActor(actor)
        renderer.resetCamera()
        rendererWindow.render()
    }
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    background-color: ivory;

    display: flex;
    justify-content: center;
    align-items: center;
}
</style>