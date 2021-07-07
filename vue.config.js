var path = require('path')
var webpack = require('webpack')
var vtkRules = require('vtk.js/Utilities/config/dependency.js').webpack.core.rules

var entry = path.join(__dirname, './src/main.ts')
const sourcePath = path.join(__dirname, './src')

module.exports = {
  configureWebpack: {
    entry,
    module: {
        rules: [
            { test: /\.html$/, loader: 'html-loader' },
        ].concat(vtkRules),
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
            sourcePath,
        ],
    },
  },

  devServer: {
      host: '127.0.0.1',
      port: 8080,
      https:false,
      hotOnly:false,

      /* 使用代理 */
      proxy:{
          '/teethAPI2.0': {
              target: 'https://api.digi-ortho.com:8443/',  // 调用的接口的域名和端口号
              changeOrigin: true,  // 设置true代表跨域访问
              secure: false,  // https接口需要配置
              pathRewrite: {
                '^/teethAPI2.0': '/teethAPI2.0',  // 路由重写
              }
            },
            '/ModelApi': {  // 下载模型的接口
              target: 'https://api.digi-ortho.com:8443/',  // 调用的接口的域名和端口号
              changeOrigin: true,  // 跨域
              secure: false,
              pathRewrite: {
                '^/ModelApi': '/data/teeth',
              }
            }
      }
  },
}