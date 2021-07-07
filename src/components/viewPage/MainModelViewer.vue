<template>
    <div :id="canvasId" class="container">
        <input type="file" accept=".cado, .resultcado" @change="parseCADO($event)">
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

import myRenderWindow from './myRenderWindow.js'
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor'
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper'
import vtkSTLReader from 'vtk.js/Sources/IO/Geometry/STLReader'
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer'
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow'
import vtkPoints from 'vtk.js/Sources/Common/Core/Points'
import { mat4 } from 'gl-matrix'

// The following are libraries that do not yet have ts support...
// @ts-ignore
import vtkLandmarkTransform from 'vtk.js/Sources/Common/Transform/LandmarkTransform'
// @ts-ignore
import Mode from 'vtk.js/Sources/Common/Transform/LandmarkTransform/Constants'
// @ts-ignore
import xml2js from 'xml2js'

interface INIItem {
    BracketType: string
    BracketType_archWidth: string
    BracketType_MultiBracketId: string
    BracketType_BracketId: string
}
const myINI:Array<INIItem> = [{
        BracketType:"\x7b2c\x32\x4ee3\x5e26\x72b6\x5f13\x91d1\x5c5e\x77eb\x6cbb\x5668\xff08\x4e8c\x7c7b\xff09",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"281",
        BracketType_BracketId:"08146397fa7049a6acb87790cf2a6ebc"
    }, {
        BracketType:"传动自锁矫治器（三类）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"277",
        BracketType_BracketId:"10a80ea47059401299e82a527e25228c"
    }, {
        BracketType:"第2代带状弓金属矫治器（一类）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"285",
        BracketType_BracketId:"1767efd98e754c4484ff78b826e7b6f4"
    }, {
        BracketType:"3W\x7cfb\x5217 U-BEGG\x81ea\x9501\x33\x7c7b",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"263",
        BracketType_BracketId:"18a78ec4464d4ae088e1834c9297030e"
    }, {
        BracketType:"\x7b2c\x33\x4ee3\x5e26\x72b6\x5f13\x91d1\x5c5e\x77eb\x6cbb\x5668\xff08\x4e00\x7c7b\xff09",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"291",
        BracketType_BracketId:"1cab10526e0e46c5afd3faf0a8232952"
    }, {
        BracketType:"Damon Clear\x7c7b\x578b\x9676\x74f7\x81ea\x9501\x77eb\x6cbb\x5668\xff08\x901a\x7528\xff09",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"265",
        BracketType_BracketId:"1ce9ab7d77cd4e1488f8569563550595"
    }, {
        BracketType:"\x975e\x51e1 BioQuick \x7c7b\x578b\x4e3b\x52a8\x91d1\x5c5e\x81ea\x9501\x77eb\x6cbb\x5668\xff08\x901a\x7528\xff09",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"315",
        BracketType_BracketId:"1de494fd5c0f4b33bff627c61bb0c2fd"
    }, {
        BracketType:"3M Victory Sseries 类型主动金属自锁矫治器（通用）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"313",
        BracketType_BracketId:"290c2d80ea3c483b9fb98c784a087989"
    }, {
        BracketType:"\x7403\x5f62\x81ea\x9501\x7c7b\x578b\x77eb\x6cbb\x5668(\x7403\x6258)",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"307",
        BracketType_BracketId:"349acf1ded464618ab6d7ad1b1207fc5"
    }, {
        BracketType:"单晶全同步带状弓矫治器（通用）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"279",
        BracketType_BracketId:"43e7147b51d942d280d00eea4a86a864",
    }, {
        BracketType:"PASS\x751f\x7406\x6027\x652f\x6297\x91d1\x5c5e\x77eb\x6cbb\x5668",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"271",
        BracketType_BracketId:"592cd39f3385417486d51ddad0c4249e",
    }, {
        BracketType:"Tomy \x7c7b\x578b\x4e3b\x52a8\x91d1\x5c5e\x81ea\x9501\x77eb\x6cbb\x5668\xff08\x901a\x7528\xff09",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"273",
        BracketType_BracketId:"5bf3c6ba4e23424c8985116af1e0dd00",
    }, {
        BracketType:"3W系列 U-BEGG自锁2类",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"261",
        BracketType_BracketId:"63fb25d12b144267847727b4474d0082",
    }, {
        BracketType:"\x4f20\x52a8\x81ea\x9501\x77eb\x6cbb\x5668\xff08\x6807\x51c6\xff09",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"275",
        BracketType_BracketId:"6eaffae065d84cf6afc3c253ae7f38c7",
    }, {
        BracketType:"\x65b0\x4e9a\x51b0\x74f7\x76f4\x4e1d\x5f13\x9676\x74f7\x77eb\x6cbb\x5668\xff08\x901a\x7528\xff09",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"295",
        BracketType_BracketId:"6fc636e9bf904971ad8af15e9bf8e64a",
    }, {
        BracketType:"第3代带状弓金属矫治器（二类）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"287",
        BracketType_BracketId:"7dc5ab5abcdc4409897b51062c0ae9c0",
    }, {
        BracketType:"3W\x7cfb\x5217 U-BEGG\x81ea\x9501\x31\x7c7b",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"259",
        BracketType_BracketId:"7f0e59fb4ed844c5826daeb354ff44c9",
    }, {
        BracketType:"第3代带状弓金属矫治器（三类）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"289",
        BracketType_BracketId:"877cfb6b8ed44cd59d8ab8756b4c0751",
    }, {
        BracketType:"新亚星耀直丝弓自锁矫治器",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"299",
        BracketType_BracketId:"8d04e6f479e9464298f1751ff7aea09e",
    }, {
        BracketType:"\x65b0\x4e9a\x661f\x8000PLUS\x76f4\x4e1d\x5f13\x81ea\x9501\x77eb\x6cbb\x5668",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"297",
        BracketType_BracketId:"b88a272600ec44dda64a0f5594deafd9",
    }, {
        BracketType:"3M Clarity Advanced \x7c7b\x578b\x9676\x74f7\x6258\x69fd\xff08\x901a\x7528\xff09",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"311",
        BracketType_BracketId:"bed70543f21246958931df9f1d2f0ce7",
    }, {
        BracketType:"\x7b2c\x32\x4ee3\x5e26\x72b6\x5f13\x91d1\x5c5e\x77eb\x6cbb\x5668\xff08\x4e09\x7c7b\xff09",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"283",
        BracketType_BracketId:"e465c706d4644bdf86c636d5bd7a70bf",
    }, {
        BracketType:"MEM类型被动自锁金属矫治器（通用）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"269",
        BracketType_BracketId:"ead7e75dfa094f9689a8e19b49d703f5",
    }, {
        BracketType:"Damon Q\x7c7b\x578b\x91d1\x5c5e\x77eb\x6cbb\x5668\xff08\x901a\x7528\xff09",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"267",
        BracketType_BracketId:"f37ab1eae57f4e7e8ab291b5ee5723b8",
    }]
