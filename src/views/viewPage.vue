<template>
    <div id="view">
        <el-dialog
            :visible="ifShowDialog0"
            :modal="false"
            width="40%"
            :show-close="false">
            <template slot="title">
                <el-steps :active="dialog0Step" align-center finish-status="success">
                    <el-step title="模型选择"></el-step>
                    <el-step title="矫治器选择"></el-step>
                    <el-step title="确认"></el-step>
                    <el-step title="上传"></el-step>
                </el-steps>
            </template>
            <template>
                <div v-show="dialog0Step==0">
                    <el-form id="dialog0" :model="uploadForm" size="mini">
                        <el-form-item label="上颌牙:">
                            <input id="upperInput" type="file"></input>
                        </el-form-item>
                        <el-form-item label="下颌牙:">
                            <input id="lowerInput" type="file"></input>
                        </el-form-item>
                        <el-form-item label="全景图:">
                            <input id="fullInput" type="file"></input>
                        </el-form-item>
                        <el-form-item label="拔牙计划:">
                            <label v-for="(item, index) in uploadForm.upperTeethSelect.right" :key="index">
                                <span class="select"><input type="checkbox" v-model="uploadForm.upperTeethSelect.right[index]">{{index}}</span>
                            </label><br>
                        </el-form-item>
                        <el-form-item label="拔牙计划:">
                            <label v-for="(item, index) in uploadForm.upperTeethSelect.left" :key="index">
                                <span class="select"><input type="checkbox" v-model="uploadForm.upperTeethSelect.left[index]">{{index}}</span>
                            </label>
                        </el-form-item>
                        <el-form-item label="拔牙计划:">
                            <label v-for="(item, index) in uploadForm.upperTeethSelect.right" :key="index">
                                <span class="select"><input type="checkbox" v-model="uploadForm.lowerTeethSelect.right[index]">{{index}}</span>
                            </label><br>
                        </el-form-item>
                        <el-form-item label="拔牙计划:">
                            <label v-for="(item, index) in uploadForm.upperTeethSelect.left" :key="index">
                                <span class="select"><input type="checkbox" v-model="uploadForm.lowerTeethSelect.left[index]">{{index}}</span>
                            </label>
                        </el-form-item>
                        <el-form-item label="导板分段计划">
                            <select style="outline:none" @change="ifDefault=!ifDefault">
                                <option value="默认">默认</option>
                                <option value="自定义">自定义</option>
                            </select>
                            <span v-show="ifDefault"> 默认建议: 由优易根据牙列情况设计分段，一般单颌分为三段</span>
                            <span v-show="!ifDefault">
                                <br>
                                <textarea v-model="uploadForm.myPlan" rows="3" style="outline:none; width:100%; resize:none" placeholder="请输入自定义分段计划... ..."></textarea>
                            </span>
                        </el-form-item>
                        <el-form-item label="其他备注信息">
                            <span>
                                <br>
                                <textarea v-model="uploadForm.myNote" rows="3" style="outline:none; width:100%; resize:none" placeholder="请输入备注信息... ..."></textarea>
                            </span>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-show="dialog0Step==1">
                    <el-form :model="uploadForm" size="mini">
                        <el-form-item label="矫治器类型:">
                            <el-select v-model="uploadForm.select1" @change="uploadForm.select2=0">
                                <el-option v-for="(item, index) in bracketList" :value="index" :label="item.BracketTypeName" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="矫治器名称:">
                            <el-select v-model="uploadForm.select2">
                                <el-option v-for="(item, index) in bracketList[uploadForm.select1].BracketTypes" :value="index" :label="item" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-show="dialog0Step==2">
                    <el-form id="dialog2" :model="uploadForm" size="mini">
                        <el-form-item label="请仔细阅读下列上传须知">
                            <br><textarea class="txt-area1" v-model="uploadForm.infoText1" disabled></textarea>
                        </el-form-item>
                        <el-form-item label="上传明细">
                            <br><textarea class="txt-area2" v-model="uploadForm.infoText2" disabled></textarea>
                        </el-form-item>
                        <el-form-item label="">
                            <label>
                                <input type="checkbox" v-model="uploadForm.ifCheck">
                                <span>我已仔细阅读上传须知，确认数据无误，确定上传数据</span>
                            </label>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-show="dialog0Step==3">
                    <el-form id="dialog3" :model="uploadForm" size="mini">
                        <el-form-item label="上颌牙">
                            <span v-show="uploadProgress[0]==0">[未选择]</span>
                            <span v-show="uploadProgress[0]==100">[完成]</span>
                            <br><el-progress :percentage="uploadProgress[0]" status="success"></el-progress>
                        </el-form-item>
                        <el-form-item label="下颌牙">
                            <span v-show="uploadProgress[1]==0">[未选择]</span>
                            <span v-show="uploadProgress[1]==100">[完成]</span>
                            <br><el-progress :percentage="uploadProgress[1]" status="success"></el-progress>
                        </el-form-item>
                        <el-form-item label="全景图">
                            <span v-show="uploadProgress[2]==0">[未选择]</span>
                            <span v-show="uploadProgress[2]==100">[完成]</span>
                            <br><el-progress :percentage="uploadProgress[2]" status="success"></el-progress>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
            <template slot="footer">
                <el-button @click="dialogButton(0, 'cancel')" size="mini" plain type="danger">取消</el-button>
                <el-button @click="dialogButton(0, 'previous')" size="mini" plain type="warning" :disabled="dialog0Step==0">上一步</el-button>
                <el-button @click="dialogButton(0, 'next')" size="mini" plain type="primary" :disabled="dialog0Step==2">下一步</el-button>
                <el-button @click="dialogButton(0, 'check')" size="mini" plain type="success" :disabled="dialog0Step==2? !uploadForm.ifCheck: (dialog0Step == 3 ? !ifFinish : true)">确定</el-button>
            </template>
        </el-dialog>

        <dialog1
            :uid="patientInfo.uid"
            :ifDisable="ifDisable1"
            :visible="ifShowDialog1"/>

        <dialog2
            data-note="复用组件，通过传参type确定其功能"
            ref="dialog2"
            :uid="patientInfo.uid"
            :ifDisable="ifDisable2"
            :visible="ifShowDialog2"
            :workType="dialog2Type"
            @parsed="showMainModel"
            @saveonline="vuex_dialog"
            @confirm="vuex_dialog"/>

        <el-container style="position:absolute; z-index:0; width:100%; height:100%;">
            <el-header id="head" height="66px">
                <el-row style="height:100%; user-select:none">
                    <el-col :span="1" style="height:100%">
                        <img class="IconLarge" src="@/assets/Icon_index.png">
                    </el-col>
                    <el-col :span="3" class="titleBlock">
                        <b>当前用户</b><br>{{patientInfo['userName']}}
                    </el-col>
                    <el-col :span="4" class="titleBlock">
                        <el-dropdown
                            class="dropdown"
                            :hide-on-click="false"
                            trigger="click"
                            placement="bottom-start">
                            <span class="opBlock">
                                病例详情
                                <i class="el-icon-arrow-down"></i>
                            </span>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="(item, index) in detailList" :key="index">
                                    <b>{{item}}</b> : {{cutByBlank(patientInfo[index])}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                    <el-col :span="8" class="titleBlock"></el-col>
                    <el-col :span="2" class="titleBlock opBlock" v-for="(item, index) in opList" :key="index">
                        <span style="width:100%; height:100%; display:block" @click="opFunction(index+1)">
                            {{item.name}}
                        </span>
                    </el-col>
                </el-row>
            </el-header>
            <el-container>
                <el-aside
                    id="aside"
                    style="overflow-x:hidden">
                    <el-menu
                        ref="elMenu"
                        :unique-opened=true
                        :collapse-transition=false
                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#fff"
                        style="height:100%;">
                        <el-submenu index="0" :disabled="ifDisableOp">
                            <template slot="title">
                                <i class="el-icon-aim"></i>
                                <span>细调操作</span>
                            </template>
                            <el-menu-item-group>
                                <template slot="title">
                                    设置调整步长
                                </template>
                                <el-menu-item>
                                    <el-row>
                                        <el-col :span="12" class="adjustStep">
                                            平移: <input type="number" step="0.01" v-model="adjustStep">mm
                                        </el-col>
                                        <el-col :span="12" class="adjustStep">
                                            旋转: <input type="number" step="0.5" v-model="adjustAngle">度
                                        </el-col>
                                    </el-row>
                                </el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group>
                                <template slot="title">
                                    平移
                                </template>
                                <el-menu-item>
                                    <el-row>
                                        <el-col :span="8" :push="8">
                                            <button class="adjustButton" @click="adjustButton('UP')">上</button>
                                        </el-col>
                                    </el-row>
                                </el-menu-item>
                                <el-menu-item>
                                    <el-row>
                                        <el-col :span="8">
                                            <button class="adjustButton" @click="adjustButton('LEFT')">左</button>
                                        </el-col>
                                        <el-col :span="8" style="font-size:12px; text-align:center; color: khaki">
                                            当前:{{ (currentSelectedToothName == '') ? '未选择' : currentSelectedToothName}}
                                        </el-col>
                                        <el-col :span="8">
                                            <button class="adjustButton" @click="adjustButton('RIGHT')">右</button>
                                        </el-col>
                                    </el-row>
                                </el-menu-item>
                                <el-menu-item>
                                    <el-row>
                                        <el-col :span="8" :push="8">
                                            <button class="adjustButton" @click="adjustButton('DOWN')">下</button>
                                        </el-col>
                                    </el-row>
                                </el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group>
                                <template slot="title">
                                    旋转
                                </template>
                                <el-menu-item>
                                    <el-row>
                                        <el-col :span="8" :push="3">
                                            <button class="adjustButton" @click="adjustButton('ANTI')">逆时针</button>
                                        </el-col>
                                        <el-col :span="8" :push="5">
                                            <button class="adjustButton" @click="adjustButton('ALONG')">顺时针</button>
                                        </el-col>
                                    </el-row>
                                </el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group>
                                <template slot="title">
                                    确认
                                </template>
                                <el-menu-item>
                                    <el-row>
                                        <el-col :span="8">
                                            <button class="adjustButton" @click="adjustButton('CANCEL')">取消</button>
                                        </el-col>
                                        <el-col :span="8">
                                            <button class="adjustButton" @click="adjustButton('RESET')">还原</button>
                                        </el-col>
                                        <el-col :span="8">
                                            <button class="adjustButton" @click="adjustButton('CONFIRM')">确认</button>
                                        </el-col>
                                    </el-row>
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-user"></i>
                                <span>病例进度</span>
                            </template>
                            <el-menu-item-group>
                                <template slot="title">
                                    上颌牙:
                                </template>
                                <el-menu-item style="height:10px">
                                    <el-progress :percentage="upperProgress" :show-text=false></el-progress>
                                </el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group>
                                <template slot="title">
                                    下颌牙:
                                </template>
                                <el-menu-item style="height:10px">
                                    <el-progress :percentage="lowerProgress" :show-text=false></el-progress>
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title">
                                <i class="el-icon-edit"></i>
                                <span>备注</span>
                            </template>
                            <el-menu-item class="note">
                                <textarea class="noteArea" v-model="patientInfo.remarks"></textarea>
                            </el-menu-item>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title">
                                <i class="el-icon-mouse"></i>
                                <span>功能</span>
                            </template>
                            <el-menu-item v-for="(item, index) in asideOpList" :key="index">
                                <span :class="{asideOp:asideAbleList[index], disabledOp:!asideAbleList[index]}" @click="asideOpFunction(index)">
                                    <img class="icon" :src="item.img">
                                    <span> {{ item.name }} </span>
                                </span>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main id="main">
                    <el-container style="position:absolute;height:100%;width:100%">
                        <el-aside :width="ifDisableOp ? '100%' : '75%'">
                            <el-radio-group v-model="currentShowMain" size="small" fill="#00ffff" class="radioButtonGroup">
                                <el-radio-button label="1">
                                    <img class="imgButton" src="@/assets/Icon_view_upper.png">
                                </el-radio-button>
                                <el-radio-button label="2">
                                    <img class="imgButton" src="@/assets/Icon_view_lower.png">
                                </el-radio-button>
                            </el-radio-group>
                            <el-button-group class="buttonGroup" v-show="currentShowMain >= 1">
                                <el-button size="small" @click="resetViewDirection('LEFT')">
                                    <img src="@/assets/Icon_view_left.png">
                                </el-button>
                                <el-button size="small" @click="resetViewDirection('FRONT')">
                                    <img src="@/assets/Icon_view_front.png">
                                </el-button>
                                <el-button size="small" @click="resetViewDirection('RIGHT')">
                                    <img src="@/assets/Icon_view_right.png">
                                </el-button>
                            </el-button-group>
                            <main-model-viewer ref="mainUpper" v-show="currentShowMain==1" :canvasId="upperMainId" @getNameList="saveTcNameList($event, 'UP')" @done="vuex_viewer" />
                            <main-model-viewer ref="mainLower" v-show="currentShowMain==2" :canvasId="lowerMainId" @getNameList="saveTcNameList($event, 'LOW')" @done="vuex_viewer" />
                        </el-aside>
                        <el-main :width="ifDisableOp ? '0px' : '25%'" v-show="!ifDisableOp" class="popMain">
                            <div class="adjustPop">
                                <div class="oneSide" v-for="(item1, index1) in adjustTeethLists">
                                    <el-row>
                                        <el-col :span="3" v-for="(item2, index2) in item1" class="nameBox" @click.native="updateSelect(item2.name)" :key="item2.name">
                                            {{ item2.name }}
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="3" v-for="(item2, index2) in item1" class="numBox" :key="item2.name">
                                            {{ item2.num }}
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </el-main>
                    </el-container>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script lang="ts">
import { Form } from 'element-ui'
import { Vue, Component, Watch } from 'vue-property-decorator'

import Dialog1 from '@/components/viewPage/dialog1.vue'
import Dialog2 from '@/components/viewPage/dialog2.vue'

import MainModelViewer from '@/components/viewPage/MainModelViewer.vue'
import { ElMenu } from 'element-ui/types/menu'

interface UploadForm {
    upperFileName:string
    lowerFileName:string
    fullImgName:string
    upperTeethSelect: {
        right: {
            [key:string]:boolean
            'UR7':boolean, 'UR6':boolean, 'UR5':boolean, 'UR4':boolean, 'UR3':boolean, 'UR2':boolean, 'UR1':boolean
        },
        left: {
            [key:string]:boolean
            'UL7':boolean, 'UL6':boolean, 'UL5':boolean, 'UL4':boolean, 'UL3':boolean, 'UL2':boolean, 'UL1':boolean
        }
    }
    lowerTeethSelect: {
        right: {
            [key:string]:boolean
            'LR7':boolean, 'LR6':boolean, 'LR5':boolean, 'LR4':boolean, 'LR3':boolean, 'LR2':boolean, 'LR1':boolean,
        },
        left: {
            [key:string]:boolean
            'LL7':boolean, 'LL6':boolean, 'LL5':boolean, 'LL4':boolean, 'LL3':boolean, 'LL2':boolean, 'LL1':boolean
        }
    }
    myPlan:string
    myNote:string
    myRemark:string
    select1:number
    select2:number
    infoText1:string
    infoText2:string
    ifCheck:boolean
}
class EmptyForm implements UploadForm {
    public upperFileName = ''
    public lowerFileName = ''
    public fullImgName = ''
    public upperTeethSelect = {
        right: {
            'UR7': false, 'UR6': false, 'UR5': false, 'UR4': false, 'UR3': false, 'UR2': false, 'UR1': false
        },
        left: {
            'UL7': false, 'UL6': false, 'UL5': false, 'UL4': false, 'UL3': false, 'UL2': false, 'UL1': false
        }
    }
    public lowerTeethSelect = {
        right: {
            'LR7': false, 'LR6': false, 'LR5': false, 'LR4': false, 'LR3': false, 'LR2': false, 'LR1': false,
        },
        left: {
            'LL7': false, 'LL6': false, 'LL5': false, 'LL4': false, 'LL3': false, 'LL2': false, 'LL1': false
        }
    }
    public myPlan = ''
    public myNote = ''
    public myRemark = ''
    public select1 = 0
    public select2 = 0
    public infoText1 = "1、本人同意将此数据用于该软件制造方使用, 同意用于生成正畸方案，并对整个过程中需要的费用有了清楚的了解，愿意承担需要支付的费用。\n\n2、数据上传之后不能再做更改。"
    public infoText2 = ""
    public ifCheck = false
}
interface Patient {
    uid:string
    id:string
    name:string
    age:string
    gender:string
    creatTime:string
    ModelState:string
    UpperOriginalModel:string
    LowerOriginalModel:string
    UpperProcessConfig:string
    LowerProcessConfig:string
    UpperUserCheck:string
    LowerUserCheck:string
    UpperDBoardModel:string
    LowerDBoardModel:string
    bracketType:string
    upperDeliveryAddress:string
    lowerDeliveryAddress:string
    userName:string
    userCompany:string
    userId:string
    expertName:string
    expertInstitute:string
    paymentInfo:string
    pictureFlag:string
    remarks:string
}
interface CadoObj {
    type: "upper"|"lower",
    stl: ArrayBuffer,
    xml: string
}

interface MoveOption {
    moveType: "Pan"|"Spin",
    moveStep:number,
    moveDirection: "UP"|"DOWN"|"LEFT"|"RIGHT"|"ANTI"|"ALONG"|"CANCEL"|"RESET"|"CONFIRM"
}

enum DialogType {
    DOWNLOAD,
    SAVEONLINE,
    CONFIRM
}

interface config_DIALOG {
    select: [boolean, boolean]
}
interface config_VIEWER {
    position:"UP"|"LOW"
}

@Component({
    components: {
        Dialog1,
        Dialog2,
        MainModelViewer
    }
})
export default class viewPage extends Vue {
    currentShowMain:number = 0
    upperMainId:string = "upperMain"
    lowerMainId:string = "lowerMain"
    modelInWorkspace:boolean[] = [false, false]  // 工作区是否有模型
    adjustTcIndex:number = 0
    allTcNameList:Array<string[]> = [
        [''],
        [],
        []
    ]
    adjustTeethLists = [
        [{name:"UL1", num:""}, {name:"UL2", num:""}, {name:"UL3", num:""}, {name:"UL4", num:""}, {name:"UL5", num:""}, {name:"UL6", num:""}, {name:"UL7", num:""}],
        [{name:"UR1", num:""}, {name:"UR2", num:""}, {name:"UR3", num:""}, {name:"UR4", num:""}, {name:"UR5", num:""}, {name:"UR6", num:""}, {name:"UR7", num:""}],
        [{name:"LL1", num:""}, {name:"LL2", num:""}, {name:"LL3", num:""}, {name:"LL4", num:""}, {name:"LL5", num:""}, {name:"LL6", num:""}, {name:"LL7", num:""}],
        [{name:"LR1", num:""}, {name:"LR2", num:""}, {name:"LR3", num:""}, {name:"LR4", num:""}, {name:"LR5", num:""}, {name:"LR6", num:""}, {name:"LR7", num:""}],
    ]
    currentSelectedToothName = ''
    adjustStep:number = 0.15
    adjustAngle:number = 3.00

    get url_patientInfo():string {
        return ((process.env.NODE_ENV === 'development') ? process.env.VUE_APP_BASEURL_DEV : process.env.VUE_APP_BASEURL_PRO) + '/teethAPI2.0/api/data/patientInfo?flag=ByIndex&index='
    }
    get url_bracketList():string {
        return ((process.env.NODE_ENV === 'development') ? process.env.VUE_APP_BASEURL_DEV : process.env.VUE_APP_BASEURL_PRO) + '/teethAPI2.0/api/BracketTypeNameQueryServlet'
    }
    get url_upload():string {
        return ((process.env.NODE_ENV === 'development') ? process.env.VUE_APP_BASEURL_DEV : process.env.VUE_APP_BASEURL_PRO) + '/teethAPI2.0/api/data/model'
    }

    ifDisable1:[boolean, boolean] = [false, false]
    ifDisable2:[boolean, boolean] = [false, false]

    ifDisableOp:boolean = true
    ifDefault:boolean = true
    
    ifShowDialog0:boolean = false
    ifShowDialog1:boolean = false
    dialog2Type:DialogType = DialogType["DOWNLOAD"]
    ifShowDialog2:boolean = false

    dialog0Step:number = 0
    uploadProgress:Array<number> = [0, 0, 0]
    finishedFileNumber:number = 0
    ifFinish:boolean = false

    upperProgress:number = 0
    lowerProgress:number = 0

    currentPatientIndex:string = ''

    detailList:object = {
        id: "病历号",
        name: "姓名",
        gender: "年龄",
        creatTime: "创建时间"
    }
    opList:Array<object> = [
        {name: "细调", img:require("@/assets/Icon_adjust_fine.png")},
        {name: "模拟矫正", img:require("@/assets/Icon_adjust_simulate.png")},
        {name: "更新模拟矫正", img:require("@/assets/Icon_adjust_update.png")},
        {name: "退出模拟矫正", img:require("@/assets/Icon_adjust_exit.png")}
    ]
    asideOpList:Array<object> = [
        {name: "模型上传&矫治器选择", img: require("@/assets/Icon_upload.png")},
        {name: "查看原始模型", img: require("@/assets/Icon_viewModel.png")},
        {name: "下载预定位方案", img: require("@/assets/Icon_download.png")},
        {name: "方案在线保存", img: require("@/assets/Icon_saveOnline.png")},
        {name: "方案保存并确认", img: require("@/assets/Icon_confirm.png")},
        {name: "退出当前病例", img: require("@/assets/Icon_exit.png")}
    ]
    asideAbleList = [false, false, false, false, false, true]
    bracketList = [{
        "BracketTypeName": "矫治器类型",
        "BracketTypes": [
            "矫治器名称1",
            "矫治器名称2"
        ]
    }]
    uploadForm:UploadForm = {
        // step 1
        upperFileName: '',
        lowerFileName: '',
        fullImgName: '',
        upperTeethSelect: {
            right: {
                'UR7': false, 'UR6': false, 'UR5': false, 'UR4': false, 'UR3': false, 'UR2': false, 'UR1': false
            },
            left: {
                'UL7': false, 'UL6': false, 'UL5': false, 'UL4': false, 'UL3': false, 'UL2': false, 'UL1': false
            }
        },
        lowerTeethSelect: {
            right: {
                'LR7': false, 'LR6': false, 'LR5': false, 'LR4': false, 'LR3': false, 'LR2': false, 'LR1': false,
            },
            left: {
                'LL7': false, 'LL6': false, 'LL5': false, 'LL4': false, 'LL3': false, 'LL2': false, 'LL1': false
            }
        },
        myPlan: '',
        myNote: '',
        myRemark: '',

        // step 2
        select1: 0,
        select2: 0,

        // step 3
        infoText1: "1、本人同意将此数据用于该软件制造方使用, 同意用于生成正畸方案，并对整个过程中需要的费用有了清楚的了解，愿意承担需要支付的费用。\n\n2、数据上传之后不能再做更改。",
        infoText2: "",
        ifCheck: false
    }

    patientInfo:Patient = {} as Patient

    async created():Promise<void> {
        // change title
        document.title = 'View'

        // get patient index
        this.currentPatientIndex = window.location.search.slice(7)
        
        // get patient info, then update the progress bar and asideAbleList
        await this.updateProgress()

        // get the bracketList
        let url = this.url_bracketList
        
        await (this as any).axios.get(url)
        .then((res:any) => {
            this.bracketList = res.data.data
        })
    }

    // trans to components
    /**
     * @description dialog2 中 下载cado并解析为\{type:enum[], stl:ArrayBuffer,xml:string\}后emit('parsed')
     * @description viewPage 中接收到 parsed 事件后, 调用对应的子组件的 showCADO方法进行显示
     */
    showMainModel(objFromSon:CadoObj):void {
        if(objFromSon.type === 'upper') {
            // @ts-ignore
            this.$refs.mainUpper.showCADO(objFromSon)
            this.modelInWorkspace[0] = true
        }
        else if(objFromSon.type === 'lower') {
            // @ts-ignore
            this.$refs.mainLower.showCADO(objFromSon)
            this.modelInWorkspace[1] = true
        }
        
        this.finishDownload()
    }

    @Watch('currentShowMain')
    resetAdjust(newVal:number, oldVal:number):void {  // 切换牙齿模型时, 重置托槽的选择
        this.currentSelectedToothName = ''
        this.ifDisableOp = true
    }

    @Watch('currentSelectedToothName')
    showSelectedTooth(newVal:string, oldVal:string) {  // 选择托槽时变色显示当前选择的托槽
        if(newVal[0] === 'U' || oldVal[0] === 'U') {
            (this.$refs.mainUpper as any).tcHighLight(newVal, oldVal)
        }
        else if(newVal[0] === 'L' || oldVal[0] === 'L') {
            (this.$refs.mainLower as any).tcHighLight(newVal, oldVal)
        }
    }

    @Watch('ifDisableOp')
    openOrCloseAdjust(newVal:boolean, oldVal:boolean) {  // 点击 进入/退出 细调
        if(newVal === false) {  // 进入细调
            (this.$refs.elMenu as ElMenu).open('0')
        }
        else {  // 退出细调
            (this.$refs.elMenu as ElMenu).close('0')
        }
    }

    /**
     * @description 下载完成后将用到的托槽名保存
     */
    saveTcNameList(data:string[], which:"UP"|"LOW") {
        if(which === "UP") {
            this.allTcNameList.splice(1, 1, data)
        }
        else if(which === "LOW") {
            this.allTcNameList.splice(2, 1, data)
        }
    }

    /**
     * @description 切换视图方向(前/左/右)
     */
    resetViewDirection(from:"LEFT"|"RIGHT"|"FRONT"):void {
        let refWindow:any = (this.currentShowMain == 1) ? this.$refs.mainUpper : this.$refs.mainLower
        
        // 未下载模型 测试时注释掉
        // if(!this.modelInWorkspace[this.currentShowMain-1]) {
        //     this.$message({
        //         message: "当前工作区无模型",
        //         type: "error"
        //     })
        //     return
        // }

        // 已存在模型
        refWindow.resetView(from)
    }

    /**
     * @description 更新当前选择的托槽名(到视图)
     * @description Watch中监听变化并切换高亮显示当前选择的托槽
     */
    updateSelect(tcName:string):void {
        // 禁用掉不存在的牙齿选择
        if(this.allTcNameList[1].indexOf(tcName) == -1 && this.allTcNameList[2].indexOf(tcName) == -1) {
            this.$message({
                message: "牙齿选择错误！",
                type: "error"
            })
            return
        }
        this.currentSelectedToothName = tcName
    }

    /**
     * @description 细调托槽(上下左右/旋转)
     */
    adjustButton(btnName:"UP"|"DOWN"|"LEFT"|"RIGHT"|"ANTI"|"ALONG"|"CANCEL"|"RESET"|"CONFIRM"):void {
        let refWindow:any = (this.currentShowMain == 1) ? this.$refs.mainUpper : this.$refs.mainLower

        // 取消/还原/确认 按钮 不需要选中托槽
        if(btnName === "CANCEL") {  // 取消
            this.ifDisableOp = true
            refWindow.resetModel()
            return
        }
        else if(btnName === "RESET") {  // 重置
            refWindow.resetModel()
            return
        }
        else if(btnName === "CONFIRM") {  // 确认
            console.log('确认...')
            return
        }

        // 其他选项需要选中托槽
        if(this.allTcNameList[this.currentShowMain].indexOf(this.currentSelectedToothName) == -1) {  // 没有在列表中找到当前选中的托槽名
            this.$message({
                message: "牙齿选择错误",
                type: "error"
            })
            return
        }

        // 细调操作
        let option:MoveOption = {
            moveType: "Pan",
            moveStep: 0,
            moveDirection: btnName
        }
        if(btnName === "ANTI" || btnName === "ALONG") {  // 旋转
            option.moveType = "Spin"
            option.moveStep = parseFloat(this.adjustAngle.toString())
        }
        else {  // 平移
            option.moveStep = parseFloat(this.adjustStep.toString())
        }
        refWindow.tcMove(this.currentSelectedToothName, option)
    }

    // ### trans end

    opFunction(btnNum:number):void {
        switch(btnNum) {
            case 1:
                if(this.currentShowMain != 0) {
                    // if(this.modelInWorkspace[this.currentShowMain - 1]) {
                        this.ifDisableOp = !this.ifDisableOp
                    // }
                    // else {
                    //     this.$message({
                    //         message: '当前工作区无模型',
                    //         type: 'error'
                    //     })
                    // }
                }
                else {
                    this.$message({
                        message: '未选择牙齿模型',
                        type: 'error'
                    })
                }
                break
            case 2:

                break
            case 3:

                break
            case 4:

                break
        }
    }

    asideOpFunction(btnNum:number):void {
        // if the button is disabled - return
        if(!this.asideAbleList[btnNum]) {
            return
        }
        // else - do
        switch(btnNum) {
            case 0:  // 上传原始...
                this.uploadForm = new EmptyForm()  // reset dialog0
                this.dialog0Step = 0  // reset dialog0step
                this.ifShowDialog0 = true  // show dialog0
                break
            case 1:  // 查看原始...
                this.ifShowDialog1 = true  // show dialog1
                break
            case 2:  // 下载预定...
                this.dialog2Type = DialogType["DOWNLOAD"]
                this.ifShowDialog2 = true  // show dialog2
                break
            case 3:  // 在线保存
                this.dialog2Type = DialogType["SAVEONLINE"]
                this.ifShowDialog2 = true  // show dialog3
                break
            case 4:  // 保存并确认
                this.dialog2Type = DialogType["CONFIRM"]
                this.ifShowDialog2 = true  // show dialog4
                break
            case 5:
                window.close()
                break
        }
    }

    /**
     * @description 完成预定位方案下载
     */
    finishDownload():void {
        this.asideAbleList = [false, true, false, true, true, true]
    }

    async updateProgress():Promise<void> {
        // 1 get latest patientinfo
        await this.getPatientInfo()

        // 2 calculate progress
        this.upperProgress = 25 * (parseInt(this.patientInfo.UpperOriginalModel) + parseInt(this.patientInfo.UpperProcessConfig) + parseInt(this.patientInfo.UpperUserCheck) + parseInt(this.patientInfo.UpperDBoardModel))
        this.lowerProgress = 25 * (parseInt(this.patientInfo.LowerOriginalModel) + parseInt(this.patientInfo.LowerProcessConfig) + parseInt(this.patientInfo.LowerUserCheck) + parseInt(this.patientInfo.LowerDBoardModel))

        // 3 set ableList
        if(this.upperProgress === 0 && this.lowerProgress === 0) {  // 未上传模型
            this.asideAbleList = [true, false, false, false, false, true]
        }
        else if(this.upperProgress <= 25 && this.lowerProgress <= 25) {  // 已上传模型 未生成预定位方案
            this.asideAbleList = [false, true, false, false, false, true]

            // 根据是否已上传原始 禁用下拉选项
            let disable1:[boolean, boolean] = [false, false]
            if(this.patientInfo.UpperOriginalModel === '0') {
                disable1[0] = true
            }
            if(this.patientInfo.LowerOriginalModel === '0') {
                disable1[1] = true
            }
            this.ifDisable1 = disable1
        }
        else if(this.upperProgress <= 50 && this.lowerProgress <= 50) {  // 已有预定位方案 未专家确认
            this.asideAbleList = [false, true, true, false, false, true]

            // 根据是否已上传原始 禁用下拉选项
            let disable2:[boolean, boolean] = [false, false]
            if(this.patientInfo.UpperProcessConfig === '0') {
                disable2[0] = true
            }
            if(this.patientInfo.LowerProcessConfig === '0') {
                disable2[1] = true
            }
            this.ifDisable2 = disable2
        }
        else if(this.upperProgress <= 75 && this.lowerProgress <= 75) {  // 已专家确认 未用户确认
            this.asideAbleList = [false, true, false, false, false, true]
        }
        else if(this.upperProgress <= 100 && this.lowerProgress <= 100) {  // 已用户确认 病例已完成
            this.asideAbleList = [false, true, false, false, false, true]
        }
    }

    /**
     * @description 多个子组件需要调用父组件方法, 使用switch/case根据dialogNum区分
     */
    dialogButton(dialogNum:number, btnName:string):void {
        switch(dialogNum) {
            case 0:
                if(btnName === 'cancel') {
                    this.ifShowDialog0 = false
                }
                else if(btnName === 'previous') {
                    this.dialog0Step -= 1
                }
                else if(btnName === 'next') {
                    let upperEl = document.querySelector('#upperInput')
                    let lowerEl = document.querySelector('#lowerInput')
                    
                    if(this.dialog0Step == 0) {
                        if((upperEl as HTMLInputElement).value === '' && (lowerEl as HTMLInputElement).value === '') {  // if empty
                            (this as any).$message({
                                message: '请至少上传一个模型',
                                type: 'warning',
                                center: true
                            })
                        }
                        else {  //  not empty
                            this.uploadForm.upperFileName = (upperEl as HTMLInputElement).value.slice((upperEl as HTMLInputElement).value.lastIndexOf('\\')+1)
                            this.uploadForm.lowerFileName = (lowerEl as HTMLInputElement).value.slice((lowerEl as HTMLInputElement).value.lastIndexOf('\\')+1)
                            this.dialog0Step += 1
                        }
                    }
                    else if(this.dialog0Step == 1) {
                        this.buildInfoText()
                        this.dialog0Step += 1
                    }
                    else {
                        this.dialog0Step += 1
                    }
                }
                else if(btnName === 'check') {
                    if(this.dialog0Step == 2) {
                        let url =  this.url_upload

                        let form = new FormData()
                        form.append("patientUid", this.patientInfo.uid)
                        form.append("ModelStateChange", "1")
                        form.append("Remarks", this.uploadForm.myRemark)

                        if(this.uploadForm.upperFileName.length !== 0) {
                            const ipt = document.querySelector("#upperInput")
                            form.set("modelType", "UpperTeethModel")
                            form.set("file", ((ipt as HTMLInputElement).files as FileList)[0])

                            // upload 0
                            this.myAjax(0, form, url)
                        } else {
                            this.finishedFileNumber += 1
                        }
                        if(this.uploadForm.lowerFileName.length !== 0) {
                            const ipt = document.querySelector("#lowerInput")
                            form.set("modelType", "LowerTeethModel")
                            form.set("file", ((ipt as HTMLInputElement).files as FileList)[0])
                            
                            // upload 1
                            this.myAjax(1, form, url)
                        } else {
                            this.finishedFileNumber += 1
                        }
                        if(this.uploadForm.fullImgName.length !== 0) {
                            const ipt = document.querySelector("#fullInput")
                            form.set("modelType", "PictureFile")
                            form.set("file", ((ipt as HTMLInputElement).files as FileList)[0])
                            
                            // upload 2
                            this.myAjax(2, form, url)
                        } else {
                            this.finishedFileNumber += 1
                        }

                        this.dialog0Step += 1

                        if(this.finishedFileNumber === 3) {
                            this.ifFinish = true
                        }
                    }
                    else if(this.dialog0Step == 3) {
                        // finished -> close
                        this.ifShowDialog0 = false

                        // update progress
                        this.updateProgress()
                    }
                }
                break
            case 1:
                if(btnName === 'cancel') {
                    this.ifShowDialog1 = false
                }
                break
            case 2:
                if(btnName === 'cancel') {
                    this.ifShowDialog2 = false
                }
                break
        }
    }

    myAjax(fileNum:number, form:FormData, url:string):void {
        let myXHR = new XMLHttpRequest()

        myXHR.open("POST", url)
        myXHR.upload.onprogress = (ev) => {
            let now = Math.ceil((ev.loaded / ev.total)*100)

            this.uploadProgress.splice(fileNum, 1, now)
        }
        myXHR.send(form)
        myXHR.onload = () => {
            this.finishedFileNumber += 1
            if(this.finishedFileNumber === 3) {
                this.ifFinish = true
            }
        }
    }

    buildInfoText():void {
        let partInfo = [  // part of info2
            "1、The uploaded model is:\n",
            "2、The type of bracket selected is:\n",
            "3、The note information is:\n",
            "①拔牙计划:\n",
            "②导板分段计划:\n",
            "③备注信息:\n"
        ]

        let info1 = "上颌牙模型" + (this.uploadForm.upperFileName ? this.uploadForm.upperFileName : "(未上传)\n") + "下颌牙模型:" + (this.uploadForm.lowerFileName ? this.uploadForm.lowerFileName : "(未上传)")
        let info2 = this.bracketList[this.uploadForm.select1].BracketTypes[this.uploadForm.select2]
        
        let teethList = []
        for(let key in this.uploadForm.upperTeethSelect.right) {
            if(this.uploadForm.upperTeethSelect.right[key] == true) {
                teethList.push(key)
            }
        }
        for(let key in this.uploadForm.upperTeethSelect.left) {
            if(this.uploadForm.upperTeethSelect.left[key] == true) {
                teethList.push(key)
            }
        }
        for(let key in this.uploadForm.lowerTeethSelect.right) {
            if(this.uploadForm.lowerTeethSelect.right[key] == true) {
                teethList.push(key)
            }
        }
        for(let key in this.uploadForm.lowerTeethSelect.left) {
            if(this.uploadForm.lowerTeethSelect.left[key] == true) {
                teethList.push(key)
            }
        }
        let info3 = teethList.length ? teethList.join(' | '): "无拔牙计划"
        let info4 = this.uploadForm.myPlan.trim().length ? this.uploadForm.myPlan : "采用默认导板分段"
        let info5 = this.uploadForm.myNote

        partInfo[0] += info1 + '\n'
        partInfo[1] += info2 + '\n'
        partInfo[3] += info3 + '\n'
        partInfo[4] += info4 + '\n'
        partInfo[5] += info5 + '\n'

        this.uploadForm.myRemark = partInfo[3] + partInfo[4] + partInfo[5]

        this.uploadForm.infoText2 = partInfo.join('')
    }

    async getPatientInfo():Promise<void> {
        let url = this.url_patientInfo + this.currentPatientIndex + '&count=1&fuzzyInstitutes=1&instituteName=&userIdFilter=-1'
        
        await (this as any).axios.get(url)
        .then((res:any) => {
            this.patientInfo = res.data.data.patientList[0];
        })
    }

    cutByBlank(str:string):string {
        if(typeof str !== 'string') {
            return str
        }
        else {
            let index = str.indexOf(' ', 0)

            return (index == -1) ? str : str.slice(0, index) 
        }
    }

    // 用于上传
    uploadCounter:number = 0
    /**
     * @description 在 dialog2 和 mainmodelviewer 两个组件之间充当 vuex 的功能
     */
    vuex_dialog(e:config_DIALOG) {
        this.uploadCounter = ((e.select[0]) ? 0 : 1) + ((e.select[1]) ? 0 : 1);

        (this.$refs.mainUpper as any).checkAndUpload(this.patientInfo.uid, this.patientInfo.remarks)
        
    }
    vuex_viewer(e:config_VIEWER) {
        this.uploadCounter += 1

        if(this.uploadCounter == 2) {
            this.uploadCounter = 0;
            (this.$refs.dialog2 as any).uploadFinish()
            this.updateProgress()
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep {
    .el-radio-button--small .el-radio-button__inner {
        padding: 0px 5px;
    }

    .el-button--small, .el-button--small{
        padding: 0px 5px;
    }
}

#view {
    .IconLarge {
        position: relative;
        width: 40px;
        height: 40px;
        margin: 10px auto;
    }
    
    #head {
        width: 100%;
        height: 66px;
        background-color: #24292e;
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        line-height: 1.5;

        .titleBlock {
            height: calc(100% - 20px);
            margin: 10px 0;
            text-align: center;
            border-left: solid 1px #cccccc;
            &:last-child {
                border-right: solid 1px #cccccc;
            }
        }

        .opBlock {
            outline: none;
            line-height:300%;
            cursor: pointer;
            &:hover {
                color: khaki;
            }
        }

        .dropdown {
            user-select: none;
            color: #fff;
            opacity: 0.7;
        }
    }

    #aside {
        .icon {
            height: 20px;
        }

        .adjustStep {
            font-size: 12px;
            text-align: center;

            input {
                width: 40%;
                outline: none;
            }
        }

        .adjustButton {
            width: 50px;
            height: 30px;
            margin: 10px auto;
            cursor: pointer;
            display: block;

            &:active {
                background-color: khaki;
            }
        }

        .note {
            height: 200px;

            .noteArea {
                width: 100%;
                height: 170px;
                margin: 10px 0;
                padding: 5px;
                border-radius: 5px;
                outline: none;
                resize: none;
            }
        }

        .asideOp {
            position: relative;
            width: 100%;
            height: 100%;
            display: block;
            font-family: cursive;
            font-weight: 400;

            &:hover {
                color: khaki;
            }
        }
        .disabledOp {
            position: relative;
            width: 100%;
            height: 100%;
            display: block;
            font-family: cursive;
            font-weight: 400;
            color: gray;
        }
    }
    #main {
        position: relative;
        margin: 0;
        padding: 0;
        background-color: ivory;

        .radioButtonGroup {
            position: absolute;
            z-index: 100;
            margin-left: 10px;
            margin-top: 10px;
            -webkit-user-drag: none;

            .imgButton {
                width: 30px;
                height: 30px;
                color: aqua;
            }
        }

        .buttonGroup {
            position: absolute;
            z-index: 100;
            margin-left: 100px;
            margin-top: 10px;

            img {
                width: 26px;
                height: 26px;
                margin: 2px;
            }
        }

        .popMain {
            width: 100%;
            height: 100%;
            background-color: #fefefe;
            border-left: solid 1px #bbbbbb;
            color: #888888;
            
            .adjustPop {
                position: relative;
                width: 100%;
                // height: 100%;
                background-color: #fefefe;

                .oneSide {
                    text-align: center;
                    font-size: 12px;
                    line-height: 300%;
                    user-select: none;
                    outline: solid 1px #bbbbbb;

                    .nameBox {
                        width: calc(100% / 7);
                        height: 36px;
                        cursor: pointer;
                        outline: solid 1px #dddddd;

                        &:active {
                            background-color: khaki;
                        }
                    }

                    .numBox {
                        width: calc(100% / 7);
                        height: 36px;
                        outline: solid 1px #dddddd;
                        background-color: #fafafa;
                    }
                }
            }
        }
        
    }
}

#dialog0 {
    .el-form-item {
        margin: 0;
    }
    .select {
        display: inline-block;
        width: 10%;
        font-size: 13px;
    }
}
#dialog2 {
    .txt-area1 {
        width: 100%;
        height: 80px;
        margin: 10px 0;
        padding: 5px;
        border-radius: 5px;
        outline: none;
        resize: none;
    }

    .txt-area2 {
        width: 100%;
        height: 100px;
        margin: 10px 0;
        padding: 5px;
        border-radius: 5px;
        outline: none;
        resize: none;
    }
}
</style>
