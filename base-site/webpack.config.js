const path = require('path');
const webpack = require('webpack');
const merge = require("webpack-merge");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = function (env, args) {
    let isDev = env === 'development' ? true : false;
    return {
        mode: env || 'development',
        entry: {
            app: path.resolve(__dirname, './src/main.js')
        },
        output: {
            filename: 'js/[name].[hash:7].js', // 输出文件名
            path: path.resolve(__dirname, 'dist/static'),
            publicPath: '/static/'
        },
        devtool: 'eval-source-map',
        devServer: {
            contentBase: './dist',
            compress: true,
            port: 8070,
            open: true,//自动拉起浏览器
            hot: true,//热加载
            proxy: {
                '/api': {
                    target: 'http://localhost:8081',
                    pathRewrite: { '^/api': '/data' }
                }
            }
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, './src')
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
                    include: path.join(__dirname, './src'),
                    use: [{
                        loader: MiniCssExtractPlugin.loader//"style-loader"
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
            new webpack.HotModuleReplacementPlugin()
            //new BundleAnalyzerPlugin(),
            // new CleanWebpackPlugin()
        ]
    }
}