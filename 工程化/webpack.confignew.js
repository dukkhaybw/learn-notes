const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = {
  output: {
    clean: true,
    path: path.resolve(__dirname, './dist'),
    filename: ({ chunk }) => {
      if (chunk.name) {
        return `[name]/${chunk.name.substring(chunk.name.lastIndexOf('/') + 1)}.js`;
      }
      return 'script/react.[id].js';
    }
  },
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
});

module.exports = webpackConfig;
