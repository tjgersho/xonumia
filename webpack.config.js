var webpack = require("webpack");
module.exports = {
    entry: "./dev/js/app.js",
    output: {
        path: require("path").resolve("./public/js"),
        library: "app",
        filename: "app.js"
    },
     module: {
        loaders: [
            {
                test: /\.jsx?$/,
                //exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            }
        ]
    },
     resolve: {
   	 alias: {
       	 'jquery-ui': 'jquery-ui-dist/jquery-ui.js'
   	 	}
	},
    plugins:[
        new webpack.ProvidePlugin({ 
	     'window.jQuery':'jquery', 
            'jQuery': 'jquery',
            '$': 'jquery',
            'jquery': 'jquery'
        })
    ],
    //node: {
     //   fs: "empty"
    //},
    target: 'web'
};