'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _kea = require('kea');

var _index = require('../index');

var _redux = require('redux');

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _effects = require('redux-saga/effects');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global test, expect, beforeEach */
beforeEach(function () {
  (0, _kea.resetKeaCache)();
});

test('can have a kea with only a saga', function () {
  var sagaRan = false;

  // must run keaReducer at first so there is a point where to mount the keas
  var reducers = (0, _redux.combineReducers)({
    scenes: (0, _kea.keaReducer)('scenes')
  });

  var sagaLogic = (0, _kea.kea)({
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              expect(this.get).not.toBeDefined();
              expect(this.fetch).not.toBeDefined();
              sagaRan = true;

            case 3:
            case 'end':
              return _context.stop();
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

  expect(sagaRan).toBe(false);

  var sagaMiddleware = (0, _reduxSaga2.default)();
  var finalCreateStore = (0, _redux.compose)((0, _redux.applyMiddleware)(sagaMiddleware))(_redux.createStore);
  finalCreateStore(reducers);

  sagaMiddleware.run(sagaLogic.saga);

  expect(sagaRan).toBe(true);
});

test('can access defined actions', function () {
  var sagaRan = false;

  var reducers = (0, _redux.combineReducers)({
    scenes: (0, _kea.keaReducer)('scenes')
  });

  var sagaLogic = (0, _kea.kea)({
    actions: function actions() {
      return {
        doSomething: function doSomething(input) {
          return { input: input };
        }
      };
    },
    reducers: function reducers(_ref) {
      var actions = _ref.actions;
      return {
        something: [false, _propTypes2.default.bool, {}]
      };
    },
    start: _regenerator2.default.mark(function start() {
      var doSomething;
      return _regenerator2.default.wrap(function start$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              expect(this.path).toBeDefined();
              expect(this.actions).toBeDefined();
              expect(this.get).toBeDefined();
              expect(this.fetch).toBeDefined();
              expect((0, _keys2.default)(this.actions)).toEqual(['doSomething']);

              doSomething = this.actions.doSomething;

              expect(doSomething('input-text')).toEqual({ type: doSomething.toString(), payload: { input: 'input-text' } });

              sagaRan = true;

            case 8:
            case 'end':
              return _context2.stop();
          }
        }
      }, start, this);
    })
  });

  expect(sagaLogic._isKeaSingleton).toBe(true);
  expect(sagaLogic._hasKeaConnect).toBe(false);
  expect(sagaLogic._hasKeaLogic).toBe(true);
  expect(sagaLogic._keaPlugins.saga).toBe(true);

  expect(sagaLogic.saga).toBeDefined();

  expect(sagaRan).toBe(false);

  var sagaMiddleware = (0, _reduxSaga2.default)();
  var finalCreateStore = (0, _redux.compose)((0, _redux.applyMiddleware)(sagaMiddleware))(_redux.createStore);
  finalCreateStore(reducers);

  sagaMiddleware.run(sagaLogic.saga);

  expect(sagaRan).toBe(true);
});

test('takeEvery and takeLatest work with workers', function () {
  var sagaRan = false;
  var everyRan = false;
  var latestRan = false;

  var reducers = (0, _redux.combineReducers)({
    scenes: (0, _kea.keaReducer)('scenes')
  });

  var sagaLogic = (0, _kea.kea)({
    actions: function actions() {
      return {
        doEvery: function doEvery(input) {
          return { input: input };
        },
        doLatest: function doLatest(input) {
          return { input: input };
        }
      };
    },
    reducers: function reducers(_ref2) {
      var actions = _ref2.actions;
      return {
        something: [false, _propTypes2.default.bool, {}]
      };
    },
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              expect(this.get).toBeDefined();
              expect(this.fetch).toBeDefined();
              sagaRan = true;

            case 3:
            case 'end':
              return _context3.stop();
          }
        }
      }, start, this);
    }),
    takeEvery: function takeEvery(_ref3) {
      var _ref4;

      var actions = _ref3.actions,
          workers = _ref3.workers;
      return _ref4 = {}, _ref4[actions.doEvery] = workers.doEvery, _ref4;
    },
    takeLatest: function takeLatest(_ref5) {
      var _ref6;

      var actions = _ref5.actions,
          workers = _ref5.workers;
      return _ref6 = {}, _ref6[actions.doLatest] = workers.doLatest, _ref6;
    },
    workers: {
      doEvery: _regenerator2.default.mark(function doEvery() {
        return _regenerator2.default.wrap(function doEvery$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                expect(this.actions).toBeDefined();
                expect(this.get).toBeDefined();
                expect(this.fetch).toBeDefined();
                everyRan = true;

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, doEvery, this);
      }),
      doLatest: _regenerator2.default.mark(function doLatest() {
        return _regenerator2.default.wrap(function doLatest$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                latestRan = true;

              case 1:
              case 'end':
                return _context5.stop();
            }
          }
        }, doLatest, this);
      })
    }
  });

  expect(sagaLogic._isKeaSingleton).toBe(true);
  expect(sagaLogic._hasKeaConnect).toBe(false);
  expect(sagaLogic._hasKeaLogic).toBe(true);
  expect(sagaLogic._keaPlugins.saga).toBe(true);

  expect(sagaLogic.saga).toBeDefined();

  expect(sagaRan).toBe(false);

  var sagaMiddleware = (0, _reduxSaga2.default)();
  var finalCreateStore = (0, _redux.compose)((0, _redux.applyMiddleware)(sagaMiddleware))(_redux.createStore);

  var store = finalCreateStore(reducers);

  sagaMiddleware.run(_index.keaSaga);
  sagaMiddleware.run(sagaLogic.saga);

  store.dispatch(sagaLogic.actions.doEvery('input-every'));
  store.dispatch(sagaLogic.actions.doLatest('input-latest'));

  expect(sagaRan).toBe(true);
  expect(everyRan).toBe(true);
  expect(latestRan).toBe(true);
});

