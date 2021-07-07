<template>
    <div>
        <Background/>
        <Timer/>
        <Box/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

// Alert组件 改用 element-ui 的 { Message }
import Box from '@/components/loginPage/Box.vue'
import Background from '@/components/loginPage/Background.vue'
import Timer from '@/components/loginPage/Timer.vue'

@Component({
    components: {
        Box,
        Background,
        Timer
    }
})
export default class loginPage extends Vue {
    get url_logout():string {
        return ((process.env.NODE_ENV === 'development') ? process.env.VUE_APP_BASEURL_DEV : process.env.VUE_APP_BASEURL_PRO) + '/teethAPI2.0/api/logout'
    }
    created():void {
        let time = new Date()
        let hour = time.getHours()

        if(hour >= 4 && hour <= 10) {
            this.$message({
                message: '早上好！',
                type: 'success',
                iconClass: 'el-icon-sunrise',
                center: true
            })
        }
        else if(hour >= 11 && hour <= 13) {
            this.$message({
                message: '中午好！',
                type: 'success',
                iconClass: 'el-icon-sunny',
                center: true
            })
        }
        else if(hour >= 14 && hour <= 17) {
            this.$message({
                message: '下午好！',
                type: 'success',
                iconClass: 'el-icon-sunny',
                center: true
            })
        }
        else {
            this.$message({
                message: '晚上好！',
                type: 'success',
                iconClass: 'el-icon-moon',
                center: true
            })
        }
    }
    mounted() {
        this.axios.get(this.url_logout)
        .then((res) => {
            console.log('Pre:[LOGOUT:' + res.data.data.state + ']')
        })
    }
}
</script>

<style lang="scss">
.el-message {
    width: 120px;
    border: none;
    outline: none;
    background-color: rgba(255, 255, 240, 0.4);
    
    p {
        color: rgba(255, 255, 255, 0.8);
        font-weight: normal;
        font-size: 20px;
        font-family: cursive;
        text-shadow: 0 0 20px rgba(0, 0, 0, 0.35);
        user-select: none;
    }
}
</style>