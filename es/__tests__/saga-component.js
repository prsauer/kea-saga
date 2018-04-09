'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _kea = require('kea');

require('../index');

require('./helper/jsdom');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _enzyme = require('enzyme');

var _reactRedux = require('react-redux');

var _effects = require('redux-saga/effects');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// install the plugin

/* global test, expect, beforeEach */
beforeEach(function () {
  (0, _kea.resetKeaCache)();
});

var SampleComponent1 = function SampleComponent1() {
  return _react2.default.createElement(
    'div',
    null,
    'bla bla bla'
  );
};
var SampleComponent2 = function SampleComponent2() {
  return _react2.default.createElement(
    'div',
    null,
    'bla bla bla'
  );
};
var SampleComponent3 = function SampleComponent3() {
  return _react2.default.createElement(
    'div',
    null,
    'bla bla bla'
  );
};

test('the saga starts and stops with the component', function () {
  var store = (0, _kea.getStore)();

  var sagaStarted = false;

  var logicWithSaga = (0, _kea.kea)({
    start: _regenerator2.default.mark(function start() {
      return _regenerator2.default.wrap(function start$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              expect(this.props.id).toBe(12);
              sagaStarted = true;

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, start, this);
    })
  });

  expect(sagaStarted).toBe(false);

  var ConnectedComponent = logicWithSaga(SampleComponent1);

  var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(ConnectedComponent, { id: 12 })
  ));

  expect(sagaStarted).toBe(true);

  wrapper.unmount();
});

test('the actions get a key', function () {
  var store = (0, _kea.getStore)();

  var sagaStarted = false;
  var sagaStopped = false;
  var takeEveryRan = false;

  var getActionsFromHere = (0, _kea.kea)({
    actions: function actions() {
      return {
        something: true
      };
    }
  });

  var logicWithSaga = (0, _kea.kea)({
    connect: {
      actions: [getActionsFromHere, ['something']]
    },

    key: function key(props) {
      return props.id;
    },

    path: function path(key) {
      return ['scenes', 'sagaProps', key];
    },

    actions: function actions() {
      return {
        myAction: function myAction(value) {
          return { value: value };
        }
      };
    },

    reducers: function reducers(_ref) {
      var _ref2;

      var actions = _ref.actions;
      return {
        someData: ['nothing', _propTypes2.default.string, (_ref2 = {}, _ref2[actions.myAction] = function (state, payload) {
          return payload.value;
        }, _ref2)]
      };
    },

    start: _regenerator2.default.mark(function start() {
      var myAction;
      return _regenerator2.default.wrap(function start$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              expect(this.key).toBe(12);
              expect(this.props.id).toBe(12);
              expect(this.path).toEqual(['scenes', 'sagaProps', 12]);
              expect((0, _keys2.default)(this.actions)).toEqual(['something', 'myAction']);

              myAction = this.actions.myAction;

              expect(myAction('something')).toEqual({ type: myAction.toString(), payload: { key: 12, value: 'something' } });

              _context2.t0 = expect;
              _context2.next = 9;
              return this.get('someData');

            case 9:
              _context2.t1 = _context2.sent;
              (0, _context2.t0)(_context2.t1).toEqual('nothing');
              _context2.next = 13;
              return (0, _effects.put)(myAction('something'));

            case 13:
              _context2.t2 = expect;
              _context2.next = 16;
              return this.get('someData');

            case 16:
              _context2.t3 = _context2.sent;
              (0, _context2.t2)(_context2.t3).toEqual('something');


              sagaStarted = true;

            case 19:
            case 'end':
              return _context2.stop();
          }
        }
      }, start, this);
    }),
    stop: _regenerator2.default.mark(function stop() {
      return _regenerator2.default.wrap(function stop$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              sagaStopped = true;

            case 1:
            case 'end':
              return _context3.stop();
          }
        }
      }, stop, this);
    }),


    takeEvery: function takeEvery(_ref3) {
      var _ref4;

      var actions = _ref3.actions,
          workers = _ref3.workers;
      return _ref4 = {}, _ref4[actions.myAction] = workers.doStuff, _ref4;
    },

    workers: {
      doStuff: _regenerator2.default.mark(function doStuff(action) {
        var value;
        return _regenerator2.default.wrap(function doStuff$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                value = action.payload.value;

                expect(value).toBe('something');

                // should already be in the store
                _context4.t0 = expect;
                _context4.next = 5;
                return this.get('someData');

              case 5:
                _context4.t1 = _context4.sent;
                (0, _context4.t0)(_context4.t1).toBe('something');


                takeEveryRan = true;

              case 8:
              case 'end':
                return _context4.stop();
            }
          }
        }, doStuff, this);
      })
    }
  });

  expect(sagaStarted).toBe(false);

  var ConnectedComponent = logicWithSaga(SampleComponent2);

  var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(ConnectedComponent, { id: 12 })
  ));
  expect(sagaStarted).toBe(true);
  expect(takeEveryRan).toBe(true);

  wrapper.unmount();

  expect(sagaStopped).toBe(true);
});

