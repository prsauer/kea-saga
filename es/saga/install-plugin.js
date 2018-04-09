'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _effects = require('redux-saga/effects');

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _createSaga = require('./create-saga');

var _createSaga2 = _interopRequireDefault(_createSaga);

var _getConnected = require('./get-connected');

var _getConnected2 = _interopRequireDefault(_getConnected);

var _injectToComponent = require('./inject-to-component');

var _injectToComponent2 = _interopRequireDefault(_injectToComponent);

var _createCombined = require('./create-combined');

var _createCombined2 = _interopRequireDefault(_createCombined);

var _saga = require('./saga');

var _kea = require('kea');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _kea.activatePlugin)({
  name: 'saga',

  beforeReduxStore: function beforeReduxStore(options) {
    options._sagaMiddleware = (0, _reduxSaga2.default)();
    options.middleware.push(options._sagaMiddleware);
  },

  afterReduxStore: function afterReduxStore(options, store) {
    options._sagaMiddleware.run(_saga.keaSaga);
    store._sagaMiddleware = options._sagaMiddleware;
  },

  isActive: function isActive(input) {
    return !!(input.sagas || input.start || input.stop || input.takeEvery || input.takeLatest || input.connect && input.connect.sagas);
  },

  afterConnect: function afterConnect(active, input, output) {
    var connect = input.connect || {};
    var connectedSagas = (0, _getConnected2.default)(connect);

    // sagas we automatically connect from actions && props
    if (connectedSagas.length > 0) {
      output.activePlugins.saga = true;
      input.sagas = input.sagas ? input.sagas.concat(connectedSagas) : connectedSagas;
    }

    // we have input: { connect: { sagas: [] } }, add to input: { sagas: [] }
    if (connect.sagas) {
      input.sagas = input.sagas ? input.sagas.concat(connect.sagas) : connect.sagas;
    }
  },

  afterCreateSingleton: function afterCreateSingleton(active, input, output) {
    if (output.selectors) {
      output.get = _regenerator2.default.mark(function _callee(key) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _effects.select)(key ? output.selectors[key] : output.selector);

              case 2:
                return _context.abrupt('return', _context.sent);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      });

      output.fetch = _regenerator2.default.mark(function _callee2() {
        var results,
            keys,
            i,
            _args2 = arguments;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                results = {};
                keys = Array.isArray(_args2[0]) ? _args2[0] : _args2;
                i = 0;

              case 3:
                if (!(i < keys.length)) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 6;
                return output.get(keys[i]);

              case 6:
                results[keys[i]] = _context2.sent;

              case 7:
                i++;
                _context2.next = 3;
                break;

              case 10:
                return _context2.abrupt('return', results);

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      });
    }

    if (active) {
      output.saga = _regenerator2.default.mark(function _callee5() {
        var sagas, hasSelectors, _singletonSagaBase, sagaActions, sagaPath;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                sagas = (input.sagas || []).map(function (saga) {
                  // if saga is a logic store, take it's ".saga", otherwise assume it's a generator function
                  return saga && saga._keaPlugins && saga._keaPlugins.saga && saga.saga ? saga.saga : saga;
                });


                if (input.start || input.stop || input.takeEvery || input.takeLatest) {
                  if (!output._createdSaga) {
                    hasSelectors = !!(output.selectors && (0, _keys2.default)(output.selectors).length > 0);
                    _singletonSagaBase = {
                      start: input.start,
                      stop: input.stop,
                      takeEvery: input.takeEvery,
                      takeLatest: input.takeLatest,
                      workers: input.workers ? (0, _assign2.default)({}, input.workers) : {},
                      key: output.key,
                      path: output.path,
                      get: hasSelectors ? _regenerator2.default.mark(function _callee3(key) {
                        return _regenerator2.default.wrap(function _callee3$(_context3) {
                          while (1) {
                            switch (_context3.prev = _context3.next) {
                              case 0:
                                _context3.next = 2;
                                return (0, _effects.select)(key ? output.selectors[key] : output.selector);

                              case 2:
                                return _context3.abrupt('return', _context3.sent);

                              case 3:
                              case 'end':
                                return _context3.stop();
                            }
                          }
                        }, _callee3, this);
                      }) : undefined,
                      fetch: hasSelectors ? _regenerator2.default.mark(function _callee4() {
                        var results,
                            keys,
                            i,
                            _args4 = arguments;
                        return _regenerator2.default.wrap(function _callee4$(_context4) {
                          while (1) {
                            switch (_context4.prev = _context4.next) {
                              case 0:
                                results = {};
                                keys = Array.isArray(_args4[0]) ? _args4[0] : _args4;
                                i = 0;

                              case 3:
                                if (!(i < keys.length)) {
                                  _context4.next = 10;
                                  break;
                                }

                                _context4.next = 6;
                                return this.get(keys[i]);

                              case 6:
                                results[keys[i]] = _context4.sent;

                              case 7:
                                i++;
                                _context4.next = 3;
                                break;

                              case 10:
                                return _context4.abrupt('return', results);

                              case 11:
                              case 'end':
                                return _context4.stop();
                            }
                          }
                        }, _callee4, this);
                      }) : undefined
                    };
                    sagaActions = (0, _assign2.default)({}, output.actions);


                    output._createdSaga = (0, _createSaga2.default)(_singletonSagaBase, { actions: sagaActions });
                  }

                  sagas.push(output._createdSaga);
                }

                sagaPath = output.path ? output.path.join('.') : input.path('').filter(function (p) {
                  return p;
                }).join('.');
                _context5.next = 5;
                return (0, _effects.call)((0, _createCombined2.default)(sagas, sagaPath));

              case 5:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      });
    }
  },

  injectToClass: function injectToClass(active, input, output, Klass) {
    if (active) {
      (0, _injectToComponent2.default)(Klass, input, output);
    }
  },

  injectToConnectedClass: function injectToConnectedClass(active, input, output, KonnektedKlass) {
    if (active) {
      (0, _injectToComponent2.default)(KonnektedKlass, input, output);
    }
  },

  addToResponse: function addToResponse(active, input, output, response) {
    response.saga = output.saga;
    response.get = output.get;
    response.fetch = output.fetch;
  }
});