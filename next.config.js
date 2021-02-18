const withSass = require("@zeit/next-sass");
const withLess = require("@zeit/next-less");

const isProd = process.env.NODE_ENV === "production";

// fix: prevents error when .less files are required by node
if (typeof require !== "undefined") {
  require.extensions[".less"] = (file) => {};
}

module.exports = withLess(
  withSass({
    env: {
      PUBLIC_URL: "",
    },
    lessLoaderOptions: {
      javascriptEnabled: true,
    },
  })
);

// const withAntdLess = require("next-plugin-antd-less");

// module.exports = withAntdLess({
//   lessVarsFilePath: "./src/styles/antd.less",
//   // optional
//   cssLoaderOptions: {},

//   // Other Config Here...
//   env: {
//     PUBLIC_URL: "",
//   },

//   webpack(config) {
//     return config;
//   },
// });
