'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _kea = require('kea');

var _index = require('../index');

var _propTypes = require('prop-types');

var _redux = require('redux');

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _effects = require('redux-saga/effects');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global test, expect, beforeEach */
beforeEach(function () {
  (0, _kea.resetKeaCache)();
});

test('can run sagas connected via { sagas: [] }', function () {
  var sagaMiddleware = (0, _kea.getStore)()._sagaMiddleware;

  var sagaRan = false;
  var connectedSagaRan = false;
  var ranLast = void 0;

  var connectedSagaLogic = (0, _kea.kea)({
    path: function path() {
      return ['scenes', 'saga', 'connected'];
    },
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              expect(this.path).toEqual(['scenes', 'saga', 'connected']);
              connectedSagaRan = true;
              ranLast = 'connected';

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, start, this);
    })
  });

  var sagaLogic = (0, _kea.kea)({
    path: function path() {
      return ['scenes', 'saga', 'base'];
    },
    sagas: [connectedSagaLogic.saga],
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              expect(this.path).toEqual(['scenes', 'saga', 'base']);
              sagaRan = true;
              ranLast = 'base';

            case 3:
            case 'end':
              return _context2.stop();
          }
        }
      }, start, this);
    })
  });

  expect(sagaLogic._isKeaSingleton).toBe(true);
  expect(sagaLogic._hasKeaConnect).toBe(false);
  expect(sagaLogic._hasKeaLogic).toBe(false);
  expect(sagaLogic._keaPlugins.saga).toBe(true);

  expect(sagaLogic.saga).toBeDefined();

  sagaMiddleware.run(sagaLogic.saga);

  expect(sagaRan).toBe(true);
  expect(connectedSagaRan).toBe(true);
  expect(ranLast).toBe('base');
});

test('connect when passing the entire logic to sagas: []', function () {
  var sagaMiddleware = (0, _kea.getStore)()._sagaMiddleware;

  var otherConnectedRan = false;
  var sagaRan = false;
  var connectedSagaRan = false;

  var connectedSagaLogic = (0, _kea.kea)({
    path: function path() {
      return ['scenes', 'saga', 'connected'];
    },
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              expect(this.path).toEqual(['scenes', 'saga', 'connected']);
              connectedSagaRan = true;

            case 2:
            case 'end':
              return _context3.stop();
          }
        }
      }, start, this);
    })
  });

  var sagaLogic2 = (0, _kea.kea)({
    connect: {
      sagas: [_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                otherConnectedRan = true;

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee, this);
      })]
    },
    sagas: [connectedSagaLogic],
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              sagaRan = true;

            case 1:
            case 'end':
              return _context5.stop();
          }
        }
      }, start, this);
    })
  });

  sagaMiddleware.run(sagaLogic2.saga);

  expect(sagaRan).toBe(true);
  expect(connectedSagaRan).toBe(true);
  expect(otherConnectedRan).toBe(true);
});

test('connect without specifiying .saga', function () {
  var sagaMiddleware = (0, _kea.getStore)()._sagaMiddleware;

  var sagaRan = false;
  var connectedSagaRan = false;

  var connectedSagaLogic = (0, _kea.kea)({
    path: function path() {
      return ['scenes', 'saga', 'connected'];
    },
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              expect(this.path).toEqual(['scenes', 'saga', 'connected']);
              connectedSagaRan = true;

            case 2:
            case 'end':
              return _context6.stop();
          }
        }
      }, start, this);
    })
  });

  var sagaLogic3 = (0, _kea.kea)({
    sagas: [connectedSagaLogic],
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              sagaRan = true;

            case 1:
            case 'end':
              return _context7.stop();
          }
        }
      }, start, this);
    })
  });

  sagaMiddleware.run(sagaLogic3.saga);

  expect(sagaRan).toBe(true);
  expect(connectedSagaRan).toBe(true);
});

