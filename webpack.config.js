/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-require-imports */
const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const extensionConfig = {
  target: 'node',
  entry: './src/extension.ts',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  devtool: false,
  externals: {
    vscode: 'commonjs vscode',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' },
        { from: 'src/webviews/*.html', to: 'webviews/[name].[ext]' },
      ],
    }),
  ],
};

const webviewConfig = {
  target: 'web',
  entry: {
    'job-tests': './src/webviews/assets/job-tests.tsx',
    'welcome': './src/webviews/assets/welcome.tsx',
    'upgrade': './src/webviews/assets/upgrade.tsx',
  },
  output: {
    path: resolve(__dirname, 'dist/webviews/assets'),
    filename: '[name].js',
    libraryTarget: 'window',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
};

module.exports = [extensionConfig, webviewConfig];