const myINI2:Array<INIItem> = [{
        BracketType:"第2代带状弓金属矫治器（二类）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"281",
        BracketType_BracketId:"08146397fa7049a6acb87790cf2a6ebc"
    }, {
        BracketType:"传动自锁矫治器（三类）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"277",
        BracketType_BracketId:"10a80ea47059401299e82a527e25228c"
    }, {
        BracketType:"第2代带状弓金属矫治器（一类）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"285",
        BracketType_BracketId:"1767efd98e754c4484ff78b826e7b6f4"
    }, {
        BracketType:"3W系列 U-BEGG自锁3类",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"263",
        BracketType_BracketId:"18a78ec4464d4ae088e1834c9297030e"
    }, {
        BracketType:"第3代带状弓金属矫治器（一类）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"291",
        BracketType_BracketId:"1cab10526e0e46c5afd3faf0a8232952"
    }, {
        BracketType:"Damon Clear类型陶瓷自锁矫治器（通用）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"265",
        BracketType_BracketId:"1ce9ab7d77cd4e1488f8569563550595"
    }, {
        BracketType:"非凡 BioQuick 类型主动金属自锁矫治器（通用）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"315",
        BracketType_BracketId:"1de494fd5c0f4b33bff627c61bb0c2fd"
    }, {
        BracketType:"3M Victory Sseries 类型主动金属自锁矫治器（通用）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"313",
        BracketType_BracketId:"290c2d80ea3c483b9fb98c784a087989"
    }, {
        BracketType:"球形自锁类型矫治器(球托)",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"307",
        BracketType_BracketId:"349acf1ded464618ab6d7ad1b1207fc5"
    }, {
        BracketType:"单晶全同步带状弓矫治器（通用）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"279",
        BracketType_BracketId:"43e7147b51d942d280d00eea4a86a864",
    }, {
        BracketType:"PASS生理性支抗金属矫治器",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"271",
        BracketType_BracketId:"592cd39f3385417486d51ddad0c4249e",
    }, {
        BracketType:"Tomy 类型主动金属自锁矫治器（通用）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"273",
        BracketType_BracketId:"5bf3c6ba4e23424c8985116af1e0dd00",
    }, {
        BracketType:"3W系列 U-BEGG自锁2类",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"261",
        BracketType_BracketId:"63fb25d12b144267847727b4474d0082",
    }, {
        BracketType:"传动自锁矫治器（标准）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"275",
        BracketType_BracketId:"6eaffae065d84cf6afc3c253ae7f38c7",
    }, {
        BracketType:"新亚冰瓷直丝弓陶瓷矫治器（通用）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"295",
        BracketType_BracketId:"6fc636e9bf904971ad8af15e9bf8e64a",
    }, {
        BracketType:"第3代带状弓金属矫治器（二类）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"287",
        BracketType_BracketId:"7dc5ab5abcdc4409897b51062c0ae9c0",
    }, {
        BracketType:"3W系列 U-BEGG自锁1类",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"259",
        BracketType_BracketId:"7f0e59fb4ed844c5826daeb354ff44c9",
    }, {
        BracketType:"第3代带状弓金属矫治器（三类）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"289",
        BracketType_BracketId:"877cfb6b8ed44cd59d8ab8756b4c0751",
    }, {
        BracketType:"新亚星耀直丝弓自锁矫治器",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"299",
        BracketType_BracketId:"8d04e6f479e9464298f1751ff7aea09e",
    }, {
        BracketType:"新亚星耀PLUS直丝弓自锁矫治器",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"297",
        BracketType_BracketId:"b88a272600ec44dda64a0f5594deafd9",
    }, {
        BracketType:"3M Clarity Advanced 类型陶瓷托槽（通用）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"311",
        BracketType_BracketId:"bed70543f21246958931df9f1d2f0ce7",
    }, {
        BracketType:"第2代带状弓金属矫治器（三类）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"283",
        BracketType_BracketId:"e465c706d4644bdf86c636d5bd7a70bf",
    }, {
        BracketType:"MEM类型被动自锁金属矫治器（通用）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"269",
        BracketType_BracketId:"ead7e75dfa094f9689a8e19b49d703f5",
    }, {
        BracketType:"Damon Q类型金属矫治器（通用）",
        BracketType_archWidth:"0.5",
        BracketType_MultiBracketId:"267",
        BracketType_BracketId:"f37ab1eae57f4e7e8ab291b5ee5723b8",
    }]