test('sagas get connected actions', function () {
  var sagaRan = false;
  var connectedSagaRan = false;

  var reducers = (0, _redux.combineReducers)({
    scenes: (0, _kea.keaReducer)('scenes')
  });

  var connectedSagaLogic = (0, _kea.kea)({
    path: function path() {
      return ['scenes', 'saga', 'connected'];
    },
    actions: function actions() {
      return {
        randomAction: true
      };
    },
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              expect(this.path).toEqual(['scenes', 'saga', 'connected']);
              expect((0, _keys2.default)(this.actions)).toEqual(['randomAction']);
              connectedSagaRan = true;

            case 3:
            case 'end':
              return _context8.stop();
          }
        }
      }, start, this);
    })
  });

  var sagaLogic = (0, _kea.kea)({
    connect: {
      actions: [connectedSagaLogic, ['randomAction']],
      sagas: [connectedSagaLogic]
    },
    path: function path() {
      return ['scenes', 'saga', 'base'];
    },
    actions: function actions() {
      return {
        myAction: true
      };
    },
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              expect(this.path).toEqual(['scenes', 'saga', 'base']);
              expect((0, _keys2.default)(this.actions).sort()).toEqual(['myAction', 'randomAction']);
              sagaRan = true;

            case 3:
            case 'end':
              return _context9.stop();
          }
        }
      }, start, this);
    })
  });

  expect(sagaLogic._isKeaSingleton).toBe(true);
  expect(sagaLogic._hasKeaConnect).toBe(true);
  expect(sagaLogic._hasKeaLogic).toBe(true);
  expect(sagaLogic._keaPlugins.saga).toBe(true);

  expect(sagaLogic.saga).toBeDefined();

  expect(sagaRan).toBe(false);

  var sagaMiddleware = (0, _reduxSaga2.default)();
  var finalCreateStore = (0, _redux.compose)((0, _redux.applyMiddleware)(sagaMiddleware))(_redux.createStore);

  finalCreateStore(reducers);

  sagaMiddleware.run(_index.keaSaga);
  sagaMiddleware.run(sagaLogic.saga);

  expect(sagaRan).toBe(true);
  expect(connectedSagaRan).toBe(true);
});

test('can get/fetch data from connected kea logic stores', function () {
  var sagaRan = false;
  var connectedSagaRan = false;

  var reducers = (0, _redux.combineReducers)({
    scenes: (0, _kea.keaReducer)('scenes')
  });

  var connectedSagaLogic = (0, _kea.kea)({
    path: function path() {
      return ['scenes', 'saga', 'connected'];
    },
    actions: function actions() {
      return {
        updateValue: function updateValue(number) {
          return { number: number };
        }
      };
    },
    reducers: function reducers(_ref) {
      var _ref2;

      var actions = _ref.actions;
      return {
        connectedValue: [0, _propTypes.PropTypes.number, (_ref2 = {}, _ref2[actions.updateValue] = function (_, payload) {
          return payload.number;
        }, _ref2)]
      };
    },
    start: _regenerator2.default.mark(function start() {
      var updateValue;
      return _regenerator2.default.wrap(function start$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              updateValue = this.actions.updateValue;
              _context10.next = 3;
              return (0, _effects.take)(updateValue().toString);

            case 3:
              _context10.t0 = expect;
              _context10.next = 6;
              return this.get('connectedValue');

            case 6:
              _context10.t1 = _context10.sent;
              (0, _context10.t0)(_context10.t1).toBe(4);


              connectedSagaRan = true;

            case 9:
            case 'end':
              return _context10.stop();
          }
        }
      }, start, this);
    })
  });

  var sagaLogic = (0, _kea.kea)({
    connect: {
      actions: [connectedSagaLogic, ['updateValue']],
      props: [connectedSagaLogic, ['connectedValue']],
      sagas: [connectedSagaLogic]
    },
    path: function path() {
      return ['scenes', 'saga', 'base'];
    },
    actions: function actions() {
      return {
        myAction: true
      };
    },
    start: _regenerator2.default.mark(function start() {
      var _actions, updateValue, myAction;

      return _regenerator2.default.wrap(function start$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _actions = this.actions, updateValue = _actions.updateValue, myAction = _actions.myAction;


              expect(updateValue).toBeDefined();
              expect(myAction).toBeDefined();

              _context11.t0 = expect;
              _context11.next = 6;
              return this.get('connectedValue');

            case 6:
              _context11.t1 = _context11.sent;
              (0, _context11.t0)(_context11.t1).toBe(0);
              _context11.t2 = expect;
              _context11.next = 11;
              return connectedSagaLogic.get('connectedValue');

            case 11:
              _context11.t3 = _context11.sent;
              (0, _context11.t2)(_context11.t3).toBe(0);
              _context11.next = 15;
              return (0, _effects.put)(updateValue(4));

            case 15:
              _context11.t4 = expect;
              _context11.next = 18;
              return connectedSagaLogic.get('connectedValue');

            case 18:
              _context11.t5 = _context11.sent;
              (0, _context11.t4)(_context11.t5).toBe(4);
              _context11.t6 = expect;
              _context11.next = 23;
              return this.get('connectedValue');

            case 23:
              _context11.t7 = _context11.sent;
              (0, _context11.t6)(_context11.t7).toBe(4);


              sagaRan = true;

            case 26:
            case 'end':
              return _context11.stop();
          }
        }
      }, start, this);
    })
  });

  expect(sagaRan).toBe(false);

  var sagaMiddleware = (0, _reduxSaga2.default)();
  var finalCreateStore = (0, _redux.compose)((0, _redux.applyMiddleware)(sagaMiddleware))(_redux.createStore);

  finalCreateStore(reducers);

  sagaMiddleware.run(_index.keaSaga);
  sagaMiddleware.run(sagaLogic.saga);

  expect(sagaRan).toBe(true);
  expect(connectedSagaRan).toBe(true);
});

