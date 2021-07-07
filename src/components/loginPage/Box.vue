<template>
    <div>
        <div id="start" v-show="!ifFocus" @click="ifFocus=true">
            <span>点击登录</span>
        </div>
        <div id="login" v-show="ifFocus">
            <div class="inputBox">
                <img src="@/assets/Icon_user.png">
                <input type="text" placeholder="请输入账号" v-model="account">
            </div>
            <div class="inputBox">
                <img src="@/assets/Icon_password.png">
                <input type="password" placeholder="请输入密码" v-model="password">
            </div>
            <div class="inputBox">
                <button @click="ifFocus=false">取消</button>
                <button @click="submit()">登录</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

interface Param {
    userId:string
    password:string
    verificationCode:'verificationCode123456'  // fixed
}

@Component({})
export default class loginPage extends Vue {
    ifFocus:boolean = false
    
    account:string = ''
    password:string = ''
    
    get url_login():string {
        return ((process.env.NODE_ENV === 'development') ? process.env.VUE_APP_BASEURL_DEV : process.env.VUE_APP_BASEURL_PRO) + '/teethAPI2.0/api/login'
    }

    submit():void {
        if(this.account == '' || this.password == '') {
            this.$message({
                message: '账号或密码不能为空！',
                type: 'error',
                center: true
            })

        }
        else {
            let params:Param = {
                userId: this.account,
                password: this.password,
                verificationCode: 'verificationCode123456'
            }

            this.axios.post(this.url_login, params)
            .then(res => {
                let resData = res.data.data
                let loginState = resData.state
                
                if(loginState === 'ERROR') {
                    this.$message({
                        message: '账号或密码错误！',
                        type: 'error',
                        center: true
                    })
                }
                else if(loginState === 'SUCCESS') {
                    let loginInfo = resData.userInfo
                    
                    sessionStorage.setItem(escape("用户名"), escape(loginInfo.userId));
                    sessionStorage.setItem(escape("密码"), escape(this.password));
                    sessionStorage.setItem(escape("姓名"), escape(loginInfo.userName));
                    sessionStorage.setItem(escape("年龄"), escape(loginInfo.userAge));
                    sessionStorage.setItem(escape("性别"), escape(loginInfo.userGender));
                    sessionStorage.setItem(escape("公司"), escape(loginInfo.userInstitute));
                    sessionStorage.setItem(escape("职务"), escape(loginInfo.userTitle));
                    sessionStorage.setItem(escape("邮箱"), escape(loginInfo.userEmail));
                    sessionStorage.setItem(escape("手机"), escape(loginInfo.userTel1));
                    sessionStorage.setItem(escape("电话"), escape(loginInfo.userTel2));
                    sessionStorage.setItem(escape("地址1"), escape(loginInfo.userAddress1));
                    sessionStorage.setItem(escape("地址2"), escape(loginInfo.userAddress2));
                    sessionStorage.setItem(escape("备注"), escape(loginInfo.notes));

                    // @ts-ignore
                    document.location = './list'
                }
            })
            .catch(err => {
                throw new Error(err)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
$change-speed:0.25s;

#start {
    position: absolute;
    z-index: 0;  /* 在遮罩层之上 */
    width: 190px;  /* position */
    top: 220px;
    left: calc(50% - 110px);
    padding: 15px 15px;  /* outer */
    border: none;
    outline: none;
    border-radius: 30px;
    color: rgba(255, 255, 255, 0.6);  /* font */
    user-select: none;
    font-size: large;
    font-weight: lighter;
    font-family: cursive;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.25);  /* background */
    box-shadow: rgba(0, 0, 0, 0.2) 0 0 10px;
    backdrop-filter: blur(10px);
    transition: all $change-speed;

    &:hover {
        width: 240px;
        border-radius: 40px;
        color: rgba(255, 255, 255, 0.8);
        font-size: large;
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.3);
        box-shadow: rgba(0, 0, 0, 0.3) 0 0 10px;
        left: calc(50% - 135px);
    }
}

#login {
    position: absolute;
    z-index: 0;  /* 在遮罩层之上 */
    width: 260px;
    height: 250px;
    top: 220px;
    left: calc(50% - 145px);
    padding: 15px 15px;
    border: none;
    outline: none;
    border-radius: 30px;
    color: black;
    user-select: none;
    font-size: medium;
    font-weight: lighter;
    background-color: rgba(255, 255, 255, 0.25);
    box-shadow: rgba(0, 0, 0, 0.2) 0 0 10px;
    backdrop-filter: blur(10px);

    .inputBox {
        position: relative;
        width: 240px;
        height: 40px;
        margin: 35px auto;

        img {
            position: absolute;
            width: 25px;
            height: 25px;
            margin: 10px 5px;
            padding: 0;
            display: inline-block;
        }

        input {
            position: relative;
            float: right;
            right: 10px;
            width: 190px;
            height: 30px;
            margin: 5px auto;
            background-color: rgba(255, 255, 255, 0);
            border: 0;
            outline: none;
            border-bottom: solid 3px darkslategrey;
            font-size: 20px;
            font-family: cursive;
            color: rgba(255, 255, 240, 0.6);

            &::placeholder {
                font-size: 18px;
                font-weight: lighter;
                color: rgba(255, 255, 240, 0.6);
            }
        }

        button {
            position: relative;
            width: 40px;
            margin: 5px 38px;
            background-color: rgba(255, 255, 255, 0);
            border: 0;
            outline: none;
            border-bottom: solid 1px darkslategrey;
            cursor: pointer;
            font-size: 20px;
            font-weight: lighter;
            font-family: cursive;

            &:active {
                color: khaki;
            }
        }
    }
}
</style>