const tcNameList:string[] = [  // 28个托槽顺序: 四颗一组, 7组
    "LL1", "LR1", "UL1", "UR1",
    "LL2", "LR2", "UL2", "UR2",
    "LL3", "LR3", "UL3", "UR3",
    "LL4", "LR4", "UL4", "UR4",
    "LL5", "LR5", "UL5", "UR5",
    "LL6", "LR6", "UL6", "UR6",
    "LL7", "LR7", "UL7", "UR7",
]

interface TcPosition {
    x: number,
    y: number,
    z: number
}
interface MoveOption {
    moveType: "Pan"|"Spin",
    moveStep:number,
    moveDirection: "UP"|"DOWN"|"LEFT"|"RIGHT"|"ANTI"|"ALONG"
}

// stl 显示牙齿保存的全局 对象
interface MainRenderObj {
    $self: vtkRenderWindow  // myScreenRenderder = myRenderWindow.newInstance() 创建的实例
    renderer: vtkRenderer  // 用于刷新 renderer = myScreenRenderder.getRenderer()
    rendererWindow: vtkRenderWindow  // 用于刷新 rendererWindow = myScreenRenderer.getRenderWindow()
}

// xml 部分使用的 interface
enum CadoType {
    "UPPER" = "upper",
    "LOWER" = 'lower',
    "OTHER" = "for test"
}
interface CadoParam {
    type: CadoType
    stl:ArrayBuffer
    xml:string
}
interface PositionCeil {
    $: {
        name: string
    }
    LongAxis: [{
        StartCoor: any[]
        EndCoor: any[]
        LocationCoor: any[]
    }]
    TcPosition: [{
        TcCenterAxis: any[]
        TcCenterCoor: any[]
        TcNormal: any[]
    }]
}
interface CADOObj {
    ClipModelResult: [{
        Ids: any[]
    }]
    OriginalModel: [{
        $: {
            jaw: string
        }
    }]
    PositionResult: [{
        $: {
            BracketType: string
        },
        Position: PositionCeil[]
    }]
    ProcessState: [{
        $: {
            clipState: string
            segementState: string
            getAxisState: string
            positionState: string
            fillholesState: string
        }
    }]
    SegementResult: [{
        $: {
            num: string
            classify: string
        }
    }]
}
interface XMLObj {
    CADOProject: CADOObj
}
interface MainCameraConfigs {
    viewUp: number[]
    front?:number[]
    left?:number[]
    right?:number[]
    position: {
        x: number
        y: number
        z: number
    }
    focalPoint: {
        x: number
        y: number
        z: number
    }
}

