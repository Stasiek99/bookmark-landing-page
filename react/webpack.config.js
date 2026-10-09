const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (_env, { mode = 'development' }) => {
  const isProd = mode === 'production';

  process.env.BABEL_ENV = mode;

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
      assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
      publicPath: '',
      clean: true,
    },
    resolve: { extensions: ['.tsx', '.ts', '.js'] },
    devtool: isProd ? false : 'eval-source-map',
    module: {
      rules: [
        { test: /\.[jt]sx?$/, exclude: /node_modules/, use: 'babel-loader' },
        {
          test: /\.s?css$/,
          use: [
            isProd
              ? {
                  loader: MiniCssExtractPlugin.loader,
                  options: { publicPath: '../' },
                }
              : 'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        { test: /\.(svg|png|jpe?g|woff2?)$/, type: 'asset' },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon-32x32.png',
      }),
      ...(isProd ? [new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash:8].css' })] : []),
    ],
    optimization: { minimizer: ['...', new CssMinimizerPlugin()], splitChunks: { chunks: 'all' } },
    devServer: { port: 3000, hot: true, historyApiFallback: true },
  };
};
