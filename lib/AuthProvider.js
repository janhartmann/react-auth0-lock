"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _auth0Lock = _interopRequireDefault(require("auth0-lock"));

var _context = require("./context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AuthProvider =
/*#__PURE__*/
function (_React$Component) {
  function AuthProvider(props) {
    var _this;

    _classCallCheck(this, AuthProvider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AuthProvider).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setSession", function (authResult, profile) {
      var session = {
        isAuthenticated: true,
        accessToken: authResult.accessToken,
        idToken: authResult.idToken,
        idTokenPayload: authResult.idTokenPayload,
        expiresAt: JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime()),
        profile: profile
      };

      _this.setState(session, function () {
        _this.lock.hide();

        _this.scheduleRenewal();

        _this.storeSession(session);
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "storeSession", function (session) {
      var storageKey = _this.props.storageKey;
      localStorage.setItem(storageKey, JSON.stringify(session));
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getStoredSession", function () {
      var storageKey = _this.props.storageKey;
      var session = localStorage.getItem(storageKey);
      return session ? JSON.parse(session) : null;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "isSessionExpired", function (expiresAt) {
      return new Date().getTime() > expiresAt;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "rehyrate", function () {
      var showLock = _this.props.showLock;

      var session = _this.getStoredSession();

      if (session && !_this.isSessionExpired(session.expiresAt)) {
        _this.setState(session, function () {
          _this.scheduleRenewal();
        });
      } else {
        if (showLock) {
          _this.lock.show();
        }
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "login", function () {
      _this.lock.show();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "logout", function (returnTo) {
      var storageKey = _this.props.storageKey;
      localStorage.removeItem(storageKey);
      clearTimeout(_this.tokenRenewalTimeout);

      _this.lock.logout({
        returnTo: returnTo
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "scheduleRenewal", function () {
      var expiresAt = _this.state.expiresAt;
      var delay = expiresAt - Date.now();

      if (delay > 0) {
        _this.tokenRenewalTimeout = setTimeout(function () {
          _this.renewToken();
        }, delay);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "renewToken", function () {
      _this.lock.checkSession({}, function (err, authResult) {
        if (err || !authResult) {
          _this.lock.show();
        } else {
          _this.lock.getUserInfo(authResult.accessToken, function (error, profile) {
            _this.setSession(authResult, profile);
          });
        }
      });
    });

    _this.lock = new _auth0Lock.default(props.clientId, props.domain, props.options);
    _this.tokenRenewalTimeout = null;
    _this.state = {
      lock: _this.lock,
      login: _this.login,
      logout: _this.logout
    };
    return _this;
  }

  _createClass(AuthProvider, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.rehyrate(); // Sync local storage to state

      this.lock.on("authenticated", function (authResult) {
        _this2.lock.getUserInfo(authResult.accessToken, function (error, profile) {
          if (error) {
            throw new Error(error);
          }

          _this2.setSession(authResult, profile);
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return _react.default.createElement(_context.Provider, {
        value: this.state
      }, children);
    }
  }]);

  _inherits(AuthProvider, _React$Component);

  return AuthProvider;
}(_react.default.Component);

exports.default = AuthProvider;

_defineProperty(AuthProvider, "propTypes", {
  storageKey: _propTypes.default.string.isRequired,
  clientId: _propTypes.default.string.isRequired,
  domain: _propTypes.default.string.isRequired,
  options: _propTypes.default.object.isRequired,
  showLock: _propTypes.default.bool,
  children: _propTypes.default.node
});

_defineProperty(AuthProvider, "defaultProps", {
  storageKey: "auth:auth0",
  options: {}
});