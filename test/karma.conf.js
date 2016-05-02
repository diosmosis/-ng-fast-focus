module.exports = function( config ) {
    'use strict';

    var browsers = ['PhantomJS'],
        singleRun = true;
    function isDebug(argument) {
        return argument === '--debug' || argument === 'karma:debug';
    }

    if (process.argv.some(isDebug)) {
        browsers = ['Chrome'];
        singleRun = false;
    }

    config.set( {
        basePath: '../src',
        frameworks: [ 'mocha', 'chai', 'sinon' ],
        plugins: [
            'karma-mocha',
            'karma-chai',
            'karma-sinon',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-coverage'
        ],
        files: [
            '*.module.js',
            '*.js',
            '../test/spec/*.js'
        ],
        exclude: [],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            '*.js': ['coverage']
        },
        coverageReporter: {
            type: 'text'
        },
        port: 8081,
        browsers: browsers,
        singleRun: singleRun,
        colors: true,
        logLevel: config.LOG_INFO
    } );
};