interface config_VIEWER {
    position:"UP"|"LOW"
}

@Component({})
export default class MainModelViewer extends Vue {
    @Prop({}) canvasId!:string

    get url_upload():string {
        return ((process.env.NODE_ENV === 'development') ? process.env.VUE_APP_BASEURL_DEV : process.env.VUE_APP_BASEURL_PRO) + '/teethAPI2.0/api/data/model'
    }

    xmlObj:CADOObj = {} as CADOObj
    mainRenderObj:MainRenderObj = {} as MainRenderObj  // 保存绘制窗口的renderer 和 rendererWindow 用于更新
    tcStlList:Array<{posName:string, tcStl:ArrayBuffer}> = []  // 托槽stl 列表 其中tcStlList[0] 为 牙齿模型
    tcActorList:Array<{
        name:string
        direction:{
            up: number[]
            left: number[]
            deep: number[]
        }
        actor:vtkActor
    }> = [] // 托槽 name-actor 对应 列表
    mainCameraConfigs:MainCameraConfigs = {} as MainCameraConfigs  // camera 的 初始参数 用于复位

    tcOnloadCounter:number = 0  // 28个托槽中'onload'的数量 --> 计数到28则触发 this.showStlList

    @Watch('tcOnloadCounter')
    showModelWhenReady(newVal:number, oldVal:number):void {
        if(newVal === 28) {  // 全都读完则显示
            this.showStlList(this.tcStlList)
            this.tcOnloadCounter = 0
        }
    }

    /**
     * @description 测试入口 直接通过input标签输入一个cado文件
     * @description 解析成 {...}:CadoParam 后进入正式入口 this.showCADO()
     */
    parseCADO(e:InputEvent):void {
        let fileName = (e.target as HTMLInputElement).files![0].name
        let fileSuffix = fileName.slice(fileName.lastIndexOf('.')+1)

        if(fileSuffix !== 'cado' && fileSuffix !== 'resultcado') {
            (this as any).$message({
                message: "文件格式错误",
                type: "error",
                center: true
            })
            return
        }
        else {
            const reader:FileReader = new FileReader()

            reader.onload = () => {
                const cadoFile:ArrayBuffer = reader.result as ArrayBuffer
                let dv:DataView = new DataView(cadoFile)

                let stlLength:number = dv.getUint32(80, true) * 50 + 84

                let stlFile:ArrayBuffer = cadoFile.slice(0, stlLength)  // stl part

                let xmlBlob:Blob = new Blob([cadoFile.slice(stlLength)])
                
                const xmlReader:FileReader = new FileReader()

                xmlReader.onload = () => {
                    let xmlFile:string = xmlReader.result as string

                    let param:CadoParam = {
                        type: CadoType['OTHER'],
                        stl: stlFile,
                        xml: xmlFile
                    }

                    this.showCADO(param)
                }
                xmlReader.readAsText(xmlBlob)
            }
            reader.readAsArrayBuffer((e.target as HTMLInputElement).files![0])
        }
    }

    /**
     * @param param : 包含 type、stl、xml的object
     * @description 整合后的入口 父组件直接传入 param (如下)
     * @description `this.$refs.$mainModel.showCADO(param)`
     * @description 找到对应的托槽类型(BracketType) 然后调用 `this.parseMutilStl(BracketType)`
     */
    async showCADO(param:CadoParam):Promise<void> {
        // 解析xml部分,转为obj并存储到 `this.xmlObj`; 节点属性用 $.xxx 提取
        await this.parseXmlStr(param.xml)

        // 把牙齿stl模型先push入 tcStlList -> 即 tcStlList[0] 为 牙齿模型
        this.tcStlList.push({posName: 'TOOTH', tcStl: param.stl})

        // 找到托槽名字
        let targetId = this.xmlObj.PositionResult[0].$.BracketType
        let targetTypeName = ''
        myINI2.forEach((item, index, arr) => {
            if(item.BracketType_BracketId === targetId) {
                targetTypeName = item.BracketType
            }
        })

        await this.parseMutilStl(targetTypeName)  // 获取文件并解析出28个牙齿托槽文件
    }

