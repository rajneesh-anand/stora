const withAntdLess = require("next-plugin-antd-less");

module.exports = withAntdLess({
  lessVarsFilePath: "./src/styles/antd.less",
  // optional
  cssLoaderOptions: {},

  // Other Config Here...
  env: {
    PUBLIC_URL: "",
  },

  webpack(config) {
    return config;
  },
});
