module.exports = {
    // other config options...
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                   
                  }
                ]
              ]
            }
          }
        }
      ]
    }
  };
  