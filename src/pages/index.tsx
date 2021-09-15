import React from 'react';
import moment from 'moment';
import { history } from 'umi';
import { connect, EffectsCommandMap, Model } from 'dva';
import {
  UnorderedListOutlined,
  HighlightOutlined,
  HighlightFilled,
} from '@ant-design/icons';
import SlideBox from '@/common-components/SlideBox';
import TopBox from './modal/topBox';
import Sidebar from './modal/sidebar';
import Show from './show/show';
import Tags from './tags/tags';
import { ModelIndex } from '../utils/interface';
import indexedDB from '../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import styles from './index.less';
import '@/common-styles/components.css';
import app from '@/utils/app';

interface IState {
  nowPage: number; //当前处于哪个页面
}

class Index extends React.Component<ModelIndex & { dispatch: any }> {
  state: IState = {
    nowPage: this.props.nowPage,
  };

  componentDidMount = () => {
    moment.locale('zh-cn');
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
  refresh = (e: any) => {
    // 刷新
    const refreshBox: any = document.querySelector(`#refreshBox`);
    const page: any = document.querySelector(
      `#index-page${this.state.nowPage}`,
    );
    const navbar: any = document.querySelector(`#navbar`);
    refreshBox.style.top = '0vh';
    navbar.style.marginTop = '15vh';
    if (this.state.nowPage === 1) {
      this.props.dispatch({
        type: 'show/init',
      });
    } else {
      // this.props.dispatch({
      //   type: 'satisfy/init',
      // });
    }
    setTimeout(() => {
      refreshBox.style.top = '-15vh';
      navbar.style.marginTop = '0vh';
    }, 1000);
  };
  // 左滑行为
  slideLeft = () => {
    console.log('slideLeft');
    if (this.state.nowPage == 1) {
      return;
    }
    for (let i = 1; i <= 2; i++) {
      const page: any = document.querySelector(`#index-page${i}`);
      let left = Number(
        page.style.left.substring(0, page.style.left.length - 2),
      );
      page.style.left = left + 100 + 'vw';
    }
    this.setState((state: any) => {
      if (state.nowPage - 1 === 2) {
        this.props.dispatch({
          type: 'info/init',
        });
      } else if (state.nowPage - 1 === 1) {
        this.props.dispatch({
          type: 'time/init',
        });
      } else {
        this.props.dispatch({
          type: 'now/init',
        });
      }
      this.props.dispatch({
        type: 'index/changeState',
        payload: {
          nowPage: state.nowPage - 1,
        },
      });
      return {
        nowPage: state.nowPage - 1,
      };
    });
    this.sidebarClose();
  };
  // 右滑行为
  slideRight = () => {
    console.log('slideRight');
    if (this.state.nowPage == 2) {
      return;
    }
    for (let i = 2; i >= 1; i--) {
      const page: any = document.querySelector(`#index-page${i}`);
      let left = Number(
        page.style.left.substring(0, page.style.left.length - 2),
      );
      page.style.left = left - 100 + 'vw';
    }
    this.setState((state: any) => {
      if (state.nowPage + 1 === 2) {
        this.props.dispatch({
          type: 'info/init',
        });
      } else if (state.nowPage + 1 === 1) {
        this.props.dispatch({
          type: 'time/init',
        });
      } else {
        this.props.dispatch({
          type: 'now/init',
        });
      }
      this.props.dispatch({
        type: 'index/changeState',
        payload: {
          nowPage: state.nowPage + 1,
        },
      });
      return {
        nowPage: state.nowPage + 1,
      };
    });
    this.sidebarClose();
  };

  // 点击切换
  checkTab = () => {
    let page = 1;
    if (this.state.nowPage === 1) {
      page = 2;
    }
    if (page > this.state.nowPage) {
      // 右滑
      for (let i = this.state.nowPage; i < page; i++) {
        this.slideRight();
      }
    } else {
      // 左滑
      for (let i = this.state.nowPage; i > page; i--) {
        this.slideLeft();
      }
    }
  };

  // 侧边栏
  sidebarShow = () => {
    console.log('sidebarShow');
    const sidebar: any = document.querySelector(`#sidebar`);
    const page: any = document.querySelector(
      `#index-page${this.state.nowPage}`,
    );
    const navbar: any = document.querySelector(`#navbar`);
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
  sidebarClose = () => {
    console.log('sidebarClose');
    const sidebar: any = document.querySelector(`#sidebar`);
    const page: any = document.querySelector(
      `#index-page${this.state.nowPage}`,
    );
    const navbar: any = document.querySelector(`#navbar`);
    sidebar.style.left = '-200px';
    page.style.left = '0vh';
    navbar.style.left = '0vh';
  };

  // 点击页面
  pageClick = () => {
    console.log('pageClick');
    // 当侧边栏存在，点击关闭
    const sidebar: any = document.querySelector(`#sidebar`);
    if (sidebar.style.left !== '-200px') {
      this.sidebarClose();
    }
  };

  // 进入添加日记
  addNote = () => {
    console.log('addNote');
    history.push('/note?timeId=null');
  };

  render() {
    return (
      <div id={styles.index}>
        {/* 刷新层 */}
        <TopBox></TopBox>
        {/* 侧边栏 */}
        <Sidebar
          style={{
            left: '-200px',
          }}
        ></Sidebar>
        {/* 新建日记 */}
        {/* 顶栏 */}
        <div
          id="navbar"
          className={commonStyle.navbar}
          style={{
            left: '0px',
          }}
        >
          <UnorderedListOutlined onClick={this.sidebarShow} />
          {/* <span>MyNote</span> */}
          <span onClick={this.refresh}>
            {this.state.nowPage === 1 ? 'MyNote' : 'Tags'}
          </span>
          <HighlightOutlined onClick={this.addNote} />
        </div>
        {/* page */}
        <div
          className={styles.pageBox}
          id="index-page"
          onClick={this.pageClick}
        >
          <SlideBox
            id="index"
            slideDistance={170}
            slideLeft={this.slideLeft}
            slideRight={this.slideRight}
            // slideBottom={this.slideBottom}
          >
            <div
              id="index-page1"
              className={styles.page}
              style={{ left: `${-(this.state.nowPage * 100 - 100)}vw` }}
            >
              <Show></Show>
            </div>
            <div
              id="index-page2"
              className={styles.page}
              style={{ left: `${-(this.state.nowPage * 100 - 200)}vw` }}
            >
              <Tags></Tags>
            </div>
          </SlideBox>
        </div>
        {/* 底栏 */}
        {/* <div 
					className={styles.tabBar}
					style={{
						filter: this.state.isFilter ? 'blur(3px)' : 'blur(0px)'
					}}  
				>
					<div onClick={() => this.checkTab(1)}>
						{this.state.nowPage == 1 ? <CarryOutFilled /> : <CarryOutOutlined />}
					</div>
					<div onClick={() => this.checkTab(2)}>
						{this.state.nowPage == 2 ? <HomeFilled /> : <HomeOutlined />}
					</div>
				</div> */}
      </div>
    );
  }
}

export default connect((state: any) => ({
  ...state.index,
}))(Index);