    /**
     * @param mutilStlFileName *.MutilBracket 文件名
     * @description 获取public中的 *.MutilBracket 文件 解析并返回 stl文件数组
     * @returns \{pos:number, tcStl:ArrayBuffer\}[]
     */
    async parseMutilStl(mutilStlFileName:string):Promise<void> {
        let url = '/BracketData/' + mutilStlFileName + '.MutilBracket'

        // 获取托槽文件
        await (this as any).axios.get(url, {responseType: "arraybuffer"})
        .then((res:any) => {
            const readOnce:FileReader = new FileReader()
            let mutilBlobFile:Blob = new Blob([res.data], {type: 'application/octet-stream'})

            readOnce.onload = () => {
                let plugIn80 = new Uint8Array(80)  // 80 字节
                let fullFileAB:ArrayBuffer = (readOnce.result as ArrayBuffer)  // 整个file 读取为 ArrayBuffer
                let dv = new DataView(fullFileAB)
                let totalByte = fullFileAB.byteLength  // 文件总的字节数
                let startIndex = 75  // slice()的起始index

                // 从 index=75 开始 每(4 + 50 * n)个字节为一个stl部分
                // fullFileAB.slice(startIndex, length), 并在头部拼接Uint8Array(80)作为头部 形成完整stl文件
                this.tcOnloadCounter = 0  // 计数器复位
                
                for(let i = 0;;i++) {
                    let stlReader = new FileReader()
                    let faceNum = dv.getUint32(startIndex, true)  // 当前stl的面片数
                    let length = faceNum * 50 + 4
                    let u8view = new Uint8Array(fullFileAB.slice(startIndex, startIndex + length))  // 剪切一个stl文件
                    startIndex += length  // 下一次剪切的起始位置

                    let stlBlob = new Blob([plugIn80, u8view])  // 加上头部, 拼成一个完整的stl文件

                    stlReader.readAsArrayBuffer(stlBlob)
                    stlReader.onload = () => {
                        // onload 不能用 async/await 同步到 所需设置一个变量用来 watch 然后触发 this.showStlList
                        // 按顺序读取, 读完后push到托槽列表中
                        this.tcStlList.push({posName:tcNameList[i], tcStl: stlReader.result as ArrayBuffer})
                        this.tcOnloadCounter += 1
                    }
                    if(startIndex >= totalByte) {  // 读取完 退出循环
                        break
                    }
                }
            }
            readOnce.readAsArrayBuffer(mutilBlobFile)
        })
    }

