'use strict';

exports.__esModule = true;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.default = injectSagasIntoClass;

var _effects = require('redux-saga/effects');

var _saga = require('./saga');

var _createSaga = require('./create-saga');

var _createSaga2 = _interopRequireDefault(_createSaga);

var _createCombined = require('./create-combined');

var _createCombined2 = _interopRequireDefault(_createCombined);

var _kea = require('kea');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEBUG = false;

function injectSagasIntoClass(Klass, input, output) {
  var connectedActions = output.connected ? output.connected.actions : {};

  if (Klass.prototype._injectedKeaSaga) {
    console.error('[KEA] Error! Already injected kea saga into component "' + (Klass && Klass.name || Klass) + '"');
  }
  Klass.prototype._injectedKeaSaga = true;

  var originalComponentDidMount = Klass.prototype.componentDidMount;
  Klass.prototype.componentDidMount = function () {
    if (DEBUG) {
      console.log('component did mount');
    }

    // this === component instance
    this._keaSagaBase = {};
    this._keaRunningSaga = null;

    var key = input.key ? input.key(this.props) : null;
    var path = input.path(key);

    var sagas = (input.sagas || []).map(function (saga) {
      return saga && saga._keaPlugins && saga._keaPlugins.saga && saga.saga ? saga.saga : saga;
    });

    if (input.start || input.stop || input.takeEvery || input.takeLatest) {
      var _component = this;
      _component._keaSagaBase = {
        start: input.start,
        stop: input.stop,
        takeEvery: input.takeEvery,
        takeLatest: input.takeLatest,
        workers: input.workers ? (0, _assign2.default)({}, input.workers) : {},
        key: key,
        path: path,
        props: this.props,
        get: _regenerator2.default.mark(function get(key) {
          var _getCache, selectors, selector;

          return _regenerator2.default.wrap(function get$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _getCache = (0, _kea.getCache)(path), selectors = _getCache.selectors, selector = _getCache.selector;
                  _context.next = 3;
                  return (0, _effects.select)(key ? selectors[key] : selector);

                case 3:
                  return _context.abrupt('return', _context.sent);

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, get, this);
        }),
        fetch: _regenerator2.default.mark(function fetch() {
          var results,
              keys,
              i,
              _args2 = arguments;
          return _regenerator2.default.wrap(function fetch$(_context2) {
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
                  return _component._keaSagaBase.get(keys[i]);

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
          }, fetch, this);
        })
      };

      var sagaActions = (0, _assign2.default)({}, connectedActions);

      // inject key to the payload of created actions
      (0, _keys2.default)(output.actions || {}).forEach(function (actionKey) {
        if (key) {
          sagaActions[actionKey] = function () {
            var _output$actions;

            var createdAction = (_output$actions = output.actions)[actionKey].apply(_output$actions, arguments);
            return (0, _assign2.default)({}, createdAction, { payload: (0, _assign2.default)({ key: key }, createdAction.payload) });
          };
          sagaActions[actionKey].toString = output.actions[actionKey].toString;
        } else {
          sagaActions[actionKey] = output.actions[actionKey];
        }
      });

      var saga = (0, _createSaga2.default)(this._keaSagaBase, { actions: sagaActions });
      sagas.push(saga);
    }

    if (sagas.length > 0) {
      this._keaRunningSaga = (0, _saga.startSaga)((0, _createCombined2.default)(sagas, path.join('.')));
    }

    originalComponentDidMount && originalComponentDidMount.bind(this)();
  };

  var originalComponentWillReceiveProps = Klass.prototype.componentWillReceiveProps;
  Klass.prototype.componentWillReceiveProps = function (nextProps) {
    this._keaSagaBase.props = nextProps;

    originalComponentWillReceiveProps && originalComponentWillReceiveProps.bind(this)(nextProps);
  };

  var originalComponentWillUnmount = Klass.prototype.componentWillUnmount;
  Klass.prototype.componentWillUnmount = function () {
    if (DEBUG) {
      console.log('component will unmount');
    }
    // if (this._keaRunningSaga) {
    //   cancelSaga(this._keaRunningSaga)
    // }

    originalComponentWillUnmount && originalComponentWillUnmount.bind(this)();
  };
}