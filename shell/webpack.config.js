const HtmlWebPackPlugin = require('html-webpack-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const Dotenv = require('dotenv-webpack')
require('dotenv').config()
const deps = require('./package.json').dependencies

const productRemoteUrl = process.env.PRODUCT_REMOTE_URL || 'http://localhost:3001/remoteEntry.js'
const cartRemoteUrl = process.env.CART_REMOTE_URL || 'http://localhost:3002/remoteEntry.js'
const profileRemoteUrl = process.env.PROFILE_REMOTE_URL || 'http://localhost:3003/remoteEntry.js'
const checkoutRemoteUrl = process.env.CHECKOUT_REMOTE_URL || 'http://localhost:3004/remoteEntry.js'

module.exports = () => ({
  output: {
    publicPath: 'http://localhost:3000/'
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
  },

  devServer: {
    port: 3000,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      filename: 'remoteEntry.js',
      remotes: {
        product: `product@${productRemoteUrl}`,
        cart: `cart@${cartRemoteUrl}`,
        profile: `profile@${profileRemoteUrl}`,
        checkout: `checkout@${checkoutRemoteUrl}`
      },
      exposes: {},
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom']
        }
      }
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html'
    }),
    new Dotenv({ silent: true })
  ]
})
