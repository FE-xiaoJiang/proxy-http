
var http = require('http');
var https = require('https');
// var deepmerge = require('deepmerge');

module.exports = function httpProxy(req, res, options) {
    if (!arguments.length) {
        throw new Error('http proxy should init with req...');
        return;
    }
    var defaultPort = options.useHttps ? 443 : 80;
    var defaultOrigin = `${options.useHttps ? 'https' : 'http'}://${options.host}`;
    var settings = {
        path: req.url,
        method: req.method,
        headers: Object.assign({}, req.headers, {
            'X-Real-IP': req.connection.remoteAddress,
            'x-requested-with': 'XMLHttpRequest',
            host: options.host,
            origin: options.origin || defaultOrigin,
            referer: options.referer || options.origin || defaultOrigin
        }),
        host: options.host,
        port: options.port || defaultPort,
        rejectUnauthorized: options.rejectUnauthorized || false
    };
    if (settings.headers['content-length'] == 0) {
        delete settings.headers['content-length']; //
    }
	return new Promise((resolve, reject) => {
		var _proxy = (options.useHttps ? https : http).request(settings, (response) => {
            if (res) { // 直接pipe进行转发客户端
                res.writeHead(response.statusCode, Object.assign(response.headers, {
                    "proxy-from": "powered by FE-xiaojiang",
                }));
                response.pipe(res);
            }
			resolve(response);
        })
        if (!options.noPreBodyParser) { // 是否已预处理body解析，若已解析，取出body
            var body = req.body || options.body;
            if (!body) {
                // throw new Error('request body is parsed,but empty, pls confirm it!');
                reject(new Error('request body is parsed,but req.body is empty, pls confirm it, or you can set on options.body!'));
                return;
            }
            // console.log(settings.headers, body);
            if (body) {
                _proxy.write(JSON.stringify(body));
            }
            _proxy.end();
        } else {
            // console.log(settings.headers, body);
            // 需要把主体内容压入代理请求中转发出去
		    req.pipe(_proxy);
        }
		
		// 当客户端请求关闭，代理也要取消
		req && req.on('close', () => _proxy.abort());
		_proxy.on('error', (err) => reject(err));
	});
	
}
