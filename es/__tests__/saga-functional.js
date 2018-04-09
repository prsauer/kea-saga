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

function SampleComponent() {
  return _react2.default.createElement(
    'div',
    null,
    'bla bla ble'
  );
}

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

  var ConnectedComponent = logicWithSaga(SampleComponent);

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


    takeEvery: function takeEvery(_ref3) {
      var _ref4;

      var actions = _ref3.actions,
          workers = _ref3.workers;
      return _ref4 = {}, _ref4[actions.myAction] = workers.doStuff, _ref4;
    },

    workers: {
      doStuff: _regenerator2.default.mark(function doStuff(action) {
        var value;
        return _regenerator2.default.wrap(function doStuff$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                value = action.payload.value;

                expect(value).toBe('something');

                // should already be in the store
                _context3.t0 = expect;
                _context3.next = 5;
                return this.get('someData');

              case 5:
                _context3.t1 = _context3.sent;
                (0, _context3.t0)(_context3.t1).toBe('something');


                takeEveryRan = true;

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, doStuff, this);
      })
    }
  });

  expect(sagaStarted).toBe(false);

  var ConnectedComponent = logicWithSaga(SampleComponent);

  var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(ConnectedComponent, { id: 12 })
  ));

  expect(sagaStarted).toBe(true);
  expect(takeEveryRan).toBe(true);

  wrapper.unmount();
});