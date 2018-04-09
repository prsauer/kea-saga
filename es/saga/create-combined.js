'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = createCombinedSaga;

var _effects = require('redux-saga/effects');

var _kea = require('kea');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEBUG = false;

function createCombinedSaga(sagas) {
  var sagaPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  return _regenerator2.default.mark(function _callee() {
    var workers, i, worker, _i;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (DEBUG) {
              console.log('Starting ' + sagaPath);
            }

            if (!(sagaPath && (0, _kea.getCache)(sagaPath, 'sagaRunning'))) {
              _context.next = 6;
              break;
            }

            if (DEBUG) {
              console.log('Already running ' + sagaPath);
            }
            return _context.abrupt('return');

          case 6:
            (0, _kea.setCache)(sagaPath, { sagaRunning: true });

          case 7:
            workers = [];
            _context.prev = 8;
            i = 0;

          case 10:
            if (!(i < sagas.length)) {
              _context.next = 18;
              break;
            }

            _context.next = 13;
            return (0, _effects.fork)(sagas[i]);

          case 13:
            worker = _context.sent;

            workers.push(worker);

          case 15:
            i++;
            _context.next = 10;
            break;

          case 18:
            if (!true) {
              _context.next = 23;
              break;
            }

            _context.next = 21;
            return (0, _effects.take)('wait until worker cancellation');

          case 21:
            _context.next = 18;
            break;

          case 23:
            _context.prev = 23;
            _context.next = 26;
            return (0, _effects.cancelled)();

          case 26:
            if (!_context.sent) {
              _context.next = 34;
              break;
            }

            _i = 0;

          case 28:
            if (!(_i < workers.length)) {
              _context.next = 34;
              break;
            }

            _context.next = 31;
            return (0, _effects.cancel)(workers[_i]);

          case 31:
            _i++;
            _context.next = 28;
            break;

          case 34:
            (0, _kea.setCache)(sagaPath, { sagaRunning: false });
            if (DEBUG) {
              console.log('Stopped ' + sagaPath);
            }
            return _context.finish(23);

          case 37:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[8,, 23, 37]]);
  });
}