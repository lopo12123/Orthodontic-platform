<template>
    <div id="setting">
        <div class="title">
            <img class="icon" src="@/assets/Icon_settings.png">
            <span>个人信息管理 ({{ titleText }})</span>
            <img class="close" src="@/assets/Icon_close.png" @click="settingButton(1)">
        </div>
        <div :class="{body: (titleText == '密码修改'), hide: (titleText == '信息管理')}">
            <div class="body1">
                <span>当前用户名:</span>
                <input class="input1" type="text" v-model="boxInfo1.account">
            </div>
            <div class="body1">
                <span>输入原密码:</span>
                <input class="input1" type="text" v-model="boxInfo1.oldPassword">
            </div>
            <div class="body1">
                <span>输入新密码:</span>
                <input class="input1" type="password" v-model="boxInfo1.newPassword">
            </div>
            <div class="body1">
                <span>确认新密码:</span>
                <input class="input1" type="password" v-model="boxInfo1.checkPassword">
            </div>
        </div>
        <div :class="{body: (titleText == '信息管理'), hide: (titleText == '密码修改')}">
            <div class="body2">
                <div class="bodySmall">
                    <span>姓名:</span>
                    <input class="input2Short" type="text" v-model="boxInfo2.name">
                </div>
                <div class="bodySmall">
                    <span>年龄:</span>
                    <input class="input2Short" type="number" v-model="boxInfo2.age">
                </div>
            </div>
            <div class="body2">
                <div class="bodySmall">
                    <span>性别:</span>
                    <select class="input2Short" v-model="boxInfo2.gender">
                        <option value="男">男</option>
                        <option value="女">女</option>
                    </select>
                </div>
                <div class="bodySmall">
                    <span>公司:</span>
                    <input class="input2Short" type="text" v-model="boxInfo2.company">
                </div>
            </div>
            <div class="body2">
                <div class="bodySmall">
                    <span>职务:</span>
                    <input class="input2Short" type="text" v-model="boxInfo2.position">
                </div>
                <div class="bodySmall">
                    <span>邮箱:</span>
                    <input class="input2Short" type="text" v-model="boxInfo2.email">
                </div>
            </div>
            <div class="body2">
                <div class="bodySmall">
                    <span>手机:</span>
                    <input class="input2Short" type="text" v-model="boxInfo2.tel">
                </div>
                <div class="bodySmall">
                    <span>电话:</span>
                    <input class="input2Short" type="text" v-model="boxInfo2.phone">
                </div>
            </div>
            <div class="body2">
                <span>地址1:</span>
                <input class="input2Long" type="text" v-model="boxInfo2.add1">
            </div>
            <div class="body2">
                <span>地址2:</span>
                <input class="input2Long" type="text" v-model="boxInfo2.add2">
            </div>
            <div class="body2">
                <span>备注 :</span>
                <input class="input2Long" type="text" v-model="boxInfo2.notes">
            </div>
        </div>
        <div class="foot">
            <div class="button" @click="settingButton(0)">
                <img class="icon" src="@/assets/Icon_switch.png">
                <span>切换</span>
            </div>
            <div class="button" @click="settingButton(1)">
                <img class="icon" src="@/assets/Icon_cancel.png">
                <span>取消</span>
            </div>
            <div class="button" @click="settingButton(2)">
                <img class="icon" src="@/assets/Icon_check.png">
                <span>确认</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

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

interface settingBox1 {
    account:string
    oldPassword:string
    newPassword:string
    checkPassword:string
}

interface settingBox2 {
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

@Component({})
export default class settings extends Vue {
    @Prop({}) userInfo!:UserInfo

    titleText:string =   '信息管理'// '密码修改'
    boxInfo1:settingBox1 = {
        account:'',
        oldPassword:'',
        newPassword:'',
        checkPassword:''
    }
    boxInfo2:settingBox2 = {
        name:'',
        age:'',
        gender:'男',
        company:'',
        position:'',
        email:'',
        tel:'',
        phone:'',
        add1:'',
        add2:'',
        notes:''
    }

