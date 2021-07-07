<template>
    <div>
        <img id="background-static" src="@/assets/BG_static.jpg">
        <div id="cover"></div>
    </div>
</template>

<style lang="scss" scoped>
#background-static {
    position: absolute;  /* 绝对布局 使用z-index */
    z-index: -2;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 1;
}
#cover {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
}
</style>