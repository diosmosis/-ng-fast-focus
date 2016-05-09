require('mocha-generators').install();

var path = require('path');
var expect = require('chai').expect;

var serve = require('koa-static');
var koa = require('koa');

describe('module: ngFastFocus', function () {
    this.timeout(30 * 1000);

    var server;
    var baseUrl = process.env.FAST_FOCUS_TEST_BASE_URL || 'http://localhost:8080';

    before(function () {
        server = startServer();
    });

    after(function () {
        server.close();
    });

    beforeEach(function () {
        browser.get(baseUrl + '/test/e2e/app/index.html');
        browser.wait(protractor.ExpectedConditions.presenceOf($('#item-3')), 5000);
    });

    it("should change the focus initially since an initial focus value is set", function * () {
        var activeElementId = yield activeElement().getAttribute('id');
        expect(activeElementId).to.equal('item-3');
    });

    it("should change the focus when the focus model is changed to a recognized value", function * () {
        element(by.id('cycle-focus')).click();

        var activeElementId = yield activeElement().getAttribute('id');
        expect(activeElementId).to.equal('item-0');
    });

    it("should not change the focus when the focus model is changed to an unrecognized value", function * () {
        var activeElementId = yield activeElement().getAttribute('id');
        expect(activeElementId).to.equal('item-3'); // sanity check

        element(by.id('set-incorrect-focus')).click(); // NOTE: clicking sets focus

        var activeElementId = yield activeElement().getAttribute('id');
        expect(activeElementId).to.equal('set-incorrect-focus');
    });

    function activeElement() {
        return browser.driver.switchTo().activeElement();
    }

    function startServer() {
        var basePath = path.join(__dirname, '../../');

        var app = koa();
        app.use(serve(basePath));
        return app.listen(8080);
    }
});