    /**
     * @param stlList:Array\<ArrayBuffer\> stl文件数组
     * @description 同时展示多个stl文件
     */
    showStlList(stlList:Array<{posName:string, tcStl:ArrayBuffer}>):void {
        // stlList.length === 29
        // stlList[0] 为 牙齿模型 --> 不进行额外处理
        // stlList[1] - stlList[28] 为28个托槽模型

        // 镜头的viewUp
        let modelViewUp = [0, 1, 0]  // default
        let front:number[] = []
        let left:number[] = []
        let right:number[] = []

        // 渲染窗口
        let myScreenRenderer = myRenderWindow.newInstance({background:[1, 1, 0.94], targetId: this.canvasId})
        let renderer:vtkRenderer = myScreenRenderer.getRenderer()
        let rendererWindow:vtkRenderWindow = myScreenRenderer.getRenderWindow()

        // 保存绘制窗口的renderer和rendererWindow
        this.mainRenderObj = {
            $self: myScreenRenderer,
            renderer: renderer,
            rendererWindow: rendererWindow
        }

        // 添加牙齿模型的actor
        let toothActor = this.readStl(stlList[0].tcStl)
        renderer.addActor(toothActor)

        // 设置需要的托槽的位置、方向以及是否显示
        // 同时保存托槽模型的actor用于交交互调整
        let needPosList = this.xmlObj.PositionResult[0].Position  // 需要的托槽模型的列表(数组)
        let needNameList:Array<string> = []  // 需要的托槽的name值

        needPosList.forEach((item, index, arr) => {
            needNameList.push(item.$.name)
        })

        this.$emit('getNameList', needNameList)  // 保存到父组件

        stlList.forEach((item, index, arr) => {
            let searchResult = needNameList.indexOf(item.posName)
            
            if(searchResult !== -1) {  // 匹配到
                // 获取当前托槽的actor
                let actor = this.readStl(item.tcStl)

                // 1. 获取原始点集与目标点集
                    // 目标中心点
                    let centerPoint = needPosList[searchResult].TcPosition[0].TcCenterCoor[0].$
                    let [ Center0, Center1, Center2 ] = [parseFloat(centerPoint.Coor0), parseFloat(centerPoint.Coor1), parseFloat(centerPoint.Coor2)]
                    
                    // 向量1
                    let tcCenter = needPosList[searchResult].TcPosition[0].TcCenterAxis[0].$
                    let [ tcCenter0, tcCenter1, tcCenter2 ] = [parseFloat(tcCenter.Coor0), parseFloat(tcCenter.Coor1), parseFloat(tcCenter.Coor2)]

                    // 向量2
                    let tcNormal = needPosList[searchResult].TcPosition[0].TcNormal[0].$
                    let [ tcNormal0, tcNormal1, tcNormal2 ] = [parseFloat(tcNormal.Coor0), parseFloat(tcNormal.Coor1), parseFloat(tcNormal.Coor2)]

                    // 计算的法向量3
                    let [ cal0, cal1, cal2 ] = this.calculateN([tcCenter0, tcCenter1, tcCenter2], [tcNormal0, tcNormal1, tcNormal2])
                
                // 2. 点集转成vtkPoints
                    let originPoints = vtkPoints.newInstance()  // 原始点集
                    let targetPoints = vtkPoints.newInstance()  // 目标点集
                    
                    originPoints.setNumberOfPoints(3)
                    originPoints.setPoint(0, 1, 0, 0)  // centerAxis
                    originPoints.setPoint(1, 0, 1, 0)  // normal
                    originPoints.setPoint(2, 0, 0, 1)  // 法向量

                    targetPoints.setNumberOfPoints(3)
                    targetPoints.setPoint(0, Center0+tcCenter0, Center1+tcCenter1, Center2+tcCenter2)
                    targetPoints.setPoint(1, Center0+tcNormal0, Center1+tcNormal1, Center2+tcNormal2)
                    targetPoints.setPoint(2, Center0+cal0, Center1+cal1, Center2+cal2)

                // 3. 根据点集计算转换矩阵
                    let transform = vtkLandmarkTransform.newInstance()

                    transform.setMode(Mode.RIGID_BODY)  // 刚性变换
                    transform.setSourceLandmark(originPoints)
                    transform.setTargetLandmark(targetPoints)
                    transform.update()
                    let resultMat4:mat4 = transform.getMatrix()
                
                // 托槽变换
                actor.setUserMatrix(resultMat4)

                // 保存当前模型的向上方向
                if(item.posName === "UL1") {
                    modelViewUp = [-tcCenter0, -tcCenter1, -tcCenter2]  // 模型的[上]方向
                    front = [tcNormal0, tcNormal1, tcNormal2]  // [前]方向 - 托槽法向量
                    left = [cal0, cal1, cal2]  // [左]
                    right = [-cal0, -cal1, -cal2]  // [右]
                }
                else if(item.posName === "LL1") {
                    modelViewUp = [tcCenter0, tcCenter1, tcCenter2]  // 模型的[上]方向
                    front = [tcNormal0, tcNormal1, tcNormal2]
                    left = [-cal0, -cal1, -cal2]
                    right = [cal0, cal1, cal2]
                }
                
                // 保存托槽actor、模型坐标系三轴方向并添加到renderer
                let direction = {
                    up: [cal0, cal1, cal2],
                    left: [-tcCenter0, -tcCenter1, -tcCenter2],
                    deep: [tcNormal0, tcNormal1, tcNormal2]
                }
                this.tcActorList.push({name:item.posName, direction:direction, actor:actor})  // 保存起来用于交互
                
                renderer.addActor(actor)  // 添加到renderer
            }
        })
        
        // 渲染
        renderer.resetCamera()
        rendererWindow.render()

        // 保存相机参数 用于复位
        let mainCamera = this.mainRenderObj.renderer.getActiveCamera()
        let cameraConfigs:MainCameraConfigs = {
            viewUp: modelViewUp,
            front: front,
            left: left,
            right: right,
            position: {
                x: mainCamera.getPosition()[0],
                y: mainCamera.getPosition()[1],
                z: mainCamera.getPosition()[2]
            },
            focalPoint: {
                x: mainCamera.getFocalPoint()[0],
                y: mainCamera.getFocalPoint()[1],
                z: mainCamera.getFocalPoint()[2]
            }
        }
        this.mainCameraConfigs = cameraConfigs
        
        // 正面朝前
        this.resetView("FRONT")
    }

    /**
     * @description 读取单个stl文件 设置 mapper 并返回 actor
     * @returns vtkActor
     */
    readStl(stlFile:ArrayBuffer):vtkActor {
        const reader = vtkSTLReader.newInstance()
        const mapper = vtkMapper.newInstance({scalarVisibility:false})
        const actor = vtkActor.newInstance()

        actor.setMapper(mapper)
        actor.getProperty().setColor(1, 1, 1)
        mapper.setInputConnection(reader.getOutputPort())
        reader.parseAsArrayBuffer(stlFile)
        
        return actor
    }

    /**
     * @description 解析 xml字符串 存储到 `this.xmlObj`
     */
    async parseXmlStr(xmlStr:string):Promise<void> {
        let result = await xml2js.parseStringPromise(xmlStr).then((result:XMLObj) => {
            this.xmlObj = result.CADOProject
        })
    }