test('will autorun sagas if not manually connected', function () {
  var sagaRan = false;
  var connectedSagaRan = false;

  var reducers = (0, _redux.combineReducers)({
    scenes: (0, _kea.keaReducer)('scenes')
  });

  var sagaMiddleware = (0, _reduxSaga2.default)();
  var finalCreateStore = (0, _redux.compose)((0, _redux.applyMiddleware)(sagaMiddleware))(_redux.createStore);
  finalCreateStore(reducers);
  sagaMiddleware.run(_index.keaSaga);

  var connectedSagaLogic = (0, _kea.kea)({
    actions: function actions() {
      return {
        updateValue: true
      };
    },
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              connectedSagaRan = true;

            case 1:
            case 'end':
              return _context12.stop();
          }
        }
      }, start, this);
    })
  });

  var sagaLogic = (0, _kea.kea)({
    connect: {
      actions: [connectedSagaLogic, ['updateValue']]
    },
    actions: function actions() {
      return {
        myAction: true
      };
    },
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              sagaRan = true;

            case 1:
            case 'end':
              return _context13.stop();
          }
        }
      }, start, this);
    })
  });

  sagaMiddleware.run(sagaLogic.saga);

  expect(sagaRan).toBe(true);
  expect(connectedSagaRan).toBe(true);
});

test('will autorun sagas if not manually connected, even if no internal saga', function () {
  var connectedSagaRan = false;

  var reducers = (0, _redux.combineReducers)({
    scenes: (0, _kea.keaReducer)('scenes')
  });

  var sagaMiddleware = (0, _reduxSaga2.default)();
  var finalCreateStore = (0, _redux.compose)((0, _redux.applyMiddleware)(sagaMiddleware))(_redux.createStore);
  finalCreateStore(reducers);
  sagaMiddleware.run(_index.keaSaga);

  var connectedSagaLogic = (0, _kea.kea)({
    actions: function actions() {
      return {
        updateValue: true
      };
    },
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              connectedSagaRan = true;

            case 1:
            case 'end':
              return _context14.stop();
          }
        }
      }, start, this);
    })
  });

  var sagaLogic = (0, _kea.kea)({
    connect: {
      actions: [connectedSagaLogic, ['updateValue']]
    }
  });

  sagaMiddleware.run(sagaLogic.saga);

  expect(sagaLogic._keaPlugins.saga).toBe(true);
  expect(connectedSagaRan).toBe(true);
});

test('will not run sagas that are already running', function () {
  var sagaRan = false;
  var connectedSagaRan = 0;

  var reducers = (0, _redux.combineReducers)({
    scenes: (0, _kea.keaReducer)('scenes')
  });

  var sagaMiddleware = (0, _reduxSaga2.default)();
  var finalCreateStore = (0, _redux.compose)((0, _redux.applyMiddleware)(sagaMiddleware))(_redux.createStore);
  finalCreateStore(reducers);
  sagaMiddleware.run(_index.keaSaga);

  var connectedSagaLogic = (0, _kea.kea)({
    actions: function actions() {
      return {
        updateValue: true
      };
    },
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              connectedSagaRan += 1;

            case 1:
            case 'end':
              return _context15.stop();
          }
        }
      }, start, this);
    })
  });

  var sagaLogic = (0, _kea.kea)({
    connect: {
      actions: [connectedSagaLogic, ['updateValue']],
      sagas: [connectedSagaLogic]
    },
    sagas: [connectedSagaLogic],
    actions: function actions() {
      return {
        myAction: true
      };
    },
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              sagaRan = true;

            case 1:
            case 'end':
              return _context16.stop();
          }
        }
      }, start, this);
    })
  });

  sagaMiddleware.run(sagaLogic.saga);

  expect(sagaRan).toBe(true);
  expect(connectedSagaRan).toBe(1);
});