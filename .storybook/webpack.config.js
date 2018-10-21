const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.ya?ml$/,
        use: [
          { loader: 'js-yaml-loader', options: { safe: false } },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },
    ],
  },
};
