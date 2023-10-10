const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://api.1inch.dev",
      pathRewrite: {
        "^/api": "",
      },
      changeOrigin: true,
    })
  );
};
