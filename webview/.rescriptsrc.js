const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
  (config) => {
    // Disable code splitting entirely
    config.optimization.runtimeChunk = false;
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
      },
    };

    // Always use a consistent output name, without
    // contenthash, so we can reliably locate it
    config.output.filename = 'static/js/[name].js';
    // We need to do this for CSS as well
    config.plugins[
      config.plugins.findIndex(
        (p) => p.constructor.name === 'MiniCssExtractPlugin'
      )
    ] = new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
    });

    return config;
  },
];
