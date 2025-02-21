const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const Webpackbar = require('webpackbar');
const fileExists = require('file-exists');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
  isProduction,
  START_APIURL,
  START_URL,
  START_APIURL_H5URL,
  SYSTEM,
  APPCALSS
} = require('./env');

const webpackConfig = {
  mode: process.env.NODE_ENV,
  devtool: false,
  entry: {},
  output: {
    clean: true,
    path: path.resolve(__dirname, './dist'),
    filename: ({ chunk }) => {
      if (chunk.name) {
        if (/.*(?<=header)$/.test(chunk.name)) {
          const name = chunk.name.substring(0, chunk.name.length - 7);
          return `${name}/${name.substring(name.lastIndexOf('/') + 1)}.header.js`;
        }
        return `[name]/${chunk.name.substring(chunk.name.lastIndexOf('/') + 1)}.js`;
      }
      return 'script/react.[id].js';
    }
  },
  // 设置开发者工具的端口号,不设置则默认为8080端口
  devServer: {
    hot: true,
    port: 8082
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json'],
    alias: {
      '@': path.join(__dirname, './src')
    }
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ],
    splitChunks: {
      chunks: 'all',
      minChunks: 2,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/, // test的值是路径时，表示全部来自该路径下的包都被打包为一个文件vendor中，[\\/]是兼容windows和mac的写法，取/或\
          filename: 'script/[id]_vendors.js', // 匹配到的所有包 统一打包到该文件
          priority: -10
        },
        default: {
          minChunks: 2, // 表示一个包至少被引用几次才能被拆包
          filename: 'script/common_[id].js',
          priority: -20
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: './images',
              name: (url) => {
                const idx = url.indexOf('src\\images\\');
                if (idx > -1) {
                  return url.substring(idx + 11).replace('\\', '/');
                }
                return url.substring(url.lastIndexOf('\\') + 1);
              },
              esModule: false
            }
          }
        ],
        type: 'javascript/auto'
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'media/[name][ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name][ext]'
        }
      }
    ]
  },
  plugins: [
    !isProduction && new webpack.HotModuleReplacementPlugin(),
    new Webpackbar(),
    new CopyPlugin({
      patterns: [
        { from: 'src/global.css', to: 'css/global.css' },
        { from: 'src/script', to: 'script' },
        { from: 'src/images', to: 'images' }
      ]
    }),
    isProduction &&
      new MiniCssExtractPlugin({
        filename: ({ chunk }) => {
          if (chunk.name != null) {
            if (/.*(?<=header)$/.test(chunk.name)) {
              const name = chunk.name.substring(0, chunk.name.length - 7);
              return `${name}/${name.substring(name.lastIndexOf('/') + 1)}.header.css`;
            }
            return `[name]/${chunk.name.substring(chunk.name.lastIndexOf('/') + 1)}.css`;
          }
          return 'css/vendors.[id].css';
        }
      }),
    false &&
      new ESLintPlugin({
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        fix: true,
        failOnError: true,
        cache: true,
        cacheLocation: path.resolve(path.resolve(__dirname, 'node_modules'), '.cache/.eslintcache'),
        cwd: path.resolve(__dirname),
        exclude: ['src/script/']
      })
  ].filter(Boolean)
};

// 获取指定路径下的入口文件
function getEntries(globPath) {
  const files = glob.sync(globPath);
  const entries = {};
  files.forEach((filepath) => {
    const idx = filepath.lastIndexOf('/');
    const name = filepath.substring(4, idx);
    entries[name] = `./${filepath}`;
  });
  return entries;
}

const entries = getEntries('src/**/index.js');

Object.keys(entries).forEach((name) => {
  webpackConfig.entry[name] = entries[name];
  const idx = name.lastIndexOf('/');
  const filename = name.substring(idx + 1);
  const split = name.split('/');
  let rootPath = '';
  split.forEach(() => {
    rootPath += '../';
  });
  if (fileExists.sync(`${path.join(__dirname, './src/') + name}/header.js`)) {
    webpackConfig.entry[`${name}/header`] = entries[name].replace('index.js', 'header.js');
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        filename: `${name}/${filename}.html`,
        title: filename,
        rootPath,
        template: './public/header.html',
        inject: true,
        chunks: [`${name}/header`]
      })
    );
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        filename: `${name}/${filename}_con.html`,
        title: filename,
        rootPath,
        template: './public/index.html',
        inject: true,
        chunks: [name]
      })
    );
  } else {
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        filename: `${name}/${filename}.html`,
        title: filename,
        rootPath,
        template: './public/index.html',
        inject: true,
        chunks: [name]
      })
    );
  }
});

webpackConfig.plugins.push(
  new HtmlWebpackPlugin({
    filename: 'start.html',
    template: `./src/start.html`,
    START_URL,
    START_APIURL,
    START_APIURL_H5URL,
    SYSTEM,
    APPCALSS,
    inject: true,
    chunks: ['']
  })
);

module.exports = webpackConfig;
