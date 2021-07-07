### Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm start
```

### Compiles and minifies for production

```
npm build
```

## 各文件对应功能

> config
>
>> index.js
>>
>>> * axios 在 dev 环境下的跨域代理；
>>> * 完全禁用 eslint 检查
>>>
>>
>
> public  -- 静态资源
>
>> BracketData  -- 存放托槽文件
>>
>> IMG  -- 显示病例进度的图片
>>
>> Icon_page.png  -- 浏览器图标
>>
>> index.html  -- 页面入口
>>
>
> src  -- 项目文件
>
>> assets  -- 资源文件
>>
>> components  -- 组件
>>
>>> listPage  -- 病例查看界面相关组件
>>>
>>> loginPage  -- 登陆界面相关组件
>>>
>>> viewPage  -- 模型查看界面相关组件
>>>
>>>> - myRenderWindow.js  -- 对vtkFullScreenRender模块的源码进行修改后进行封装的module
>>>>
>>>> **功能**: 使用选择器选择文档中的元素，在目标元素中绘制模型
>>>>
>>>> - singleModelViewer.vue  -- 单模型查看组件
>>>>
>>>> **功能**: 传入单个stl文件，对stl文件进行显示查看
>>>>
>>>> - MainModelViewer.vue  -- 组合模型查看组件
>>>>
>>>> **功能**: 传入指定格式对象，对cado文件进行显示查看
>>>>
>>>> ```ts
>>>> {
>>>>     stl:ArrayBuffer,
>>>>     xml:string,
>>>>     type:typeof enum
>>>> }
>>>> ```
>>>>
>>>
>>
>> router  -- vue-router 路由管理
>>
>>> index.ts  -- 路由管理，使用了history模式
>>>
>>
>> views  -- 视图
>>
>>> listPage.vue  -- 病例查看界面
>>>
>>> loginPage.vue  -- 登录界面
>>>
>>> viewPage.vue  -- 模型查看界面
>>>
>>
>> App.vue  -- 页面入口
>>
>>> 使用 router-view 匹配路由进行显示
>>>
>>
>> main.ts  -- 程序入口
>>
>> * 引入 elementUi
>> * 引入 axios/vue-axios（其中vue-axios仅作declare文件使用）
>> * 原型链绑定 ＄message 方法
>> * 全局设置 withCredentials
>>
>> shims-tsx.d.ts  -- declare file
>>
>> shims-vue.d.ts  -- declare file
>>
>
> .env  -- 环境变量，存储了在dev/prod环境下的baseUrl
>
> package-lock.json  -- 依赖的详细信息
>
> package.json
>
>> * npm start  -- 运行 dev 环境
>> * npm build  -- 打包
>>
>
> tsconfig.json  -- ts 配置，主要包括tsc输出版本以及设置根据后缀匹配自动识别ts文件
>
> vue.config.js  -- 包含webpack 配置和 vtk 配置
>
>> * devServer -- dev 环境下的跨域代理
>> * configureWebpack -- webpack相关配置 和 vtkrules 的配置
>>

## note

1. 使用的`xml2js` 包解析xml生成的`object`中，使用＄表示自身标签上的属性；转换回xml时会多出一行xml声明字符串，拼接时需要去掉；
2. vtk仅有部分提供了对ts的支持，如`vtkLanmarkTransform、Mode`没有相应的`.d.ts`声明文件，`xml2js`同样没有相应的`.d.ts`文件
