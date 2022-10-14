const {createProxyMiddleware} = require( 'http-proxy-middleware');

module.exports = function(app) {
    proxy_url = process.env.PROXY_URL || 'http://localhost:8888'
    app.use('/auth/**', createProxyMiddleware({target: proxy_url}))
    app.use('/api/**', createProxyMiddleware({target: proxy_url}))

}