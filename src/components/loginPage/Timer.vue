<template>
    <div id="timer">
        <span> {{currentTime}} </span>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class Timer extends Vue{
    currentTime:string = ''

    getCurrentTime():void {
        let time = new Date()
        
        let hour:number = time.getHours()
        let min = time.getMinutes()
        let sec = time.getSeconds()

        let hourText:string = (hour < 10) ? '0'+hour : hour.toString()
        let minText:string = (min < 10) ? '0'+min : min.toString()
        let secText:string = (sec < 10) ? '0'+sec : sec.toString()

        this.currentTime = hourText + ':' + minText + ':' + secText
    }

    created():void {
        this.getCurrentTime()
        setInterval(this.getCurrentTime, 1000)
    }
}
</script>

<style lang="scss" scoped>
$change-speed:0.25s;

#timer {
    position: fixed;
    width: 160px;
    top: 150px;
    left: 50%;
    margin-left: -80px;
    /* border: solid 1px #cccccc; */
    text-align: center;
    transition: all $change-speed;

    span {
        color: white;
        text-align: center;
        font-size: 36px;
        font-weight: lighter;
        text-shadow: 0 0 20px rgba(0, 0, 0, 0.35);
        cursor: pointer;
        user-select: none;
        transition: all $change-speed;
        line-height: 20px;
    }
}
</style>