test('can get() connected values', function () {
  var store = (0, _kea.getStore)();

  var sagaStarted = false;
  var takeEveryRan = false;

  var firstLogic = (0, _kea.kea)({
    actions: function actions() {
      return {
        myAction: true
      };
    },
    reducers: function reducers(_ref5) {
      var _ref6;

      var actions = _ref5.actions;
      return {
        connectedValue: [12, _propTypes2.default.number, (_ref6 = {}, _ref6[actions.myAction] = function () {
          return 42;
        }, _ref6)]
      };
    }
  });

  var otherLogicWithSaga = (0, _kea.kea)({
    connect: {
      actions: [firstLogic, ['myAction']],
      props: [firstLogic, ['connectedValue']]
    },

    path: function path(key) {
      return ['scenes', 'sagaProps2'];
    },

    start: _regenerator2.default.mark(function start() {
      var myAction;
      return _regenerator2.default.wrap(function start$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              expect(this.path).toEqual(['scenes', 'sagaProps2']);
              expect((0, _keys2.default)(this.actions)).toEqual(['myAction']);

              myAction = this.actions.myAction;
              _context5.t0 = expect;
              _context5.next = 6;
              return firstLogic.get('connectedValue');

            case 6:
              _context5.t1 = _context5.sent;
              (0, _context5.t0)(_context5.t1).toEqual(12);
              _context5.t2 = expect;
              _context5.next = 11;
              return this.get('connectedValue');

            case 11:
              _context5.t3 = _context5.sent;
              (0, _context5.t2)(_context5.t3).toEqual(12);
              _context5.next = 15;
              return (0, _effects.put)(myAction());

            case 15:
              _context5.t4 = expect;
              _context5.next = 18;
              return firstLogic.get('connectedValue');

            case 18:
              _context5.t5 = _context5.sent;
              (0, _context5.t4)(_context5.t5).toEqual(42);
              _context5.t6 = expect;
              _context5.next = 23;
              return this.get('connectedValue');

            case 23:
              _context5.t7 = _context5.sent;
              (0, _context5.t6)(_context5.t7).toEqual(42);


              sagaStarted = true;

            case 26:
            case 'end':
              return _context5.stop();
          }
        }
      }, start, this);
    }),


    takeEvery: function takeEvery(_ref7) {
      var _ref8;

      var actions = _ref7.actions,
          workers = _ref7.workers;
      return _ref8 = {}, _ref8[actions.myAction] = workers.doStuff, _ref8;
    },

    workers: {
      doStuff: _regenerator2.default.mark(function doStuff(action) {
        return _regenerator2.default.wrap(function doStuff$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.t0 = expect;
                _context6.next = 3;
                return this.get('connectedValue');

              case 3:
                _context6.t1 = _context6.sent;
                (0, _context6.t0)(_context6.t1).toBe(42);

                takeEveryRan = true;

              case 6:
              case 'end':
                return _context6.stop();
            }
          }
        }, doStuff, this);
      })
    }
  });

  expect(sagaStarted).toBe(false);

  var ConnectedComponent = otherLogicWithSaga(SampleComponent3);

  var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(ConnectedComponent, null)
  ));

  expect(sagaStarted).toBe(true);
  expect(takeEveryRan).toBe(true);

  wrapper.unmount();
});