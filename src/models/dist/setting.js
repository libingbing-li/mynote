'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
var lz_string_1 = require('lz-string');
var app_1 = require('../utils/app');
var indexedDB_1 = require('../utils/indexedDB');
exports['default'] = {
  namespace: 'setting',
  state: {
    dataTxt: '',
    minTime: 0,
    maxTime: 0,
  },
  reducers: {
    changeState: function (state, _a) {
      var payload = _a.payload;
      return __assign(__assign({}, state), payload);
    },
  },
  effects: {
    exportJson: function (_a, _b) {
      var state, jsonData, setInput, compressed;
      var payload = _a.payload;
      var put = _b.put,
        call = _b.call,
        select = _b.select;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            return [
              4 /*yield*/,
              select(function (state) {
                return state.setting;
              }),
            ];
          case 1:
            state = _c.sent();
            return [
              4 /*yield*/,
              indexedDB_1['default'].getAllData(state.minTime, state.maxTime),
            ];
          case 2:
            jsonData = _c.sent();
            setInput = document.querySelector('#alldata');
            console.log('原文本长度', JSON.stringify(jsonData).length);
            compressed = lz_string_1['default'].compressToBase64(
              JSON.stringify(jsonData),
            );
            console.log('压缩后长度', compressed.length);
            setInput.value = compressed;
            setInput === null || setInput === void 0
              ? void 0
              : setInput.select();
            if (document.execCommand('copy')) {
              document.execCommand('copy');
              console.log('复制成功');
            }
            return [2 /*return*/];
        }
      });
    },
    importJson: function (_a, _b) {
      var state, setInput, data, str, success;
      var payload = _a.payload;
      var put = _b.put,
        call = _b.call,
        select = _b.select;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            return [
              4 /*yield*/,
              select(function (state) {
                return state.setting;
              }),
            ];
          case 1:
            state = _c.sent();
            setInput = document.querySelector('#alldata');
            data =
              setInput === null || setInput === void 0
                ? void 0
                : setInput.value;
            if (data === '') {
              app_1['default'].info('框内不存在文本');
              return [2 /*return*/];
            }
            str = lz_string_1['default'].decompressFromBase64(data) || '';
            return [
              4 /*yield*/,
              indexedDB_1['default'].setAllData(
                JSON.parse(str),
                state.minTime,
                state.maxTime,
              ),
            ];
          case 2:
            success = _c.sent();
            if (success) {
              console.log('导入成功');
              app_1['default'].info('导入成功');
            } else {
              app_1['default'].info('导入失败');
            }
            return [2 /*return*/];
        }
      });
    },
  },
};
