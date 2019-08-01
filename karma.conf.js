/* eslint-disable import/no-extraneous-dependencies */
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = (config) => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        {
          pattern: config.grep ? config.grep : 'test/**/*.test.js',
          type: 'module'
        },
        {
          pattern: 'node_modules/jsonlint/lib/jsonlint.js',
          type: 'js'
        },
        {
          pattern: 'node_modules/codemirror/lib/codemirror.js',
          type: 'js'
        },
        {
          pattern: 'node_modules/codemirror/addon/mode/loadmode.js',
          type: 'js'
        },
        {
          pattern: 'node_modules/codemirror/mode/meta.js',
          type: 'js'
        },
        {
          pattern: 'node_modules/codemirror/mode/javascript/javascript.js',
          type: 'js'
        },
        {
          pattern: 'node_modules/codemirror/mode/xml/xml.js',
          type: 'js'
        },
        {
          pattern: 'node_modules/codemirror/mode/htmlmixed/htmlmixed.js',
          type: 'js'
        },
        {
          pattern: 'node_modules/codemirror/addon/lint/lint.js',
          type: 'js'
        },
        {
          pattern: 'node_modules/codemirror/addon/lint/json-lint.js',
          type: 'js'
        }
      ],

      // see the karma-esm docs for all options
      esm: {
        // if you are using 'bare module imports' you will need this option
        nodeResolve: true
      },

      coverageIstanbulReporter: {
        thresholds: {
          global: {
            statements: 80,
            branches: 80,
            functions: 89,
            lines: 80
          }
        }
      },
    })
  );
  return config;
};
