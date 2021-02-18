const withAntdLess = require("next-plugin-antd-less");

const isProd = process.env.NODE_ENV === "production";

// fix: prevents error when .less files are required by node
if (typeof require !== "undefined") {
  require.extensions[".less"] = (file) => {};
}

module.exports = withAntdLess({
  // optional
  lessVarsFilePath: "./src/styles/antd.less",
  // optional https://github.com/webpack-contrib/css-loader#object
  cssLoaderOptions: {},

  // lessLoaderOptions: { javascriptEnabled: true },

  // Other Config Here...

  env: {
    PUBLIC_URL: "",
  },

  webpack(config) {
    return config;
  },
});

// const withSass = require("@zeit/next-sass");
// const withLess = require("@zeit/next-less");

// const isProd = process.env.NODE_ENV === "production";

// // fix: prevents error when .less files are required by node
// if (typeof require !== "undefined") {
//   require.extensions[".less"] = (file) => {};
// }

// module.exports = withLess(
//   withSass({
//     env: {
//       PUBLIC_URL: "",
//     },
//     lessLoaderOptions: {
//       javascriptEnabled: true,
//     },
//   })
// );
