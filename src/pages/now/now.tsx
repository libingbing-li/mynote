import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { ModelNow, RecordItem, Item, RecordNote } from '../../utils/interface';
import {
  BellOutlined,
  StarFilled,
  WomanOutlined,
  HeartOutlined,
  SmileOutlined,
  StarOutlined
} from '@ant-design/icons';
import SlideBox from '@/common-components/SlideBox';
import { SurpriseItem, SurpriseDate, TaskItem } from '../../utils/interface';
import commonStyle from '@/common-styles/common.less';
import styles from './style/now.less';

const tips = [
  {
    tip: '目标',
    message: '——每一次都是最棒的!',
  },
  {
    tip: '记录',
    message: '——点点滴滴=v=',
  },
  {
    tip: '特殊',
    message: '——是特殊惊喜!',
  },
];

interface IProps {
  setShow: () => void;
  edit: () => void;
}

class Now extends React.Component<IProps & ModelNow & { dispatch: any }> {
  state = {
    nowTab: 2, //当前所处的tab页
  }

  componentDidMount = () => {
    this.props.dispatch({
      type: 'now/openDB'
    });
  }

  // 左滑行为
  slideLeft = (e?: any) => {
    if (this.state.nowTab == 1) {
      return;
    }
    for (let i = 1; i <= 3; i++) {
      const page: any = document.querySelector(`#now-page${i}`);
      let left = Number(page.style.left.substring(0, page.style.left.length - 2));
      page.style.left = left + 100 + 'vw';
    }
    this.setState((state: any) => {
      return {
        nowTab: state.nowTab - 1,
      };
    });
    e?.stopPropagation();
  }
  // 右滑行为
  slideRight = (e?: any) => {
    if (this.state.nowTab == 3) {
      return;
    }
    for (let i = 3; i >= 1; i--) {
      const page: any = document.querySelector(`#now-page${i}`);
      let left = Number(page.style.left.substring(0, page.style.left.length - 2));
      page.style.left = left - 100 + 'vw';
    }
    this.setState((state: any) => {
      return {
        nowTab: state.nowTab + 1,
      };
    });
    e?.stopPropagation();
  }

  // 点击切换
  checkTab = (page: number) => {
    if (this.state.nowTab == page) {
      return;
    }
    if (page > this.state.nowTab) {
      // 右滑
      for (let i = this.state.nowTab; i < page; i++) {
        this.slideRight();
      };
    } else {
      // 左滑
      for (let i = this.state.nowTab; i > page; i--) {
        this.slideLeft();
      };
    }
  }

  // 方法
  // 编辑recordnote
  editNote = (item: RecordNote) => {
    this.changeValue('nowTime', item.time);
    this.changeValue('nowNote', item.noteStr);
    this.props.edit();
    this.props.dispatch({
      type: 'index/changeState',
      payload: {
        'noteModalStr': 'nowEditNote'
      }
    });
  }

  // 编辑surprise
  editSurprise = (item: SurpriseItem) => {
    this.changeValue('nowTime', item.time);
    this.changeValue('nowNote', item.name);
    this.changeValue('nowItemClassId', item.classId);
    this.changeValue('nowClassId', 3);
    this.changeValue('nowDate', item);
    this.props.edit();
    this.props.dispatch({
      type: 'index/changeState',
      payload: {
        'noteModalStr': 'nowEditNote'
      }
    });
  }
  // 编辑task
  editTask = (item: TaskItem) => {
    this.changeValue('nowTime', item.time);
    this.changeValue('nowNote', item.name);
    this.changeValue('nowItemClassId', item.classId);
    this.changeValue('nowClassId', 2);
    this.changeValue('nowDate', item);
    this.props.edit();
    this.props.dispatch({
      type: 'index/changeState',
      payload: {
        'noteModalStr': 'nowEditNote'
      }
    });
  }

  // dispatch
  changeValue = (proName: string, data: any): void => {
    this.props.dispatch({
      type: 'now/changeState',
      payload: {
        [proName]: data,
      },
    });
  }

  // 渲染
  renderItemBox = (item: any, index: number) => {
    if (item.timeStr) {
      return this.renderTime(item, index);
    } else if (item.noteStr) {
      return this.renderNote(item, index);
    } else {
      return this.renderItem(item, index);
    }
  }

  // 渲染时间分割线
  renderTime = (item: any, index: number) => {
    return (
      <div
        key={index}
        className={`${styles.itemTimeBox}`}
      >
        {` · ${item.timeStr} · `}
      </div>
    );
  }

