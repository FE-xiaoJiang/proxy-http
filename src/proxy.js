
var http = require('http');
var https = require('https');
// var deepmerge = require('deepmerge');

module.exports = function httpProxy(req, res, config) {
    if (!arguments.length) {
        throw new Error('http proxy should init with req...');
        return;
    }
    var defaultPort = config.useHttps ? 443 : 80;
    var defaultOrigin = `${config.useHttps ? 'https' : 'http'}://${config.host}`;
    var settings = {
        path: req.url,
        method: req.method,
        headers: Object.assign({}, req.headers, {
            'X-Real-IP': req.connection.remoteAddress,
            'x-requested-with': 'XMLHttpRequest',
            host: config.host,
            origin: config.origin || defaultOrigin,
            referer: config.referer || config.origin || defaultOrigin
        }),
        host: config.host,
        port: config.port || defaultPort,
        rejectUnauthorized: config.rejectUnauthorized || false
    };
	return new Promise((resolve, reject) => {
		var _proxy = (config.useHttps ? https : http).request(settings, (response) => {
            if (res) { // 直接pipe进行转发客户端
                res.writeHead(response.statusCode, Object.assign(response.headers, {
                    "proxy-from": "powered by FE-xiaojiang",
                }));
                response.pipe(res);
            }
			resolve(response);
        })
        if (!config.noPreBodyParser) { // 是否已预处理body解析
            var body = req.body;
            _proxy.write(JSON.stringify(body));
            _proxy.end();
        } else {
            // 需要把主体内容压入代理请求中转发出去
		    req.pipe(_proxy); // pipe竟然没有把实体头写过去????
        }
		
		// 当客户端请求关闭，代理也要取消
		req && req.on('close', () => _proxy.abort());
		_proxy.on('error', (err) => reject(err));
	});
	
}
