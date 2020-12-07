const fss = require('fs');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const parent = fss.readdirSync(path.resolve(__dirname, '../src/pages'));

const env = process.env.NODE_ENV !== 'production';

const pagesPlugin = [];

const format = (str) => str.split('-').join(' ');

const generate = (file, template, folder) => {
  const title = file.replace(/\.pug$/, '');
  const index = title === 'index';

  const page = new HtmlWebpackPlugin({
    template,
    filename: index ? `${folder}/index.html` : `${folder}/${title}/index.html`,
    title: index ? folder : format(title),
    inject: 'head',
    chunks: ['main', title],
    minify: env,
    favicon: path.resolve(__dirname, '../src/static/favicon.png'),
  });

  pagesPlugin.push(page);
};

parent.forEach((child) => {
  if (child !== 'includes') {
    const location = path.resolve(__dirname, `../src/pages/${child}`);
    const page = fss.readdirSync(location);

    if (page.length !== 0) {
      page.forEach((file) => {
        const template = path.join(location, `/${file}`);
        generate(file, template, child);
      });
    }
  }
});

module.exports = pagesPlugin;
