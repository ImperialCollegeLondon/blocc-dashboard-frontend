/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_ENDPOINT,
      changeOrigin: true,
    })
  );
};