'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys3 = require('babel-runtime/core-js/object/keys');

var _keys4 = _interopRequireDefault(_keys3);

exports.default = createSaga;

var _effects = require('redux-saga/effects');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// this = object with keys { takeEvery, takeLatest, start, stop }
// object = what is merged into _this after actions are created
function createSaga(_this) {
  var object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // bind all functions to _this
  var keys = (0, _keys4.default)(_this);
  for (var i = 0; i < keys.length; i++) {
    if (typeof _this[keys[i]] === 'function') {
      _this[keys[i]] = _this[keys[i]].bind(_this);
    }
  }

  if (_this.workers) {
    var _keys = (0, _keys4.default)(_this.workers);
    for (var _i = 0; _i < _keys.length; _i++) {
      if (typeof _this.workers[_keys[_i]] === 'function') {
        _this.workers[_keys[_i]] = _this.workers[_keys[_i]].bind(_this);
      }
    }
  }

  (0, _assign2.default)(_this, object);

  // generate the saga
  return _regenerator2.default.mark(function _callee() {
    var ops, opKeys, k, op, list, _keys2, _i2, fn, j;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            // start takeEvery and takeLatest watchers
            ops = { takeEvery: _effects.takeEvery, takeLatest: _effects.takeLatest };
            opKeys = (0, _keys4.default)(ops);
            k = 0;

          case 4:
            if (!(k < opKeys.length)) {
              _context.next = 30;
              break;
            }

            op = opKeys[k];

            if (!_this[op]) {
              _context.next = 27;
              break;
            }

            list = _this[op](_this);
            _keys2 = (0, _keys4.default)(list);
            _i2 = 0;

          case 10:
            if (!(_i2 < _keys2.length)) {
              _context.next = 27;
              break;
            }

            fn = list[_keys2[_i2]];

            if (!Array.isArray(fn)) {
              _context.next = 22;
              break;
            }

            j = 0;

          case 14:
            if (!(j < fn.length)) {
              _context.next = 20;
              break;
            }

            _context.next = 17;
            return ops[op](_keys2[_i2], fn[j].bind(_this));

          case 17:
            j++;
            _context.next = 14;
            break;

          case 20:
            _context.next = 24;
            break;

          case 22:
            _context.next = 24;
            return ops[op](_keys2[_i2], fn.bind(_this));

          case 24:
            _i2++;
            _context.next = 10;
            break;

          case 27:
            k++;
            _context.next = 4;
            break;

          case 30:
            if (!_this.start) {
              _context.next = 33;
              break;
            }

            _context.next = 33;
            return (0, _effects.call)(_this.start);

          case 33:
            if (!(_this.stop || _this.cancelled)) {
              _context.next = 39;
              break;
            }

          case 34:
            if (!true) {
              _context.next = 39;
              break;
            }

            _context.next = 37;
            return (0, _effects.take)('wait until worker cancellation');

          case 37:
            _context.next = 34;
            break;

          case 39:
            _context.prev = 39;
            _context.next = 42;
            return (0, _effects.cancelled)();

          case 42:
            if (!_context.sent) {
              _context.next = 46;
              break;
            }

            if (!_this.stop) {
              _context.next = 46;
              break;
            }

            _context.next = 46;
            return (0, _effects.call)(_this.stop);

          case 46:
            return _context.finish(39);

          case 47:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0,, 39, 47]]);
  });
}