  // 渲染笔记
  renderNote = (item: RecordNote, index: number) => {
    return (
      <div
        key={index}
        className={`${styles.itemNoteBox}`}
        onClick={() => this.editNote(item)}
      >
        {item.noteStr}
        <div className={styles.itemNote}>——记录生活w</div>
      </div>
    );
  }

  // 已完成的白色,未完成的黑色
  renderItem = (itemBox: RecordItem, index: number) => {
    const getNote = (clazz: number) => {
      let str = '——要买好吃的东西>w<!';
      switch (clazz) {
        case 2: str = '——早饭是一天的动力w'; break;
        case 3: str = '——午饭补充动力!'; break;
        case 4: str = '——晚餐开开心心~'; break;
        default: str = '——=w=~';
      }
      return str;
    }
    if (itemBox.list.length === 0) return;
    const getItemStr = () => {
      let str = '';
      itemBox.list.forEach((item: Item) => {
        str = str + item.name + ', ';
      });
      str = str.slice(0, str.length - 2);
      return str;
    }
    return (
      <div
        key={index}
        className={!itemBox.isCheck ? `${styles.itemNoteBox} ${styles.itemBoxInverse}` : `${styles.itemNoteBox}`}
        onClick={(e: any) => this.classClick(e, itemBox)}
      >
        {getItemStr()}
        <div className={styles.itemNote}>{getNote(itemBox.clazz)}</div>
      </div>
    );
  }

  // 渲染特殊
  renderSurprise = (item: SurpriseItem) => {
    const getAvatar = (clazz: number) => {
      let avatar = <WomanOutlined />; //生理期
      switch (clazz) {
        case 1: avatar = <HeartOutlined />; break; //家庭
        case 2: avatar = <SmileOutlined />; break; //生活
        case 3: avatar = <StarOutlined />; break; //爱好
      }
      return avatar;
    }
    const getNote = (clazz: number) => {
      let str = '——生理期要好好保护自己~';
      switch (clazz) {
        case 1: str = '——最喜欢家人了~'; break;
        case 2: str = '——努力加油加油w'; break;
        case 3: str = '——成就感upup!'; break;
      }
      return str;
    }
    const getDate = (item: SurpriseDate) => {
      const first = moment(item.firstDate).format('YYYY.M.D');
      const end = moment(item.endDate).format('YYYY.M.D');
      return end === first ? first : first + ' - ' + end;
    }
    return (
      <div
        key={item.time}
        className={styles.surpriseBox}
        onClick={() => this.editSurprise(item)}
        style={{
          color: item.isOnGoing ? '#fff' : '#000',
          background: item.isOnGoing ? '#000' : '#fff',
        }}
      >
        <div className={styles.surpriseMainBox}>
          <div
            className={styles.surpriseBoxAvatar}
            onClick={(e: any) => this.enterSurpriseOnGoing(e, item)}
          >
            {getAvatar(item.classId)}
            <div>
              {item.name}
            </div>
          </div>
          <div className={styles.surpriseBoxRecord}>
            {item.dateList.length === 0 ?
              '暂无日期记录' : (
                item.isOnGoing ? (
                  item.dateList.length === 1 ?
                    '暂无日期记录' :
                    getDate(item.dateList[item.dateList.length - 2])
                ) :
                  getDate(item.dateList[item.dateList.length - 1])
              )}
            <div className={styles.itemNote}>{getNote(item.classId)}</div>
          </div>
        </div>
      </div>
    );
  }

  // 渲染任务
  renderTask = (item: TaskItem) => {
    const getAvatar = (clazz: number) => {
      let avatar = <div></div>; //生理期
      switch (clazz) {
        case 1: avatar = <HeartOutlined />; break; //家庭
        case 2: avatar = <SmileOutlined />; break; //生活
        case 3: avatar = <StarOutlined />; break; //爱好
      }
      return avatar;
    }
    return (
      <div
        key={item.time}
        className={styles.taskItemBox}
        onClick={() => this.editTask(item)}
      >
        <div className={styles.itemCover} id={"now-task-cover" + item.time}>{getAvatar(item.classId)} +1!</div>
        <div className={styles.taskBoxAvatar}>
          {getAvatar(item.classId)}
          <div>
            {item.name}
          </div>
        </div>
        <div
          className={styles.taskBoxNum}
          onClick={(e: any) => this.addTaskNum(e, item)}
        >
          {item.num}
        </div>
      </div>
    );
  }

