<template>
    <div id="list">
        <NewCase v-show="ifShowNewcase" ref="childNewcase"/>
        <Settings v-show="ifShowSetting" ref="childSettings" :userInfo="currentUser"/>

        <div id="title">
            <img class="iconBig" src="@/assets/Icon_page.png">
            <div class="search">
                <input type="text" v-model="searchText" placeholder="请输入查询关键字...">
            </div>
            <div class="item">
                <img class="icon" src="@/assets/Icon_index.png">
                <img class="icon" src="@/assets/Icon_previous.png" @click="changePage('previous')">
                <span> 第<span style="color:khaki;">{{ pageIndex}}/{{maxpageIndex }}</span>页 </span>
                <img class="icon" src="@/assets/Icon_next.png" @click="changePage('next')">
            </div>
            <div class="item changeColor" style="width:100px" @click="refresh()">
                <img class="icon" src="@/assets/Icon_refresh.png">
                <span>刷新</span>
            </div>
            <div class="item" style="cursor:default">
                <img class="icon" src="@/assets/Icon_select.png" style="cursor:default">
                <select style="outline: none; cursor: pointer;" v-model="currentFilter">
                    <option v-for="item in filterList" :value="item.id">{{ item.msg }}</option>
                </select>
                
            </div>
            <div class="item changeColor" style="width:140px" @click="newcaseButton(0)">
                <img class="icon" src="@/assets/Icon_newcase.png">
                <span>新建病例</span>
            </div>
            <div class="item changeColor" style="width:180px" @click="settingButton(0)">
                <img class="icon" src="@/assets/Icon_settings.png">
                <span>当前: {{ currentUser.name }}</span>
            </div>
            <div class="item changeColor" style="width:100px" @click="logout()">
                <img class="icon" src="@/assets/Icon_logout.png">
                <span>注销</span>
            </div>
        </div>

        <div id="body">
            <div class="table">
                <div class="title">
                    <div v-for="(item, index) in tableTitles" class="tableTitle">
                        <span>{{ tableTitleNameList[index] }}</span>
                    </div>
                </div>
                <div class="body">
                    <div id="myMenu" v-show="ifShowMenu">
                        <div class="item" @click="menuButton('detail')">
                            <span>查看详情</span>
                        </div>
                        <div class="item" @click="menuButton('delete')">
                            <span>删除病例</span>
                        </div>
                    </div>
                    <el-dialog
                        title="删除病例"
                        :visible="ifShowDialog"
                        width="20%"
                        :modal="false"
                        :show-close="false">
                        <span>确认删除当前病例?</span>
                        <template slot="footer">
                            <el-button size="mini" plain type="danger" @click="menuButton('cancel')">取消</el-button>
                            <el-button size="mini" plain type="success" @click="menuButton('check')">确认</el-button>
                        </template>
                    </el-dialog>
                    <div v-for="(item ,index) in patientList.slice((pageIndex-1)*10, pageIndex*10)" :class="{odd:!(index%2), even:(index%2)}" @click.right="showMenu($event, index)">
                        <div v-for="(item2, index2) in tableTitles" class="oneLine">
                            <span v-if="index2!=6">{{ item[item2] }}</span>
                            <img v-if="index2==6" :src="url_img(index + (pageIndex-1)*10)">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import NewCase from '@/components/listPage/newCase.vue'
import Settings from '@/components/listPage/settings.vue'

interface UserInfo {
    account:string
    password:string
    name:string
    age:string
    gender:string
    company:string
    position:string
    email:string
    tel:string
    phone:string
    add1:string
    add2:string
    notes:string
}

@Component({
    components: {
        NewCase,
        Settings
    }
})
export default class listPage extends Vue {
    // computed
    get url_patientInfo():string {
        return ((process.env.NODE_ENV === 'development') ? process.env.VUE_APP_BASEURL_DEV : process.env.VUE_APP_BASEURL_PRO) + '/teethAPI2.0/api/data/patientInfo?flag=ByIndex&index=0&count='
    }
    get url_newcase():string {
        return ((process.env.NODE_ENV === 'development') ? process.env.VUE_APP_BASEURL_DEV : process.env.VUE_APP_BASEURL_PRO) + '/teethAPI2.0/api/data/patientInfo'
    }
    get url_delete():string {
        return ((process.env.NODE_ENV === 'development') ? process.env.VUE_APP_BASEURL_DEV : process.env.VUE_APP_BASEURL_PRO) + '/teethAPI2.0/api/data/delete'
    }

