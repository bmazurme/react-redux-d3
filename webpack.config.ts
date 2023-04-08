import path from 'path';
import type { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import NodemonPlugin from 'nodemon-webpack-plugin';
import { WebpackOpenBrowser } from 'webpack-open-browser';

type Environment = 'development' | 'production' | 'none' | undefined;

const common = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: ['node_modules'],
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
        'postcss-loader'],
      },
    ],
  },
};

const client = merge<Configuration>(common, {
  name: 'client',
  target: 'web',
  mode: process.env.NODE_ENV as Environment ?? 'development',
  devtool: 'inline-source-map',
  entry: ['./src/index.tsx'],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
  },
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './www/index.html',
    }),
    new WebpackOpenBrowser({
      url: 'http://localhost:3000',
      browser: 'chrome',
      arguments: [], // --incognito
    }),
  ],
});

const server = merge<Configuration>(common, {
  name: 'server',
  target: 'node',
  entry: ['./src/server/server.ts'],
  mode: process.env.NODE_ENV as Environment ?? 'development',
  externals: [
    nodeExternals({ allowlist: [/\.(?!(?:tsx?|json)$).{1,5}$/i] }),
  ],
  plugins: [
    new NodemonPlugin({
      script: './dist/server',
      watch: ['./dist'],
      delay: 1000,
      verbose: true,
      env: {
        NODE_ENV: 'development',
      },
    }),
  ],
  output: {
    filename: 'server.js',
    path: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['null-loader'],
      },
    ],
  },
});

export default [client, server];
