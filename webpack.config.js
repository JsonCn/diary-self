module.exports={
	//入口文件
	entry:"./modules/index.jsx",
	//发布文件
	output:{
		filename:"./pack/index.js",
	},
	//配置
	devServer:{
        host:'192.168.2.121'
	},
	module:{
		//加载机
		loaders:[
           //css
           {
           	test:/\.less$/,
           	loader:"style-loader!css-loader!less-loader"
           },
           //js
           {
           	test:/\.(js|jsx$)/,
           	// 避免处理node_modules内容
			exclude: 'node_modules/',
           	loader:"babel-loader?presets[]=react"
           },
           // 加载图片
			{
				// 图片规则
				test: /\.(gif|jpg|jpeg|png)$/,
				// 加载机  图片小于10kb的打包
				loader: 'url-loader?limit=10240'
			}
		]
	}
}