# proxy-http -- http(s)代理服务

## Example
```
var proxy = require('proxy-http');
var app = require('express')();
...
app.use(function(req, res, next) {
    if (req.url.indexOf('/router') > -1) {
        proxy(req, res, {
            host: 'localhost',
            port: '3000',
            useHttps: false
        });
    } else {
        next();
    }
})
...
```
## 返回值
### promise
* success：resolve 目标服务器返回response(http.ServerResponse)
* failed: reject err

## 参数
### req: http.IncomingMessage，proxy从其中获取部分参数：
* get url from req
* get method from req
* get headers from req
### res: 
* 1、若res is null,需要业务处理返回的response
* 2、若res not null,业务方无需处理，代理会直接转发响应到请求源
### options
* host（must）: 目标服务器ip或域名
* port（must）: 目标服务器端口，默认https为443，http为80
* useHttps: 是否使用https
* origin（optional）
* referer（optional）
* rejectUnauthorized（optional）: 默认false
* noPreBodyParser（optional）:默认false，默认业务服务器使用了body-parser或者connect-multiparty等其他解析器完成了请求头的解析，如业务无解析实体，需要设置为true