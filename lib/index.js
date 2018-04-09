'use strict';

exports.__esModule = true;
exports.keaSaga = undefined;

var _saga = require('./saga/saga');

Object.defineProperty(exports, 'keaSaga', {
  enumerable: true,
  get: function get() {
    return _saga.keaSaga;
  }
});

require('./saga/install-plugin');