    /**
     * @description 输入两个向量 a、b => float[3]
     * @returns 返回法向量 n[3]
     */
    calculateN(a:number[], b:number[]):number[] {
        let x = a[1] * b[2] - a[2] * b[1]
        let y = a[2] * b[0] - a[0] * b[2]
        let z = a[0] * b[1] - a[1] * b[0]

        return [x, y, z]
    }

    /**
     * @param A - 定点A
     * @param B - 动点B
     * @param newDis - 距离
     * @returns 返回B点新坐标 B'
     */
    calculateNewB(A:number[], B:number[], newDis:number):number[] {
        let abs = [A[0]-B[0], A[1]-B[1], A[2]-B[2]]

        let oldDis = Math.sqrt(abs[0]*abs[0]+abs[1]*abs[1]+abs[2]*abs[2])
        let scale = newDis / oldDis

        let newB = [B[0]*scale, B[1]*scale, B[2]*scale]

        return newB
    }

    /**
     * @param originP - 原点
     * @param direction - 单位方向向量
     * @param distance - 距离
     * @returns 返回终点
     */
    calculateByScale(originP:number[], direction:number[], distance:number) {
        return [originP[0]+direction[0]*distance, originP[1]+direction[1]*distance, originP[2]+direction[2]*distance]
    }

    /**
     * @description 托槽移动
     */
    tcMove(tcName:string, moveOption:MoveOption):void {
        let actor:vtkActor|null = null
        let direction:{
            up: number[]
            left: number[]
            deep: number[]
        } = {} as {
            up: number[]
            left: number[]
            deep: number[]
        }

        this.tcActorList.forEach((item, index, arr) => {
            if(item.name === tcName) {
                actor = item.actor  // 取出 vtkActor
                direction = item.direction  // 取出 方向
            }
        })

        if(actor === null) {  // 没找到则返回
            return
        }

        // - - - 找到当前托槽对应 actor - - -
        // 保存 camera 当前位置和焦距
        let camera = this.mainRenderObj.renderer.getActiveCamera()
        let focalP = camera.getFocalPoint()
        let focalDis = camera.getDistance()
        
        // 获取步长
        let step = moveOption.moveStep

        if(moveOption.moveType === "Pan") {  // 平移
            switch(moveOption.moveDirection) {
                case "UP":
                    (actor as vtkActor).addPosition([step*direction.up[0], step*direction.up[1], step*direction.up[2]])
                    break
                case "DOWN":
                    (actor as vtkActor).addPosition([-step*direction.up[0], -step*direction.up[1], -step*direction.up[2]])
                    break
                case "LEFT":
                    (actor as vtkActor).addPosition([step*direction.left[0], step*direction.left[1], step*direction.left[2]])
                    break
                case "RIGHT":
                    (actor as vtkActor).addPosition([-step*direction.left[0], -step*direction.left[1], -step*direction.left[2]])
                    break
            }
        }
        else {  // 旋转
            switch(moveOption.moveDirection) {
                case "ANTI":
                    (actor as vtkActor).rotateWXYZ(-step, direction.deep[0], direction.deep[1], direction.deep[2])
                    break
                case "ALONG":
                    (actor as vtkActor).rotateWXYZ(step, direction.deep[0], direction.deep[1], direction.deep[2])
                    break
            }
        }
        
        // 渲染
        this.mainRenderObj.rendererWindow.render()
    }

    /**
     * @description 托槽高亮显示
     * @param 传入 新选择的托槽名和原先高亮的托槽名
     */
    tcHighLight(newTc:string, oldTc:string):void {
        this.tcActorList.forEach((item, index, arr) => {
            if(item.name === newTc) {  // 新选中的托槽 变色
                item.actor.getProperty().setColor(0.94, 0.90, 0.55)
            }
            if(item.name === oldTc) {  // 原先的托槽 变回
                item.actor.getProperty().setColor(1, 1, 1)
            }
        })
        this.mainRenderObj.rendererWindow.render()
    }

