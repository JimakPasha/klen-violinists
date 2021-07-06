const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const optimization = () => {
	const config = {
		splitChunks: {
			chunks: 'all'
		}
	}

	if (isProd) {
		config.minimizer = [
			new OptimizeCssAssetWebpackPlugin(),
			new TerserWebpackPlugin()
		]
	}
	return config;
}

const plugins = () => {
	const base = [
		new HtmlWebpackPlugin({
			template: './index.html'
		}),
		new CleanWebpackPlugin({
			cleanStaleWebpackAssets: false
		}),
		new MiniCssExtractPlugin({
			filename: filename('css')
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: path.resolve(__dirname, 'src/assets'), to: path.resolve(__dirname, 'dist/assets') }
			],
		})
	]

	if (isProd) {
		base.push(new BundleAnalyzerPlugin());
	}

	return base;
}

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: './index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: filename('js')
	},
	resolve: {
		extensions: ['.js'],
		alias: {}
	},
	optimization: optimization(),
	devServer: {
		port: 8080,
		hot: isDev
	},
	devtool: isDev ? 'source-map' : false,
	plugins: plugins(),
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader']
			},
			{
				test: /\.s[ac]ss$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			},
			{
				test: /\.(png|jpg|svg|gif)$/,
				use: ['file-loader']
			}
		]
	}
}