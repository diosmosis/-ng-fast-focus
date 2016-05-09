exports.config = {
    framework: 'mocha',

    seleniumAddress: 'http://localhost:4444/wd/hub',

    specs: ['./e2e/*.spec.js'],

    mochaOpts: {
        reporter: "spec",
        slow: 3000
    }
};