    /**
     * @description 设置相机方向 复位到 前/左/右
     */
    resetView(from:"LEFT"|"RIGHT"|"FRONT"):void {
        // 获取当前相机
        let camera = this.mainRenderObj.renderer.getActiveCamera()

        // 设置相机[上]方向
        camera.setViewUp(this.mainCameraConfigs.viewUp)

        // 获取当前焦点、焦距
        let focalP = camera.getFocalPoint()
        let focalDis = camera.getDistance()

        if(from === "FRONT") {
            // 计算在当前焦距下、特定方向下的相机位置
            let finalPos1 = this.calculateByScale(focalP, this.mainCameraConfigs.front!, focalDis)

            camera.setFocalPoint(this.mainCameraConfigs.focalPoint.x, this.mainCameraConfigs.focalPoint.y, this.mainCameraConfigs.focalPoint.z)
            camera.setPosition(finalPos1[0], finalPos1[1], finalPos1[2])
        }
        else if(from === "LEFT") {
            // 计算在当前焦距下、特定方向下的相机位置
            let finalPos2 = this.calculateByScale(focalP, this.mainCameraConfigs.left!, focalDis)

            camera.setFocalPoint(this.mainCameraConfigs.focalPoint.x, this.mainCameraConfigs.focalPoint.y, this.mainCameraConfigs.focalPoint.z)
            camera.setPosition(finalPos2[0], finalPos2[1], finalPos2[2])
        }
        else if(from === "RIGHT") {
            // 计算在当前焦距下、特定方向下的相机位置
            let finalPos3 = this.calculateByScale(focalP, this.mainCameraConfigs.right!, focalDis)

            camera.setFocalPoint(this.mainCameraConfigs.focalPoint.x, this.mainCameraConfigs.focalPoint.y, this.mainCameraConfigs.focalPoint.z)
            camera.setPosition(finalPos3[0], finalPos3[1], finalPos3[2])
        }

        // This method must be called when the focal point or camera position changes
        camera.computeDistance()

        // 渲染
        this.mainRenderObj.rendererWindow.render()
    }

    /**
     * @description 重置模型(取消微调的修改)
     */
    resetModel():void {
        this.showStlList(this.tcStlList)
    }

    /**
     * @description 确认并上传
     */
    checkAndUpload(uid:string, remarks:string):void {
        // 1. 恢复XML
            let newPosArr = this.tcActorList  // 新信息

            // 更新 xmlobj 信息
            this.xmlObj.PositionResult[0].Position.forEach((item, index, arr) => {
                let info = newPosArr.find((val) => {
                    return (val.name === item.$.name)
                })

                // 1. actor位置
                let position = info!.actor.getPosition()
                item.TcPosition[0].TcCenterCoor[0].$ = {
                    Coor0: position[0].toString(),
                    Coor1: position[1].toString(),
                    Coor2: position[2].toString()
                }
                
                // 2. TcCenterAxis
                let center = info!.direction.left  // 全反
                item.TcPosition[0].TcCenterAxis[0].$ = {
                    Coor0: (-center[0]).toString(),
                    Coor1: (-center[1]).toString(),
                    Coor2: (-center[2]).toString()
                }
                
                // 3. TcNormal
                let normal = info!.direction.deep
                item.TcPosition[0].TcNormal[0].$ = {
                    Coor0: normal[0].toString(),
                    Coor1: normal[1].toString(),
                    Coor2: normal[2].toString()
                }
            })

            // 转回 xmlstr
            let bulider = new xml2js.Builder()
            let obj:XMLObj = {
                CADOProject: this.xmlObj
            }
            let xml:string = bulider.buildObject(obj)

            // 转回原先的 xml 形式 -> 去除xml声明 -> 完全一致
            xml = xml.slice(xml.indexOf("<CADOProject>"))
        
        // 2. 拼接 STL 与 XML
        let stlObj = this.tcStlList.find((item) => {
            return item.posName == "TOOTH"
        })
        let stl = stlObj!.tcStl
        let cado = new Blob([stl, xml])  // 拼接

        // 3. 上传
        let myForm = new FormData()
        myForm.append("patientUid", uid)
        myForm.append("ModelStateChange", "1")
        myForm.append("Remarks", remarks)
        myForm.append("file", cado)
        if(this.canvasId == "upperMain") {
            myForm.append("modelType", "UpperConfig")
        }
        else {
            myForm.append("modelType", "LowerConfig")
        }
        this.myAjax(myForm)
    }

    myAjax(form:FormData) {
        let xhr = new XMLHttpRequest()

        xhr.open("POST", this.url_upload)
        xhr.send(form)
        xhr.onload = () => {
            // 3. 上传完成
            let param:config_VIEWER = {} as config_VIEWER
            if(this.canvasId == "upperMain") {
                param.position = "UP"
            }
            else if(this.canvasId == "lowerMain") {
                param.position = "LOW"
            }

            this.$emit("done", param)
        }
    }

    uploadXHR(uid:string, remarks:string, file:any):Promise<void> {
        let url = this.url_upload
        let params = {
            "patientUid":encodeURI(uid),
            "modelType":(this.canvasId == "upperMain") ? "UpperConfig" : "LowerConfig",
            "ModelStateChange": "1",
            "file":file,
            "Remarks": remarks
        }

        return this.axios.post(url, params)
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