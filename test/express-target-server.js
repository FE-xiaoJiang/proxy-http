var express = require('express');
var port = 3000;
var app = express();
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multipart());
app.use(function(req, res, next) {
    if (req.url.indexOf('/router') > -1) {
        res.json({
            router: 'router',
        });
    } else {
        next();
    }
    
})
app.all('/test_with_body', function(req, res, next) {
    // console.log('get body params==========>', req.body);
    res.json(req.body);
});
app.all('/test', function(req, res, next) {
    res.json({
        testObj: {
            hh: 'hh'
        }
    });
});
app.use(function(req, res, next) {
    res.json({
        status: 404
    })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});