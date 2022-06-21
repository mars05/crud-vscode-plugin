const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  filenameHashing: false,
  publicPath: process.env.NODE_ENV === 'development' ? '/' : "../webview",
  transpileDependencies: true,
  outputDir: "../dist/webview",
  "lintOnSave": false,
  configureWebpack: {
    plugins: [
    ]
  }
})
