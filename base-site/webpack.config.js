const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = function (env, args) {
    process.env.NODE_ENV = env;
    return {
        mode: env || 'development',
        entry: {
            app: path.resolve(__dirname, './src/main.js')
        },
        output: {
            filename: '[name].[chunkhash].js', // 输出文件名
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/'
        },
        devtool: 'none',
        devServer: {
            contentBase: './dist',
            compress: true,
            port: 8070
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
                        loader: "style-loader" //将JS字符串生成为style节点
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
                                name: '[name].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
           // new CleanWebpackPlugin(),
            new VueLoaderPlugin(),
            //new BundleAnalyzerPlugin(),
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
    };
}