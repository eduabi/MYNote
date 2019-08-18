const path = require('path');
const webpack = require('webpack');
const merge = require("webpack-merge");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = function (env, args) {
    let isDev = env === 'development' ? true : false;
    return {
        mode: env || 'development',
        entry: {
            app: path.resolve(__dirname, '../src/main.js')
        },
        output: {
            filename: 'js/[name].[hash:7].js', // 输出文件名
            path: path.resolve(__dirname, '../dist/static'),
            publicPath: '/static/'
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
                        loader: MiniCssExtractPlugin.loader//把css抽出来生成单独的css文件
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
        optimization: {
            minimizer: [new UglifyJsPlugin({
                test: /\.js(\?.*)?$/i,
                include: /\/includes/,
                exclude: /(node_modules|bower_components)/,  //排除的文件，用正则表示
                cache: true,   //是否启用缓存
                sourceMap: false,
                parallel: true, //多通道并行处理
                extractComments: false,
                uglifyOptions: {
                    warnings:false,
                    compress: {
                        unused: true, //是否去掉未关联的函数和变量
                        drop_console: false //是否屏蔽掉控制台输出
                    },
                    output: {
                        comments: false
                    }
                }
            })]
        },
        plugins: [
            new webpack.NamedModulesPlugin(),
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                title: '萌芽笔记，你的个人管家',
                template: './index.html',
                filename: '../index.html',
                chunks: ['app'],
                minify: { // 压缩HTML文件
                    removeComments: true, // 移除HTML中的注释
                    collapseWhitespace: true, // 删除空白符与换行符
                    minifyCSS: true// 压缩内联css
                }
            }),
            new MiniCssExtractPlugin({
                filename: isDev ? 'css/[name].css' : 'css/[name].[hash:7].css',
                chunkFilename: isDev ? 'css/[id].css' : 'css/[id].[hash:7].css',
            }),
            new BundleAnalyzerPlugin(),
            new CleanWebpackPlugin({
                exclude: ["index.html"]
            })
        ]
    }
}