    // created
    async created():Promise<void> {
        // hide my contentMenu
        document.addEventListener('click', () => {
            this.ifShowMenu = false
        })

        // change title
        document.title = 'List'
        
        // get user`s infomation from sessionStorage
        this.currentUser.account = unescape(sessionStorage.getItem(escape("用户名")) as string)
        this.currentUser.password = unescape(sessionStorage.getItem(escape("密码")) as string)
        this.currentUser.name = unescape(sessionStorage.getItem(escape("姓名")) as string)
        this.currentUser.age = unescape(sessionStorage.getItem(escape("年龄")) as string)
        this.currentUser.gender = unescape(sessionStorage.getItem(escape("性别")) as string)
        this.currentUser.company = unescape(sessionStorage.getItem(escape("公司")) as string)
        this.currentUser.position = unescape(sessionStorage.getItem(escape("职务")) as string)
        this.currentUser.email = unescape(sessionStorage.getItem(escape("邮箱")) as string)
        this.currentUser.tel = unescape(sessionStorage.getItem(escape("手机")) as string)
        this.currentUser.phone = unescape(sessionStorage.getItem(escape("电话")) as string)
        this.currentUser.add1 = unescape(sessionStorage.getItem(escape("地址1")) as string)
        this.currentUser.add2 = unescape(sessionStorage.getItem(escape("地址2")) as string)
        this.currentUser.notes = unescape(sessionStorage.getItem(escape("备注")) as string)

        let url1:string = this.url_patientInfo
        let url2:string = '&fuzzyInstitutes=1&instituteName=&userIdFilter=-1'

        // first -> get the count of patientList
        await this.axios.get(url1+'1'+url2)
        .then((res) => {
            this.patientCount = res.data.data.count
            this.maxpageIndex = Math.ceil(this.patientCount / 10)
        })

        // next -> get whole patientList
        this.updateList()
    }

    ifShowNewcase:boolean = false
    ifShowSetting:boolean = false
    ifShowMenu:boolean = false
    ifShowDialog:boolean = false

    currentUser:UserInfo = {
        account:'',
        password:'',
        name:'',
        age:'',
        gender:'',
        company:'',
        position:'',
        email:'',
        tel:'',
        phone:'',
        add1:'',
        add2:'',
        notes:''
    }
    currentFilter:number = 0;
    filterList:Array<object> = [
        {id:0, msg: '病例状态选择'},
        {id:1, msg: '等待用户上传牙齿模型'},
        {id:2, msg: '初定位结果生成中'},
        {id:3, msg: '等待专家确认方案'},
        {id:4, msg: '等待用户确认方案'},
        {id:5, msg: '生成导板中'},
        {id:6, msg: '病例处理完成'}
    ]
    patientList:Array<object> = []
    tableTitles:Array<string> = ['id', 'name', 'age', 'gender', 'creatTime', 'userName', '进度状态']
    tableTitleNameList:Array<string> = ['病历号', '患者姓名', '年龄', '性别', '创建时间', '用户名', '进度状态']

    patientCount:number = 0
    pageIndex:number = 1
    maxpageIndex:number = 1
    searchText:string = ''
    currentPatientIndex:number = 0
    
    searchTheList():void {
        console.log('还没做');
    }

    changePage(goWhere:string):void {
        if(goWhere === 'previous' && this.pageIndex >1) {
            this.pageIndex -= 1
        }
        else if(goWhere === 'next' && this.pageIndex < this.maxpageIndex) {
            this.pageIndex += 1
        }
    }

    refresh():void {
        this.searchText = ''
        this.pageIndex = 1
        this.currentFilter = 0

        this.updateList()

        this.$message({
            message: '刷新成功!',
            type: 'success',
            center: true,
            duration: 1000
        })
    }

