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
var moment_1 = require('moment');
var umi_1 = require('umi');
var dva_1 = require('dva');
var icons_1 = require('@ant-design/icons');
var SlideBox_1 = require('@/common-components/SlideBox');
var topBox_1 = require('./modal/topBox');
var sidebar_1 = require('./modal/sidebar');
var show_1 = require('./show/show');
var tags_1 = require('./tags/tags');
var common_less_1 = require('@/common-styles/common.less');
var index_less_1 = require('./index.less');
require('@/common-styles/components.css');
var Index = /** @class */ (function (_super) {
  __extends(Index, _super);
  function Index() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.state = {
      nowPage: _this.props.nowPage,
    };
    _this.componentDidMount = function () {
      moment_1['default'].locale('zh-cn');
    };
    //在本处获取新的props并更新
    // componentWillReceiveProps = (nextProps: any) => {
    //   console.log(123)
    //   this.setState({
    //     nowPage: nextProps.nowPage,
    //   });
    //   console.log(nextProps)
    // };
    // 下拉行为 - 刷新
    _this.refresh = function (e) {
      // 刷新
      var refreshBox = document.querySelector('#refreshBox');
      var page = document.querySelector('#index-page' + _this.state.nowPage);
      var navbar = document.querySelector('#navbar');
      refreshBox.style.top = '0vh';
      navbar.style.marginTop = '15vh';
      if (_this.state.nowPage === 1) {
        _this.props.dispatch({
          type: 'show/init',
        });
      } else {
        // this.props.dispatch({
        //   type: 'satisfy/init',
        // });
      }
      setTimeout(function () {
        refreshBox.style.top = '-15vh';
        navbar.style.marginTop = '0vh';
      }, 1000);
    };
    // 左滑行为
    _this.slideLeft = function () {
      console.log('slideLeft');
      if (_this.state.nowPage == 1) {
        return;
      }
      for (var i = 1; i <= 2; i++) {
        var page = document.querySelector('#index-page' + i);
        var left = Number(
          page.style.left.substring(0, page.style.left.length - 2),
        );
        page.style.left = left + 100 + 'vw';
      }
      _this.setState(function (state) {
        if (state.nowPage - 1 === 2) {
          _this.props.dispatch({
            type: 'info/init',
          });
        } else if (state.nowPage - 1 === 1) {
          _this.props.dispatch({
            type: 'time/init',
          });
        } else {
          _this.props.dispatch({
            type: 'now/init',
          });
        }
        _this.props.dispatch({
          type: 'index/changeState',
          payload: {
            nowPage: state.nowPage - 1,
          },
        });
        return {
          nowPage: state.nowPage - 1,
        };
      });
      _this.sidebarClose();
    };
    // 右滑行为
    _this.slideRight = function () {
      console.log('slideRight');
      if (_this.state.nowPage == 2) {
        return;
      }
      for (var i = 2; i >= 1; i--) {
        var page = document.querySelector('#index-page' + i);
        var left = Number(
          page.style.left.substring(0, page.style.left.length - 2),
        );
        page.style.left = left - 100 + 'vw';
      }
      _this.setState(function (state) {
        if (state.nowPage + 1 === 2) {
          _this.props.dispatch({
            type: 'info/init',
          });
        } else if (state.nowPage + 1 === 1) {
          _this.props.dispatch({
            type: 'time/init',
          });
        } else {
          _this.props.dispatch({
            type: 'now/init',
          });
        }
        _this.props.dispatch({
          type: 'index/changeState',
          payload: {
            nowPage: state.nowPage + 1,
          },
        });
        return {
          nowPage: state.nowPage + 1,
        };
      });
      _this.sidebarClose();
    };
    // 点击切换
    _this.checkTab = function () {
      var page = 1;
      if (_this.state.nowPage === 1) {
        page = 2;
      }
      if (page > _this.state.nowPage) {
        // 右滑
        for (var i = _this.state.nowPage; i < page; i++) {
          _this.slideRight();
        }
      } else {
        // 左滑
        for (var i = _this.state.nowPage; i > page; i--) {
          _this.slideLeft();
        }
      }
    };
    // 侧边栏
    _this.sidebarShow = function () {
      console.log('sidebarShow');
      var sidebar = document.querySelector('#sidebar');
      var page = document.querySelector('#index-page' + _this.state.nowPage);
      var navbar = document.querySelector('#navbar');
      if (sidebar.style.left === '-200px') {
        sidebar.style.left = '0';
        page.style.left = '200px';
        navbar.style.left = '200px';
      } else {
        sidebar.style.left = '-200px';
        page.style.left = '0vh';
        navbar.style.left = '0vh';
      }
    };
    // 关闭侧边栏
    _this.sidebarClose = function () {
      console.log('sidebarClose');
      var sidebar = document.querySelector('#sidebar');
      var page = document.querySelector('#index-page' + _this.state.nowPage);
      var navbar = document.querySelector('#navbar');
      sidebar.style.left = '-200px';
      page.style.left = '0vh';
      navbar.style.left = '0vh';
    };
    // 点击页面
    _this.pageClick = function () {
      console.log('pageClick');
      // 当侧边栏存在，点击关闭
      var sidebar = document.querySelector('#sidebar');
      if (sidebar.style.left !== '-200px') {
        _this.sidebarClose();
      }
    };
    // 进入添加日记
    _this.addNote = function () {
      console.log('addNote');
      umi_1.history.push('/note?timeId=null');
    };
    return _this;
  }
  Index.prototype.render = function () {
    return react_1['default'].createElement(
      'div',
      { id: index_less_1['default'].index },
      react_1['default'].createElement(topBox_1['default'], null),
      react_1['default'].createElement(sidebar_1['default'], {
        style: {
          left: '-200px',
        },
      }),
      react_1['default'].createElement(
        'div',
        {
          id: 'navbar',
          className: common_less_1['default'].navbar,
          style: {
            left: '0px',
          },
        },
        react_1['default'].createElement(icons_1.UnorderedListOutlined, {
          onClick: this.sidebarShow,
        }),
        react_1['default'].createElement(
          'span',
          { onClick: this.refresh },
          this.state.nowPage === 1 ? 'MyNote' : 'Tags',
        ),
        react_1['default'].createElement(icons_1.HighlightOutlined, {
          onClick: this.addNote,
        }),
      ),
      react_1['default'].createElement(
        'div',
        {
          className: index_less_1['default'].pageBox,
          id: 'index-page',
          onClick: this.pageClick,
        },
        react_1['default'].createElement(
          SlideBox_1['default'],
          {
            id: 'index',
            slideDistance: 170,
            slideLeft: this.slideLeft,
            slideRight: this.slideRight,
          },
          react_1['default'].createElement(
            'div',
            {
              id: 'index-page1',
              className: index_less_1['default'].page,
              style: { left: -(this.state.nowPage * 100 - 100) + 'vw' },
            },
            react_1['default'].createElement(show_1['default'], null),
          ),
          react_1['default'].createElement(
            'div',
            {
              id: 'index-page2',
              className: index_less_1['default'].page,
              style: { left: -(this.state.nowPage * 100 - 200) + 'vw' },
            },
            react_1['default'].createElement(tags_1['default'], null),
          ),
        ),
      ),
    );
  };
  return Index;
})(react_1['default'].Component);
exports['default'] = dva_1.connect(function (state) {
  return __assign({}, state.index);
})(Index);
