var express = require('express');
var port = 3000;
var app = express();
app.use(function(req, res, next) {
    if (req.url.indexOf('/router') > -1) {
        res.json({
            router: 'router',
        });
    } else {
        next();
    }
    
})
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