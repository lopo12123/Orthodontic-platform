<template>
    <div id="newcase">
        <div class="title">
            <img class="icon" src="@/assets/Icon_newcase.png">
            <span>上传病人信息</span>
            <img class="close" src="@/assets/Icon_close.png" @click="funcButton(0)">
        </div>
        <div class="body">
            <div class="childBox">
                <span>编号:</span>
                <input type="text" v-model="caseList.id" disabled>
            </div>
            <div class="childBox">
                <span>姓名:</span>
                <input type="text" v-model="caseList.name">
            </div>
            <div class="childBox">
                <span>年龄:</span>
                <input type="number" v-model="caseList.age">
            </div>
            <div class="childBox">
                <span>性别:</span>
                <select v-model="caseList.gender">
                    <option value="1">男</option>
                    <option value="2">女</option>
                </select>
            </div>
            <div class="childBox">
                <div class="button" @click="funcButton(0)">
                    <img class="icon" src="@/assets/Icon_cancel.png">
                    <span>取消</span>
                </div>
                <div class="button" @click="funcButton(1)">
                    <img class="icon" src="@/assets/Icon_check.png">
                    <span>确认</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

interface NewCase {
    id:string
    name:string
    age:string
    gender:1 | 2
}
interface Params {
    [key:string]:string
    uid:string
    id:string
    name:string
    age:string
    gender:string
}

@Component({})
export default class newCase extends Vue {
    caseList:NewCase = {
        id: '',
        name: '',
        age: '',
        gender: 1
    }

    resetList():void {
        let time = new Date()
        
        let num:string = time.getFullYear().toString() + (time.getMonth() < 9 ? '0' + time.getMonth() : time.getMonth()) + (time.getDate() < 10 ? '0'+ time.getDate() : time.getDate()) + (time.getHours() < 10 ? '0'+ time.getHours() : time.getHours()) + (time.getMinutes() < 10 ? '0'+ time.getMinutes() : time.getMinutes()) + (time.getSeconds() < 10 ? '0'+ time.getSeconds() : time.getSeconds());
        
        this.caseList = {
            id: num,
            name: '',
            age: '',
            gender: 1
        }
    }
    funcButton(btnId:number):void {
        if(btnId === 0) {  // 0 -> cancel
            // @ts-ignore
            this.$parent.newcaseButton(1);
        }
        else if(btnId === 1) {  // 1 -> confirm
            let time = new Date()

            let params:Params = {
                uid: time.getTime().toString(),
                id: this.caseList.id,
                name: this.caseList.name,
                age: this.caseList.age,
                gender: (this.caseList.gender==1) ? '男' : '女'
            }

            for (let key in params) {
                if(params[key].length == 0) {  // if empty
                    this.$message({
                        message: '请填写 ' + ((key == 'name') ? '[姓名]' : '[年龄]'),
                        type: 'warning',
                        center: true
                    })

                    return
                }
            }
            
            // ensure the value of params if not empty
            // @ts-ignore
            this.$parent.newcaseButton(2, params)  // upload
        }
    }
}
</script>

<style lang="scss" scoped>
#newcase {
    position: absolute;
    z-index: 1;
    width: 398px;
    height: 298px;
    left: calc(50% - 200px);
    top: 200px;
    user-select: none;
    background-color: #fafafa;
    border: solid 1px #cccccc;
    box-shadow: rgba(0, 0, 0, 0.2) 0 0 10px;  /* 加点阴影 */
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

    .title {  // title
        position: absolute;
        width: 398px;
        height: 30px;
        background-color: #efefef;
        border-bottom: solid 1px #cccccc;
        display: flex;
        align-items: center;
    }

    .body {  // body
        position: absolute;
        width: 398px;
        height: calc(100% - 30px);
        top: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .childBox {
            position: relative;
            width: 230px;
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

            select {
                position: relative;
                width: 150px;
                margin: 0 20px;
                outline: none;
            }

            .button {
                position: relative;
                width: 70px;
                height: 30px;
                margin: 0 auto;
                cursor: pointer;
                display: flex;
                align-items: center;

                &:hover {
                    color: khaki;
                }
            }
        }
    }
}
</style>