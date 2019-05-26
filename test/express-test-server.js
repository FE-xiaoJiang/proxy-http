var express = require('express');
var port = 3001;
var app = express();
var proxy = require('../src/proxy');
app.use(function(req, res, next) {
    if (req.url.indexOf('/router') > -1) {
        proxy(req, res, {
            host: 'localhost',
            port: '3000',
            useHttps: false,
            noPreBodyParser: true,
        });
    } else {
        next();
    }
    
})
app.all('/test_with_body', function(req, res, next) {
    proxy(req, res, {
        host: 'localhost',
        port: '3000',
        useHttps: false,
        noPreBodyParser: true,
    });
});
app.all('/test', function(req, res, next) {
    proxy(req, res, {
        host: 'localhost',
        port: '3000',
        useHttps: false,
        noPreBodyParser: true,
    });
});
app.use(function(req, res, next) {
    proxy(req, res, {
        host: 'localhost',
        port: '3000',
        useHttps: false,
        noPreBodyParser: true,
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});