  // 双击类 300ms之内算双击
  count = 0;
  classClick = (e: any, item: RecordItem) => {
    if (item.isCheck) {
      this.count = 0;
      return;
    }
    this.count++;
    const clickTime = setTimeout(() => {
      if (this.count === 1) {
        // 单击编辑 已完成的无法编辑
        // 打开购物栏编辑
        this.props.dispatch({
          type: 'index/changeState',
          payload: {
            isBasket: true,
          }
        });
        this.props.dispatch({
          type: 'basket/changeState',
          payload: {
            nowBasket: item.clazz,
          }
        });
        const basket: any = document.querySelector(`#basket`);
        basket.style.right = '0vw';
        this.count = 0;
      } else if (this.count === 2) {
        console.log(item);
        this.props.dispatch({
          type: 'now/checkItemBox',
          payload: {
            itemBox: item,
          }
        });
        this.count = 0;
      }
    }, 300);
  }

  // 双击类 300ms之内算双击
  countSurprise = 0;
  enterSurpriseOnGoing = (e: any, item: SurpriseItem) => {
    this.countSurprise++;
    const clickTime = setTimeout(() => {
      if (this.countSurprise === 1) {
        // 单击编辑 已完成的无法编辑
        // this.countSurprise = 0;
      } else if (this.countSurprise === 2) {
        this.props.dispatch({
          type: 'now/enterSurpriseOnGoing',
          payload: {
            surprise: item,
          }
        });
        this.countSurprise = 0;
      }
    }, 300);
    e.stopPropagation();
  }

  // 双击类 300ms之内算双击
  countTask = 0;
  addTaskNum = (e: any, item: TaskItem) => {
    this.countTask++;
    const clickTime = setTimeout(() => {
      if (this.countTask === 1) {
        // // 单击编辑 已完成的无法编辑
        // this.countTask = 0;
      } else if (this.countTask === 2) {
        // 动画
        const cover: any = document.querySelector(`#now-task-cover${item.time}`);
        cover.style.top = '0px';
        setTimeout(() => {
          cover.style.top = '-80px'
        }, 600);

        this.props.dispatch({
          type: 'now/addTaskNum',
          payload: {
            task: item,
          }
        });
        this.countTask = 0;
      }
    }, 300);
    e.stopPropagation()
  }

  render() {
    return (
      <div id="now" className={`${commonStyle.page} ${styles.now}`}>
        {/* 导航 */}
        <div className={commonStyle.navbarChild}>
          <div
            onClick={() => this.checkTab(1)}
            style={{
              borderBottom: this.state.nowTab == 1 ? '3px solid #000' : 'none'
            }}
          >目标</div>
          <div
            onClick={() => this.checkTab(2)}
            style={{
              borderBottom: this.state.nowTab == 2 ? '3px solid #000' : 'none'
            }}
          >记录</div>
          <div
            onClick={() => this.checkTab(3)}
            style={{
              borderBottom: this.state.nowTab == 3 ? '3px solid #000' : 'none'
            }}
          >特殊</div>
        </div>
        {/* 具体页面 */}
        <div className={styles.pageBox}>
          {/* item */}
          <SlideBox
            id="now"
            slideDistance={150}
          // slideLeft={this.slideLeft}
          // slideRight={this.slideRight}
          >
            <div id="now-page1" className={styles.page} style={{ left: `${-(this.state.nowTab * 100 - 100)}vw` }}>
              <div className={commonStyle.tipBox}>
                <div className={commonStyle.tip}>{tips[0].tip}</div>
                <div className={commonStyle.message}>{tips[0].message}</div>
              </div>
              <div className={styles.taskBox}>
                {this.props.taskList.map((item: TaskItem) => {
                  return this.renderTask(item);
                })}
              </div>
            </div>
            <div id="now-page2" className={styles.page} style={{ left: `${-(this.state.nowTab * 100 - 200)}vw` }}>
              <div className={commonStyle.tipBox}>
                <div className={commonStyle.tip}>{tips[1].tip}</div>
                <div className={commonStyle.message}>{tips[1].message}</div>
              </div>
              {this.props.recordList.map((item, index) => {
                return this.renderItemBox(item, index);
              })}
            </div>
            <div id="now-page3" className={styles.page} style={{ left: `${-(this.state.nowTab * 100 - 300)}vw` }}>
              <div className={commonStyle.tipBox}>
                <div className={commonStyle.tip}>{tips[2].tip}</div>
                <div className={commonStyle.message}>{tips[2].message}</div>
              </div>
              {/* {
                    classId: 0,
                    name: '生理期',
                    timeId: 0,
                    isOnGoing: false,
                    dateList: [],
                  }, */}
              {this.props.surpriseList.map((item: SurpriseItem) => {
                return this.renderSurprise(item);
              })}
            </div>
          </SlideBox>
        </div>
      </div>
    );
  }
}

export default connect((state: any) => ({ ...state.now }))(Now);