/* eslint-disable import/no-extraneous-dependencies */
const merge = require('deepmerge');
const { slSettings } = require('@advanced-rest-client/testing-karma-sl');
const createBaseConfig = require('./karma.conf.js');

module.exports = (config) => {
  const slConfig = merge(slSettings(config), {
    sauceLabs: {
      testName: 'raw-payload-editor',
    },
    client: {
      mocha: {
        timeout : 6000
      }
    }
  });
  // if you want to change default browsers
  slConfig.browsers = [
    'SL_Chrome',
    'SL_Chrome-1',
    'SL_Firefox',
    'SL_Firefox-1',
    'SL_Safari',
    'SL_Safari-1',
    // The passing lineNumber test doesn't work in Edge, even when it is actually
    // working when running demo on Edge. Disabling until January 2020 Edge release.
    // 'SL_EDGE'
  ];
  config.set(merge(createBaseConfig(config), slConfig));
  return config;
};
