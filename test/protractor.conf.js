exports.config = {
    framework: 'mocha',

    specs: ['./e2e/*.spec.js'],

    mochaOpts: {
        reporter: "spec",
        slow: 3000
    }
};

if (process.env.TRAVIS) {
    console.log("Detected travis build, running on saucelabs...");

    exports.config.sauceUser = process.env.SAUCE_USERNAME;
    exports.config.sauceKey = process.env.SAUCE_ACCESS_KEY;
    exports.config.capabilities = {
        'browserName': 'chrome',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'build': process.env.TRAVIS_BUILD_NUMBER
    };
}
