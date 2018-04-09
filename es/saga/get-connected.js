'use strict';

exports.__esModule = true;
exports.default = getConnectedSagas;
function getConnectedSagas(mapping) {
  var sagas = [];
  var uniqueSagaKeys = {};

  var props = mapping.props || [];
  for (var i = 0; i < props.length; i += 2) {
    var logic = props[i];
    if (logic && logic._keaPlugins && logic._keaPlugins.saga && logic.path) {
      var sagaPath = logic.path.join('.');
      if (!uniqueSagaKeys[sagaPath]) {
        sagas.push(logic.saga);
        uniqueSagaKeys[sagaPath] = true;
      }
    }
  }

  var actions = mapping.actions || [];
  for (var _i = 0; _i < actions.length; _i += 2) {
    var _logic = actions[_i];
    if (_logic && _logic._keaPlugins && _logic._keaPlugins.saga && _logic.path) {
      var _sagaPath = _logic.path.join('.');
      if (!uniqueSagaKeys[_sagaPath]) {
        sagas.push(_logic.saga);
        uniqueSagaKeys[_sagaPath] = true;
      }
    }
  }

  return sagas;
}