"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withAuth = withAuth;

var _react = _interopRequireDefault(require("react"));

var _context = require("./context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function withAuth(Component) {
  return function AuthComponent(props) {
    return _react.default.createElement(_context.Consumer, null, function (auth) {
      return _react.default.createElement(Component, _extends({}, props, {
        auth: auth
      }));
    });
  };
}