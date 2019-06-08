const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const CssUrlRelativePlugin = require('css-url-relative-plugin');
const IconfontPlugin = require('iconfont-plugin-webpack');
const CopyPlugin = require('copy-webpack-plugin');

const distPath = path.resolve(__dirname, 'dist');

const siteParam = {
  project: 'artmoney',
  lang: 'ru',
  title: 'ArtMoney',
  phone: ['+998 95 1990555', '+998 95 1990235'],
  social: {
    ok: 'https://ok.ru/',
    fb: 'https://www.facebook.com/',
    vk: 'https://vk.com/',
    inst: 'https://www.instagram.com/',
  },
};


module.exports = (env, args) => {
  process.env.NODE_ENV = args.mode;
  const devMode = args.mode === 'development';

  const config = {
    // mode: devMode ? "development" : "production",
    entry: {
      artmoney: './src/am-entry.js',
    },
    output: {
      path: distPath,
      filename: 'js/[name].[hash:8].js',
      // chunkFilename: 'js/[name].bundle.js',
      // publicPath: '',
    },
    module: {
      rules: [
        {
          test: /\.ejs$/,
          use: [
            // {
            //   loader: 'html-loader',
            //     options: {
            //       interpolate: true,
            //     },
            // },
            // {
            //   loader: 'extract-loader',
            // },
            {
              loader: 'ejs-loader',
            },
            {
              loader: 'extract-loader',
            },
            {
              loader: 'html-loader',
              // options: {
              //   interpolate: true,
              // },
            },
          ],
        },
        {
          test: /\.html$/i,
          use: 'html-loader',
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: [
            { loader: 'babel-loader', options: { cacheDirectory: true } },
          ],
        },
        {
          test: /\.(sass|scss|css)$/,
          use: [
            { loader: args.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader },
            { loader: 'css-loader', options: { importLoaders: 2, sourceMap: args.mode === 'development' } },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: args.mode === 'development',
              },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: args.mode === 'development', implementation: require('sass') },
            },
          ],
        },
        { // Внутри .css
          test: /\.(gif|png|jpg|jpeg|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                outputPath: './img',
                name: '[name]-[hash:8].[ext]',
                limit: 10 * 1024,
              },
            },
            {
              loader: 'image-webpack-loader',
              options: { disable: devMode },
            },
          ],
        },
        {
          test: /\.(svg|eot|ttf|woff|woff2)$/,
          include: path.resolve(__dirname, 'src/fonts'),
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: devMode ? '' : './fonts',
                name: devMode ? '[name].[ext]' : '[name].[ext]',
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new CleanWebpackPlugin(),

      new CopyPlugin([
        { from: './src/static', to: './' },
      ]),

      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        // 'window.$': 'jquery',
        // 'window.jQuery': 'jquery',

        // Костыль, чтоб подключить OwlCarousel2 и воткнуть jQuery в глобальную область видимости
        'window.Zepto': 'jquery',
      }),

      new CssUrlRelativePlugin(),

      new MiniCssExtractPlugin({
        // filename: 'css/style.css',
        // chunkFilename: 'css/style.css',
        filename: 'css/[name].[hash:8].css',
        chunkFilename: 'css/[name].[hash:8].css',
      }),

      new IconfontPlugin({
        src: './src/img/iconfont', // required - directory where your .svg files are located
        family: 'iconfont', // optional - the `font-family` name. if multiple iconfonts are generated, the dir names will be used.
        dest: {
          font: 'src/fonts/[family].[type]', // required - paths of generated font files
          css: 'src/scss/_[family].scss', // required - paths of generated css files
        },
        watch: {
          pattern: 'img/iconfont/*.svg', // required - watch these files to reload
          cwd: 'src/', // optional - current working dir for watching
        },
      }),

      new SVGSpritemapPlugin('src/img/sprite/*.svg', {
        output: {
          filename: 'images/sprite.svg',
          svg: {
            // Disable `width` and `height` attributes on the root SVG element
            // as these will skew the sprites when using the <view> via fragment identifiers
            sizes: false,
          },
          // svg4everybody: true,
        },
        sprite: {
          prefix: 'sprite-',
          generate: {
            // Generate <use> tags within the spritemap as the <view> tag will use this
            use: true,
            // view: '-fragment',

            // Generate <symbol> tags within the SVG to use in HTML via <use> tag
            symbol: true,
          },
        },
        styles: {
          // Specifiy that we want to use URLs with fragment identifiers in a styles file as well
          // format: 'fragment',

          // Path to the styles file, note that this method uses the `output.publicPath` webpack option
          // to generate the path/URL to the spritemap itself so you might have to look into that
          filename: path.join(__dirname, 'src/scss/_sprites.scss'),
          variables: {},
        },
      }),

      new HtmlWebpackPlugin({
        title: 'Главная',
        filename: 'am-main.html',
        template: path.resolve(__dirname, 'src/am-main.ejs'),
        templateParameters: siteParam,
        alwaysWriteToDisk: true,
      }),
      new HtmlWebpackPlugin({
        title: 'Статья',
        filename: 'am-article.html',
        template: path.resolve(__dirname, 'src/am-article.ejs'),
        templateParameters: siteParam,
        alwaysWriteToDisk: true,
      }),
      new HtmlWebpackPlugin({
        title: 'FAQ',
        filename: 'am-faq.html',
        template: path.resolve(__dirname, 'src/am-faq.ejs'),
        templateParameters: siteParam,
        alwaysWriteToDisk: true,
      }),
      new HtmlWebpackPlugin({
        title: 'Выданные займы',
        filename: 'am-loans-list.html',
        template: path.resolve(__dirname, 'src/am-loans-list.ejs'),
        templateParameters: siteParam,
        alwaysWriteToDisk: true,
      }),
      new HtmlWebpackPlugin({
        title: 'Спецтехника',
        filename: 'am-special-tech.html',
        template: path.resolve(__dirname, 'src/am-special-tech.ejs'),
        templateParameters: siteParam,
        alwaysWriteToDisk: true,
      }),
      new HtmlWebpackPlugin({
        title: 'Под залог авто',
        filename: 'am-zalog-auto.html',
        template: path.resolve(__dirname, 'src/am-zalog-auto.ejs'),
        templateParameters: siteParam,
        alwaysWriteToDisk: true,
      }),
      new HtmlWebpackPlugin({
        title: 'Под залог ПТС',
        filename: 'am-zalog-pts.html',
        template: path.resolve(__dirname, 'src/am-zalog-pts.ejs'),
        templateParameters: siteParam,
        alwaysWriteToDisk: true,
      }),
      new HtmlWebpackPlugin({
        title: 'Плохая кредитная история',
        filename: 'am-bad-history.html',
        template: path.resolve(__dirname, 'src/am-bad-history.ejs'),
        templateParameters: siteParam,
        alwaysWriteToDisk: true,
      }),
      new HtmlWebpackPlugin({
        title: 'Недвижимость',
        filename: 'am-property.html',
        template: path.resolve(__dirname, 'src/am-property.ejs'),
        templateParameters: siteParam,
        alwaysWriteToDisk: true,
      }),
      new HtmlWebpackPlugin({
        title: 'Автоломбард',
        filename: 'am-avtolombard.html',
        template: path.resolve(__dirname, 'src/am-avtolombard.ejs'),
        templateParameters: siteParam,
        alwaysWriteToDisk: true,
      }),

      new HtmlWebpackHarddiskPlugin(),
    ],


    // devtool: 'inline-source-map',


    devServer: {
      contentBase: distPath,
      port: 9002,
      lazy: false,
      host: '0.0.0.0',
      hot: true,
      inline: true,
      // compress: true,
      // open: true,
      historyApiFallback: true,
      watchContentBase: true,
    },
  };
  //
  // if (args.mode === 'production') {
  //   config.plugins.push(new OptimizeCSSAssetsPlugin({}));
  // }

  // if (args.mode === 'production') {
  //   config.optimization = {
  //     // runtimeChunk: {
  //     //   name: 'runtime'
  //     // },
  //     splitChunks: {
  //       cacheGroups: {
  //         // default: false,
  //         // styles: {
  //         //   name: 'styles',
  //         //   test: /\.(sass|scss|css)$/,
  //         //   chunks: 'initial',
  //         //   enforce: true,
  //         // },
  //         commons: {
  //           name: 'common',
  //           // test: /\.js$/,
  //           chunks: 'initial',
  //           minChunks: 2,
  //         },
  //       },
  //     },
  //   };
  // }

  return config;
};