test('takeEvery and takeLatest work with inline functions', function () {
  var sagaRan = false;
  var everyRan = false;
  var latestRan = false;

  var reducers = (0, _redux.combineReducers)({
    scenes: (0, _kea.keaReducer)('scenes')
  });

  var sagaLogic = (0, _kea.kea)({
    actions: function actions() {
      return {
        doEvery: function doEvery(input) {
          return { input: input };
        },
        doLatest: function doLatest(input) {
          return { input: input };
        }
      };
    },
    reducers: function reducers(_ref7) {
      var actions = _ref7.actions;
      return {
        something: [false, _propTypes2.default.bool, {}]
      };
    },
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              expect(this.get).toBeDefined();
              expect(this.fetch).toBeDefined();
              sagaRan = true;

            case 3:
            case 'end':
              return _context6.stop();
          }
        }
      }, start, this);
    }),
    takeEvery: function takeEvery(_ref8) {
      var _ref9;

      var actions = _ref8.actions,
          workers = _ref8.workers;
      return _ref9 = {}, _ref9[actions.doEvery] = _regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                expect(this.actions).toBeDefined();
                expect(this.get).toBeDefined();
                expect(this.fetch).toBeDefined();
                everyRan = true;

              case 4:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee, this);
      }), _ref9;
    },
    takeLatest: function takeLatest(_ref10) {
      var _ref11;

      var actions = _ref10.actions,
          workers = _ref10.workers;
      return _ref11 = {}, _ref11[actions.doLatest] = _regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                latestRan = true;

              case 1:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee2, this);
      }), _ref11;
    }
  });

  expect(sagaLogic._isKeaSingleton).toBe(true);
  expect(sagaLogic._hasKeaConnect).toBe(false);
  expect(sagaLogic._hasKeaLogic).toBe(true);
  expect(sagaLogic._keaPlugins.saga).toBe(true);

  expect(sagaLogic.saga).toBeDefined();

  expect(sagaRan).toBe(false);

  var sagaMiddleware = (0, _reduxSaga2.default)();
  var finalCreateStore = (0, _redux.compose)((0, _redux.applyMiddleware)(sagaMiddleware))(_redux.createStore);

  var store = finalCreateStore(reducers);

  sagaMiddleware.run(_index.keaSaga);
  sagaMiddleware.run(sagaLogic.saga);

  store.dispatch(sagaLogic.actions.doEvery('input-every'));
  store.dispatch(sagaLogic.actions.doLatest('input-latest'));

  expect(sagaRan).toBe(true);
  expect(everyRan).toBe(true);
  expect(latestRan).toBe(true);
});

test('can access values on reducer', function () {
  var sagaRan = false;

  var reducers = (0, _redux.combineReducers)({
    scenes: (0, _kea.keaReducer)('scenes')
  });

  var sagaLogic = (0, _kea.kea)({
    actions: function actions() {
      return {
        setString: function setString(string) {
          return { string: string };
        }
      };
    },
    reducers: function reducers(_ref12) {
      var _ref13;

      var actions = _ref12.actions;
      return {
        ourString: ['nothing', _propTypes2.default.string, (_ref13 = {}, _ref13[actions.setString] = function (state, payload) {
          return payload.string;
        }, _ref13)]
      };
    },
    start: _regenerator2.default.mark(function start() {
      var setString;
      return _regenerator2.default.wrap(function start$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              setString = this.actions.setString;


              expect(this.get).toBeDefined();
              expect(this.fetch).toBeDefined();

              _context9.t0 = expect;
              _context9.next = 6;
              return this.get('ourString');

            case 6:
              _context9.t1 = _context9.sent;
              (0, _context9.t0)(_context9.t1).toBe('nothing');
              _context9.next = 10;
              return (0, _effects.put)(setString('something'));

            case 10:
              _context9.t2 = expect;
              _context9.next = 13;
              return this.get('ourString');

            case 13:
              _context9.t3 = _context9.sent;
              (0, _context9.t2)(_context9.t3).toBe('something');
              _context9.t4 = expect;
              _context9.next = 18;
              return this.fetch('ourString');

            case 18:
              _context9.t5 = _context9.sent;
              _context9.t6 = { ourString: 'something' };
              (0, _context9.t4)(_context9.t5).toEqual(_context9.t6);


              sagaRan = true;

            case 22:
            case 'end':
              return _context9.stop();
          }
        }
      }, start, this);
    })
  });

  expect(sagaLogic._isKeaSingleton).toBe(true);
  expect(sagaLogic._hasKeaConnect).toBe(false);
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
});