    resetList():void {
        this.boxInfo1.account = this.userInfo.account
        this.boxInfo1.oldPassword = ''
        this.boxInfo1.newPassword = ''
        this.boxInfo1.checkPassword = ''

        this.boxInfo2.name = this.userInfo.name
        this.boxInfo2.age = this.userInfo.age
        this.boxInfo2.gender = this.userInfo.gender
        this.boxInfo2.company = this.userInfo.company
        this.boxInfo2.position = this.userInfo.position
        this.boxInfo2.email = this.userInfo.email
        this.boxInfo2.tel = this.userInfo.tel
        this.boxInfo2.phone = this.userInfo.phone
        this.boxInfo2.add1 = this.userInfo.add1
        this.boxInfo2.add2 = this.userInfo.add2
        this.boxInfo2.notes = this.userInfo.notes
    }

    settingButton(btnNum:number):void {
        if(btnNum === 0) {
            // 0 -> switch
            this.titleText = (this.titleText === '密码修改') ? '信息管理' : '密码修改'
        }
        else if(btnNum === 1) {
            // 1 -> cancel
            // @ts-ignore
            this.$parent.settingButton(1)
        }
        else if(btnNum === 2) {
            // 2 -> check
            // @ts-ignore
            this.$parent.settingButton(2)
        }
    }
}
</script>

<style lang="scss" scoped>
#setting {
    position: absolute;
    z-index: 2;
    width: 498px;
    height: 398px;
    left: calc(50% - 250px);
    top: 200px;
    user-select: none;
    background-color: #fafafa;
    border: solid 1px #cccccc;
    box-shadow: rgba(0, 0, 0, 0.2) 0 0 10px;
    display: block;

    .icon {
        width: 24px;
        height: 24px;
        margin-left: 5px;
        margin-right: 5px;
    }

    .close {
        position: absolute;
        width: 24px;
        height: 24px;
        right: 10px;
        margin-left: 5px;
        margin-right: 5px;
        cursor: pointer;

        &:hover {
            width: 22px;
            height: 22px;
            right: 10px;
            border: solid 1px #cccccc;
        }
    }

    .title {
        position: absolute;
        width: 498px;
        height: 30px;
        background-color: #efefef;
        border-bottom: solid 1px #cccccc;
        display: flex;
        align-items: center;
    }

    .body {
        position: absolute;
        width: 498px;
        height: calc(100% - 110px);  /* 上 30px; 隔20px; body; 下 60px */
        top: 50px;
        display: flex;
        flex-direction: column;  /* 上下弹性布局 */
        align-items: center;

        .body1 {
            position: relative;
            width: 280px;
            height: 30px;
            margin: auto;
            display: flex;
            flex-direction: row;
            align-items: center;

            input {
                position: relative;
                width: 150px;
                margin: 0 20px;
                outline: none;
            }
        }

        .body2 {
            position: relative;
            width: 400px;
            height: 30px;
            margin: auto;
            display: flex;
            flex-direction: row;
            align-items: center;

            .input2Long {
                position: relative;
                width: 330px;
                margin: auto;
                outline: none;
            }
            
            .bodySmall {
                position: relative;
                width: 200px;
                height: 30px;
                margin: auto;
                display: flex;
                flex-direction: row;
                align-items: center;

                .input2Short {
                    position: relative;
                    width: 140px;
                    margin: auto;
                    outline: none;
                }
            }
        }
    }

    .hide {
        display: none;
    }

    .foot {
        position: absolute;
        width: 100%;
        height: 50px;
        top: calc(100% - 60px);
        /* border: solid 1px #cccccc; */
        display: flex;
        align-items: center;

        .button {
            position: relative;
            width: 70px;
            height: 30px;
            margin: 0 auto;
            /* border: solid 1px #cccccc; */
            cursor: pointer;
            display: flex;
            flex-direction: row;
            align-items: center;

            &:hover {
                color: khaki;
            }
        }
    }
}
</style>