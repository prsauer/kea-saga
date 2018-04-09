'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.keaSaga = keaSaga;
exports.startSaga = startSaga;
exports.cancelSaga = cancelSaga;

var _effects = require('redux-saga/effects');

var _reduxSaga = require('redux-saga');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [keaSaga].map(_regenerator2.default.mark);

var emitter = void 0;
var cancelCounter = 1;
var toCancel = {};

function createComponentChannel(socket) {
  return (0, _reduxSaga.eventChannel)(function (emit) {
    emitter = emit;
    return function () {};
  });
}

function keaSaga() {
  var channel, _ref, _startSaga, _cancelSaga, saga, counter;

  return _regenerator2.default.wrap(function keaSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.call)(createComponentChannel);

        case 2:
          channel = _context.sent;

        case 3:
          if (!true) {
            _context.next = 20;
            break;
          }

          _context.next = 6;
          return (0, _effects.take)(channel);

        case 6:
          _ref = _context.sent;
          _startSaga = _ref.startSaga;
          _cancelSaga = _ref.cancelSaga;
          saga = _ref.saga;
          counter = _ref.counter;

          if (!_startSaga) {
            _context.next = 15;
            break;
          }

          _context.next = 14;
          return (0, _effects.fork)(saga);

        case 14:
          toCancel[counter] = _context.sent;

        case 15:
          if (!_cancelSaga) {
            _context.next = 18;
            break;
          }

          _context.next = 18;
          return (0, _effects.cancel)(toCancel[counter]);

        case 18:
          _context.next = 3;
          break;

        case 20:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

function startSaga(saga) {
  if (emitter) {
    cancelCounter += 1;
    emitter({ startSaga: true, saga: saga, counter: cancelCounter });
    return cancelCounter;
  }

  return null;
}

function cancelSaga(counter) {
  if (emitter) {
    emitter({ cancelSaga: true, counter: counter });
  }
}