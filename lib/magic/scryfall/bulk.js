"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cardList = cardList;
exports.loadCard = loadCard;
exports.getCardProgress = getCardProgress;
exports.rulingList = rulingList;
exports.loadRuling = loadRuling;
exports.getRulingProgress = getRulingProgress;

var fs = _interopRequireWildcard(require("fs"));

var AsyncLock = _interopRequireWildcard(require("async-lock"));

var readline = _interopRequireWildcard(require("readline"));

var Reader = _interopRequireWildcard(require("async-stream-reader"));

var _config = require("../../../config");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var lock = new AsyncLock();
var cardProgress = {
  status: 'idle'
};
var rulingProgress = {
  status: 'idle'
};

function cardList() {
  var files = fs.readdirSync(_config.data + '/magic/bulk/scryfall').map(function (v) {
    return v.replace(/\.json$/, '');
  });
  return files.filter(function (v) {
    return v.startsWith('all-cards');
  }).sort();
}

function loadCard(file) {
  lock.acquire('card', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var path, rl, reader, line, text, json;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            path = _config.data + '/magic/bulk/scryfall' + file + '.json';
            rl = readline.createInterface({
              input: fs.createReadStream(path)
            });
            reader = new Reader(rl, {
              events: {
                data: 'line',
                end: 'close'
              }
            });

          case 3:
            if (!true) {
              _context.next = 18;
              break;
            }

            _context.next = 6;
            return reader.next();

          case 6:
            line = _context.sent;

            if (!(line === '[')) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("continue", 3);

          case 11:
            if (!(line === ']')) {
              _context.next = 13;
              break;
            }

            return _context.abrupt("break", 18);

          case 13:
            text = line.trim();

            if (text.endsWith(',')) {
              text = text.slice(0, -1);
            }

            json = JSON.parse(text);
            _context.next = 3;
            break;

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
}

function getCardProgress() {
  return cardProgress;
}

function rulingList() {
  var files = fs.readdirSync(_config.data + '/magic/bulk/scryfall').map(function (v) {
    return v.replace(/\.json$/, '');
  });
  return files.filter(function (v) {
    return v.startsWith('rulings');
  }).sort();
}

function loadRuling(_x) {
  return _loadRuling.apply(this, arguments);
}

function _loadRuling() {
  _loadRuling = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(file) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _loadRuling.apply(this, arguments);
}

function getRulingProgress() {
  return rulingProgress;
}