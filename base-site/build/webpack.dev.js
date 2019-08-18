const path = require('path');
const webpack = require('webpack');
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = function (env, args) {
    let isDev = args.mode === 'development' ? true : false;
    return {
        mode: env || 'development',
        entry: {
            app: path.resolve(__dirname, '../src/main.js')
        },
        output: {
            filename: 'js/[name].[hash:7].js', // 输出文件名
            path: path.resolve(__dirname, '../dist'),
            publicPath: '/'
        },
        devtool: 'eval-source-map',//源文件映射，便于开发环境调试。eval-source-map生成最佳品质的source-map
        devServer: {
            contentBase: path.join(__dirname, "../dist"),
            compress: true,
            port: 8070,
            open: true,//自动拉起浏览器
            hot: true,//热加载
            hotOnly:true,
            proxy: {
                '/api': {
                    target: 'http://localhost:8081',
                    pathRewrite: { '^/api': '/data' }
                }
            }
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, '../src'),
                "vue$": "vue/dist/vue.common.js"// 通过.vue文件进行模板编译时,需要添加此配置
            }
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                },
                {
                    test: /\.scss$/,
                    include: path.join(__dirname, '../src'),
                    use: [{
                        loader: "style-loader"//把样式内联在html文件中
                    }, {
                        loader: "css-loader" //将CSS转化成CommonJS模块
                    }, {
                        loader: "sass-loader" //将Sass编译成CSS
                    }],
                    exclude: /node_modules/
                },
                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    },
                    exclude: /(node_modules|bower_components)/,
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'images/[name].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                title: '萌芽笔记，你的个人管家',
                template: './index.html',
                filename: 'index.html',
                chunks: ['app'],
                minify: { // 压缩HTML文件
                    removeComments: true, // 移除HTML中的注释
                    collapseWhitespace: true, // 删除空白符与换行符
                    minifyCSS: true// 压缩内联css
                }
            })
        ]
    }
}