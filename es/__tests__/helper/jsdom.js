'use strict';

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _getOwnPropertyNames = require('babel-runtime/core-js/object/get-own-property-names');

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('jsdom'),
    JSDOM = _require.JSDOM;

var jsdom = new JSDOM('<!doctype html><html><body></body></html>');
var window = jsdom.window;


function copyProps(src, target) {
  var props = (0, _getOwnPropertyNames2.default)(src).filter(function (prop) {
    return typeof target[prop] === 'undefined';
  }).map(function (prop) {
    return (0, _getOwnPropertyDescriptor2.default)(src, prop);
  });
  (0, _defineProperties2.default)(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js'
};
copyProps(window, global);