    filterTheList():void {
        console.log('还没做');
    }

    newcaseButton(opNum:number=0, params?:object):void {
        if(opNum === 0) {
            // 0 -> open pop box
            // @ts-ignore
            this.$refs.childNewcase.resetList()
            this.ifShowNewcase = true
        }
        else if(opNum === 1) {
            // 1 -> close pop box
            this.ifShowNewcase = false
        }
        else if(opNum === 2) {
            // 2 -> new a case
            let url = this.url_newcase

            this.axios.post(url, params)
            .then((res) => {
                if(res.data.data === 'Insert_SUCCESS') {
                    this.$message({
                        message: '[新建病例] 成功!',
                        type: "success",
                        center: true,
                        duration: 1000
                    })

                    // update the list
                    this.updateList()
                }
                else {
                    this.$message({
                        message: '[新建病例] 失败!',
                        type: 'error',
                        center: true,
                        duration: 1000
                    })

                    // update the list
                    this.updateList()
                }
            })
            
            // then close the pop
            this.ifShowNewcase = false
        }
    }

    settingButton(opNum:number=0):void {
        if(opNum === 0) {
            // 0 -> open pop box
            // @ts-ignore
            this.$refs.childSettings.resetList()
            this.ifShowSetting = true
        }
        else if(opNum === 1) {
            // 1 -> close pop box
            this.ifShowSetting = false
        }
        else if(opNum === 2) {
            // 2 -> save settings then close pop
            // 没有保存设置 接口
            this.ifShowSetting = false
        }
    }

    logout():void {
        // @ts-ignore
        window.location = '/'
    }

    url_img(index:number):string {
        let currentPatient = this.patientList[index]

        // @ts-ignore
        let upperState:number = parseInt(currentPatient.UpperOriginalModel) + 2*parseInt(currentPatient.UpperProcessConfig) + parseInt(currentPatient.UpperUserCheck) + parseInt(currentPatient.UpperDBoardModel);
        // @ts-ignore
        let lowerState:number = parseInt(currentPatient.LowerOriginalModel) + 2*parseInt(currentPatient.LowerProcessConfig) + parseInt(currentPatient.LowerUserCheck) + parseInt(currentPatient.LowerDBoardModel);

        return require("/public/IMG/StateImg"+ upperState + lowerState + ".png")
    }
    showMenu(e:PointerEvent, index:number):void {
        e.preventDefault()

        this.currentPatientIndex = index + (this.pageIndex - 1) * 10
        
        const myMenu = document.querySelector('#myMenu')
        
        // go wrong if without ';'
        let VW = document.body.clientWidth;
        let VH = document.body.clientHeight;
        
        (myMenu as HTMLDivElement).style.left = ((e.clientX - Math.ceil(VW * 0.05) + 2) + 'px') as string
        (myMenu as HTMLDivElement).style.top = ((e.clientY - 66 - 48) + 'px') as string
        
        // show contentMenu
        this.ifShowMenu = true
    }
    menuButton(op:string):void {
        if(op === 'detail') {
            let newRoute = '/view?index=' + this.currentPatientIndex
            window.open(newRoute)
        }
        else if(op === 'delete') {
            // show dialog - check twice
            this.ifShowDialog = true
        }
        else if(op === 'cancel') {
            this.ifShowDialog = false
        }
        else if(op === 'check') {
            this.ifShowDialog = false

            let url = this.url_delete
            
            // @ts-ignore cause i know it have 'uid' ofcourse
            let uid = this.patientList[this.currentPatientIndex].uid

            this.axios.post(url, {'uid':uid})
            .then(res => {
                if(res.data.data === 'Delete_SUCCESS') {
                    // update the list
                    this.updateList()

                    // alert
                    this.$message({
                        message: '[删除病例] 成功!',
                        type: 'success',
                        center: true,
                        duration: 1000
                    })
                }
                else {
                    // update the list
                    this.updateList()

                    // alert
                    this.$message({
                        message: '[删除病例] 失败!',
                        type: 'error',
                        center: true,
                        duration: 1000
                    })
                }
            })


        }
    }
    updateList():void {
        let url1 = this.url_patientInfo
        let url2 = '&fuzzyInstitutes=1&instituteName=&userIdFilter=-1'

        this.axios.get(url1 + this.patientCount + url2)
        .then((res) => {
            this.patientList = res.data.data.patientList
        })
    }
}
</script>

