'use strict';
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
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
exports.__esModule = true;
var react_1 = require('react');
var umi_1 = require('umi');
var braft_editor_1 = require('braft-editor');
// 引入编辑器样式
require('braft-editor/dist/index.css');
var dva_1 = require('dva');
var icons_1 = require('@ant-design/icons');
var note_less_1 = require('./styles/note.less');
var Confirm_1 = require('@/common-components/Confirm');
// 编辑器的控件
var controls = [
  'text-color',
  'bold',
  'italic',
  'underline',
  'strike-through',
  'remove-styles',
  'text-align',
  'headings',
  'list-ul',
  'list-ol',
  'hr',
];
// 该页面用于编辑展示日记
var Note = /** @class */ (function (_super) {
  __extends(Note, _super);
  function Note() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.state = {
      isEdit: true,
      // 创建一个空的editorState作为初始值
      editorState: braft_editor_1['default'].createEditorState(null),
      newtag: '',
      tags: [],
      removeConfirm: false,
      confirmShow: false,
      isGiveData: true,
      tagsH: '0px',
    };
    //在本处获取新的props并更新
    _this.componentWillReceiveProps = function (nextProps) {
      // console.log('componentWillReceiveProps')
      // 此时异步操作完成，更改model数据后，在这个生命周期函数中发现props更新(此时是真正需要的props值)，然后更新state中的数据
      // isGiveData 原本为true，在获得一次editorState后变成false，这是为了防止在title更新后重置日记文本的内容
      if (nextProps.data === '' || !_this.state.isGiveData) {
        return;
      }
      _this.setState({
        editorState: braft_editor_1['default'].createEditorState(
          nextProps.data,
        ),
        isGiveData: false,
      });
      if (nextProps.tags.length === 0) {
        return;
      }
      _this.setState({
        tags: nextProps.tags,
      });
    };
    _this.saveNote = function () {
      // 在编辑器获得焦点时按下ctrl+s会执行此方法
      // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
      _this.props.dispatch({
        type: 'note/saveNote',
        payload: {
          data: _this.state.editorState.toHTML().toString(),
          goBack: umi_1.history.goBack,
          tags: _this.state.tags,
        },
      });
    };
    _this.removeConfirmShow = function () {
      // console.log('removeConfirmShow')
      _this.setState(function (prevState, props) {
        return {
          removeConfirm: !prevState.removeConfirm,
        };
      });
      // this.setState({
      //   removeConfirm: true,
      // })
    };
    _this.removeNote = function () {
      _this.props.dispatch({
        type: 'note/removeNote',
        payload: {
          goBack: umi_1.history.goBack,
        },
      });
    };
    _this.handleEditorChange = function (editorState) {
      // console.log('handleEditorChange')
      _this.setState({ editorState: editorState });
    };
    _this.changeModelState = function (proName, data) {
      var _a;
      // console.log('changeModelState',proName,data)
      _this.props.dispatch({
        type: 'note/changeState',
        payload: ((_a = {}), (_a[proName] = data), _a),
      });
    };
    // 添加tag
    _this.addTag = function () {
      var tags = _this.state.tags;
      tags.push(_this.state.newtag);
      _this.setState({
        newtag: '',
        tags: tags,
      });
    };
    // 删除tag
    _this.deleteTag = function (index) {
      if (!_this.state.isEdit) {
        return;
      }
      var tags = _this.state.tags;
      tags.splice(index, 1);
      _this.setState({
        tags: tags,
      });
    };
    _this.confirmShow = function () {
      _this.setState(function (preState) {
        return {
          confirmShow: !preState.confirmShow,
        };
      });
    };
    // 后退清空数据
    _this.back = function () {
      _this.props.dispatch({
        type: 'note/changeState',
        payload: {
          timeId: 0,
          tags: [],
          data: '',
          title: '请输入标题',
        },
      });
      umi_1.history.goBack();
    };
    return _this;
  }
  Note.prototype.componentDidMount = function () {
    var _a, _b;
    var timeId =
      (_a = umi_1.history.location.query) === null || _a === void 0
        ? void 0
        : _a.timeId;
    if (!(timeId === 'null')) {
      // 详情查看
      // 在此处model数据更新
      this.props.dispatch({
        type: 'note/getNoteData',
        payload: {
          timeId:
            (_b = umi_1.history.location.query) === null || _b === void 0
              ? void 0
              : _b.timeId,
        },
      });
      this.setState({
        isEdit: false,
      });
    }
    var height = '0px';
    var tags = document.querySelector('.tags');
    if (tags) {
      height = tags.style.height;
    }
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    // 由于dispatch是异步操作，所以此时的props是上一次的props
    this.setState({
      editorState: braft_editor_1['default'].createEditorState(this.props.data),
      tagsH: height,
    });
  };
  Note.prototype.render = function () {
    var _this = this;
    var _a, _b;
    return react_1['default'].createElement(
      'div',
      { className: note_less_1['default'].note },
      react_1['default'].createElement(Confirm_1['default'], {
        id: 'noteRemove',
        txt: '\u786E\u8BA4\u8FDB\u884C\u5220\u9664\u64CD\u4F5C\uFF1F',
        confirm: this.removeNote,
        cancel: this.removeConfirmShow,
        style: {
          display: this.state.removeConfirm ? 'flex' : 'none',
          zIndex: 3,
        },
      }),
      react_1['default'].createElement(Confirm_1['default'], {
        id: 'editGoalMore',
        txt: '\u8BF7\u9009\u62E9\u64CD\u4F5C',
        confirm: this.saveNote,
        confirmStr: '\u4FDD\u5B58',
        cancel: this.removeConfirmShow,
        cancelStr: '\u5220\u9664',
        closeIcon: true,
        close: this.confirmShow,
        style: {
          display: this.state.confirmShow ? 'flex' : 'none',
          zIndex: 2,
        },
      }),
      react_1['default'].createElement(
        'div',
        { className: note_less_1['default'].title },
        react_1['default'].createElement(icons_1.LeftOutlined, {
          onClick: this.back,
        }),
        react_1['default'].createElement('input', {
          type: 'text',
          value: this.props.title,
          readOnly: this.state.isEdit ? false : true,
          onChange: function (e) {
            _this.changeModelState('title', e.target.value);
          },
        }),
        ((_a = umi_1.history.location.query) === null || _a === void 0
          ? void 0
          : _a.timeId) === 'null'
          ? react_1['default'].createElement(icons_1.CheckOutlined, {
              onClick: this.saveNote,
            })
          : this.state.isEdit
          ? react_1['default'].createElement(icons_1.EllipsisOutlined, {
              onClick: this.confirmShow,
            })
          : react_1['default'].createElement(icons_1.HighlightOutlined, {
              onClick: function () {
                return _this.setState({ isEdit: true });
              },
            }),
      ),
      react_1['default'].createElement(
        'div',
        {
          className: note_less_1['default'].tags,
          style: {
            borderBottom: this.state.isEdit ? 'none' : 'solid 1px #eee',
            paddingBottom: this.state.isEdit ? 0 : '5px',
          },
        },
        this.state.tags.length === 0
          ? react_1['default'].createElement(
              'span',
              null,
              '\u6682\u65E0\u6807\u7B7E',
            )
          : this.state.tags.map(function (tag, index) {
              return react_1['default'].createElement(
                'span',
                {
                  key: index,
                  onClick: function () {
                    return _this.deleteTag(index);
                  },
                },
                tag,
              );
            }),
      ),
      react_1['default'].createElement(
        'div',
        {
          className: note_less_1['default'].addTag,
          style: { display: this.state.isEdit ? 'block' : 'none' },
        },
        react_1['default'].createElement('span', null, 'addTag: '),
        react_1['default'].createElement('input', {
          type: 'text',
          value: this.state.newtag,
          onChange: function (e) {
            _this.setState({ newtag: e.target.value });
          },
        }),
        react_1['default'].createElement(icons_1.PlusOutlined, {
          onClick: this.addTag,
        }),
      ),
      react_1['default'].createElement(
        'div',
        {
          className: note_less_1['default'].braftEditor,
          style: {
            height:
              ((_b = umi_1.history.location.query) === null || _b === void 0
                ? void 0
                : _b.timeId) === 'null'
                ? 'calc(100vh - 89px - ' + this.state.tagsH + ')'
                : 'calc(100vh + 30px - ' + this.state.tagsH + ')',
          },
        },
        react_1['default'].createElement(braft_editor_1['default'], {
          value: this.state.editorState,
          readOnly: this.state.isEdit ? false : true,
          controls: this.state.isEdit ? controls : [],
          onChange: this.handleEditorChange,
        }),
      ),
    );
  };
  return Note;
})(react_1['default'].Component);
exports['default'] = dva_1.connect(function (state) {
  return __assign({}, state.note);
})(Note);
