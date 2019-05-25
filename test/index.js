var mocha = require('mocha');
var { expect, should } = require('chai');
var rp = require('request-promise');

describe('proxy test', function() {
    it('noPreBodyParser test', function(done) {
        rp.post('http://localhost:3001/test').then((res) => {
            expect(typeof JSON.parse(res).testObj).to.be.equal('object');
            done();
        });
    })
    it('router test', function(done) {
        rp.post('http://localhost:3001/router/test11').then((res) => {
            console.log('--------->', res);
            expect(JSON.parse(res).router).to.be.equal('router');
            done();
        });
    })
    it('404 test', function(done) {
        rp.post('http://localhost:3001/test404/test').then((res) => {
            console.log('404 test----->', res);
            // expect(res).to.be.equal('router');
            done();
        });
    })
});