<style lang="scss">
.el-message {
    opacity: 0.8;
}
</style>

<style lang="scss" scoped>
$change-speed:0.25s;

#list {
    position: absolute;
    z-index: 0;  /* z = 0 */
    width: 100%;
    height: 100%;

    #title {
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 66px;
        background-color: #24292e;
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        line-height: 1.5;
        display: flex;
        align-items: center;

        .iconBig {
            position: relative;
            width: 40px;
            height: 40px;
            margin: 15px;
        }

        .icon {
            width: 26px;
            height: 26px;
            margin-right: 5px;
            cursor: pointer;
        }

        .search {
            position: relative;
            width: 500px;

            input {
                position: relative;
                width: 200px;
                height: 20px;
                margin: 10px;
                padding: 5px;
                color: #aaaaaa;
                font-family: cursive;
                background-color: rgba(255, 255, 255, 0);
                border: solid 1px #cccccc;
                border-radius: 5px;
                outline: none;
                transition: width $change-speed;

                &:focus {
                    width: 300px;
                    background-color: ivory;
                }

                &::placeholder {
                    color: #aaaaaa;
                    font-weight: lighter;
                }
            }
        }

        .item {
            position: relative;
            width: 240px;
            height: 26px;
            margin: 20px;
            user-select: none;
            cursor: pointer;
            display: flex;
            align-items: center;
        }

        .changeColor:hover {
            color: khaki;
        }

    }

    #body {
        position: absolute;
        z-index: 0;
        width: 100%;
        top: 66px;
        height: calc(100vh - 66px);

        .table {
            position: relative;
            width: 90%;
            height: calc(100% - 40px);
            margin: auto;
            border: solid 2px #777777;
            border-top: none;

            .title {
                position: relative;
                width: 100%;
                height: 48px;
                background-color: #cccccc;
                border-bottom: solid 2px #999999;
                user-select: none;
                display: flex;

                .tableTitle {
                    position: relative;
                    width: calc(100% / 7);
                    height: calc(100%);
                    margin: auto;
                    border-left: solid 2px #fafafa;
                    display: inline-flex;
                    align-items: center;
                    text-align: center;

                    &:first-child {
                        border-left: none;
                    }

                    span {
                        width: 100%;
                        text-align: center;
                    }
                }
            }

            .body {
                position: relative;
                height: calc(100% - 50px);
                width: 100%;
                background-color: #ffffff;
                user-select: none;

                #myMenu {
                    position: absolute;
                    z-index: 100;
                    width: 80px;
                    height: 54px;
                    padding: 3px 0;
                    background-color: #ffffff;
                    border: solid 1px #cccccc;
                    box-shadow: rgba(0, 0, 0, 0.2) 0 0 5px;
                    user-select: none;

                    .item {
                        position: relative;
                        width: 100%;
                        height: 25px;
                        padding: 1px 0;
                        display: flex;
                        align-items: center;

                        &:hover {
                            background-color: #cccccc;
                        }

                        span {
                            position: relative;
                            width: 80%;
                            height: 100%;
                            margin: 0 auto;
                            font-size: 10px;
                            display: flex;
                            align-items: center;
                        }
                    }
                }

                .odd {
                    position: relative;
                    width: 100%;
                    height: 10%;
                    background-color: aliceblue;
                    display: flex;
                }

                .even {
                    position: relative;
                    width: 100%;
                    height: 10%;
                    display: flex;
                }

                .oneLine {
                    position: relative;
                    width: calc(100% / 7);
                    height: 100%;
                    display: inline-flex;
                    align-items: center;
                    text-align: center;

                    span {
                        width: 100%;
                        text-align: center;
                    }

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
}
</style>
