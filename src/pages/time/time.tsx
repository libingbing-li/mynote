import React from 'react';
import {connect} from 'dva';
import {ModelTime, FoodIngredient} from '../../utils/interface';
import {
  FormOutlined,
  HeartOutlined,
  FireOutlined,
  SmileOutlined
} from '@ant-design/icons';
import SlideBox from '@/common-components/SlideBox';
import app from '@/utils/app';
import commonStyle from '@/common-styles/common.less';
import styles from './style/time.less';

const tips = [
  {
    tip: '还有两天>v<~',
    message: '——啊呜啊呜快吃掉!',
  },
  {
    tip: '放一周=v=~',
    message: '——咪咪咪咪咪',
  },
  {
    tip: '可以放很久很久=w=',
    message: '——不要忘记我~',
  },
];

interface IProps {
  edit: (data: FoodIngredient, classId: number) => void;
}

class Time extends React.Component<IProps & ModelTime & {dispatch: any, isBasket: boolean}> {
  state = {
    nowTab: 1, //当前所处的tab页
  }

  componentDidMount = () => {
    // 获得今天的日期
    console.log(this.state);
  }

  // 左滑行为
  slideLeft = (e?: any) => {
    if(this.state.nowTab == 1) {
      return;
    }
    for(let i = 1; i <= 3; i++) {
      const page: any = document.querySelector(`#time-page${i}`);
      let left = Number(page.style.left.substring(0,page.style.left.length - 2));
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
    if(this.state.nowTab == 3) {
      return;
    }
    for(let i = 3; i >= 1; i--) {
      const page: any = document.querySelector(`#time-page${i}`);
      let left = Number(page.style.left.substring(0,page.style.left.length - 2));
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
    if(this.state.nowTab == page) {
      return;
    }
    if(page > this.state.nowTab) {
      // 右滑
      for(let i = this.state.nowTab; i < page ; i++){
        this.slideRight();
      };
    } else {
      // 左滑
      for(let i = this.state.nowTab; i > page ; i--){
        this.slideLeft();
      };
    }
  }

  // 小类别渲染
  renderClassBox = (key: any, value: Array<FoodIngredient>, classId: number) => {
    const changeShow = () => {
      const showBox: any = document.querySelector('#renderClassBoxList'+value[0].time);
      if(showBox.style.display === 'block') {
        showBox.style.display = 'none';
      } else {
        showBox.style.display = 'block';
      }
    }
    return (
      <div className={styles.classBox} key={key}>
        <div 
          className={styles.classBoxTag}
          onClick={changeShow}
        >{key} {value.length}</div>
        <div 
          id={"renderClassBoxList"+value[0].time}
          style={{
            display: 'block'
          }}
        >
          {value.map((item: FoodIngredient) => {
            return this.renderItemBox(item, classId);
          })}
        </div>
      </div>
    );
  }
  // 项目渲染
  renderItemBox = (item: FoodIngredient, classId: number) => {
    return (
      <div 
        key={item.time}
        onClick={(e: any) => this.classClick(e, item, classId)}
      >
        <div className={styles.itemBox}>
        <div className={styles.itemCover} id={"time-item-cover"+item.time}>_(•̀ω•́ 」∠)_ -1!</div>
        <FormOutlined className={styles.itemBoxEdit} onClick={() => this.props.edit(item, classId)}/>
        <div className={styles.itemBoxName}>{item.name}</div>
        <div className={styles.itemBoxMain}>
          <div>个数: {item.num}</div>
          <div>重量: {app.getTowPointNum(Number(item.weight))}</div>
          <div>——{item.note ? item.note : '=w=~'}</div>
        </div>
      </div>
      </div>
    );
  }

  // 双击 300ms之内算双击
  count = 0;
  classClick = (e: any, item: FoodIngredient, classId:number) => {
    this.count ++;
    const clickTime = setTimeout(() => {
      if(this.count === 1) {
        this.addBasket(e, item, classId);
        // 单机
        this.count = 0;
      } else if(this.count === 2) {
        this.itemNumReduceOne(item, classId)
        this.count = 0;
      }
    }, 300);
  }

  addBasket = (e: any, item: FoodIngredient, classId?:number) => {
    if(!this.props.isBasket || item.num === 0) {
      return;
    }
    // 小球落入购物篮的动画
    // const div = document.createElement('div');
    // div.className = styles.basketBall;
    // document.body.appendChild(div);
    // console.log(e)

    // 数据 - localStorage
    this.props.dispatch({
      type: 'basket/add',
      payload: {
        item,
      }
    });
  }

  // 项目-右滑减一
  itemNumReduceOne = (item: FoodIngredient, classId: number) => {
    if(item.num === 0){
      this.props.dispatch({
        type: 'index/changeState',
        payload: {
          time: item.time,
        },
      });
      this.props.dispatch({
        type: 'index/changeState',
        payload: {
          num: item.num,
        },
      });
      this.props.dispatch({
        type: 'index/changeState',
        payload: {
          name: item.name,
        },
      });
      this.props.dispatch({
        type: 'index/changeState',
        payload: {
          classId: classId,
        },
      });
      this.props.dispatch({
        type: 'index/remove'
      });
      return;
    }

    // 动画
    if(!this.props.isBasket){
      const cover: any = document.querySelector(`#time-item-cover${item.time}`);
      cover.style.top = '0px';
      setTimeout(() => {
        cover.style.top = '-70px'
      }, 600);
    }

    // 数据
    this.changeValue('classIdTime', item.classId);
    this.changeValue('timeTime', item.time);
    this.props.dispatch({
      type: 'time/itemNumReduce',
    });
  }
  // 改变
  changeValue = (proName: string, data: any) => {
    this.props.dispatch({
      type: 'time/changeState',
      payload: {
        [proName]: data,
      },
    });
  }

  render() {
    return (
      <div className={`${commonStyle.page} ${styles.time}`}>
        {/* 导航 */}
        <div className={commonStyle.navbarChild}>
          <div 
            onClick={() => this.checkTab(1)}
            style={{
              borderBottom: this.state.nowTab == 1 ? '3px solid #000' : 'none'
            }}
          >临期</div>
          <div
            onClick={() => this.checkTab(2)}
            style={{
              borderBottom: this.state.nowTab == 2 ? '3px solid #000' : 'none'
            }}
          >周内</div>
          <div
            onClick={() => this.checkTab(3)}
            style={{
              borderBottom: this.state.nowTab == 3 ? '3px solid #000' : 'none'
            }}
          >长期</div>
        </div>
        {/* 具体页面 */}
        <div className={styles.pageBox} >
        <SlideBox
          id="time"
          slideDistance={150}
          // slideLeft={this.slideLeft}
          // slideRight={this.slideRight}
        >
          <div id="time-page1" className={styles.page } style={{left: `${-(this.state.nowTab*100-100)}vw`}}>
            <div className={commonStyle.tipBox}>
              <div className={commonStyle.tip}>{tips[0].tip}</div>
              <div className={commonStyle.message}>{tips[0].message}</div>
            </div>
            <div 
              className={styles.className}
              style={{
                display: [...this.props.foodIngredientNowList].length === 0 ? 'none' : 'block' 
              }}
            ><HeartOutlined style={{marginRight: '10px'}}/>食材</div>
            {[...this.props.foodIngredientNowList].map((item: any) => {
              return (
              <div key={'now' + item[1][0].time}>
                {this.renderClassBox(item[0], item[1], 1)}
              </div>
              );
            })}
            <div 
              className={styles.className}
              style={{
                display: [...this.props.flavoringNowList].length === 0 ? 'none' : 'block' 
              }}
            ><FireOutlined  style={{marginRight: '10px'}}/>调味</div>
            {[...this.props.flavoringNowList].map((item: any) => {
              return (
              <div key={'now' + item[1][0].time}> 
                {this.renderClassBox(item[0], item[1], 2)}
              </div>
              );
            })}
            <div 
              className={styles.className}
              style={{
                display: [...this.props.convenientFoodNowList].length === 0 ? 'none' : 'block' 
              }}
            ><SmileOutlined  style={{marginRight: '10px'}}/>方便</div>
            {[...this.props.convenientFoodNowList].map((item: any) => {
              return (
              <div key={'now' + item[1][0].time}>
                {this.renderClassBox(item[0], item[1], 3)}
              </div>
              );
            })}
          </div>
          <div id="time-page2" className={styles.page} style={{left: `${-(this.state.nowTab*100-200)}vw`}}>
            <div className={commonStyle.tipBox}>
              <div className={commonStyle.tip}>{tips[1].tip}</div>
              <div className={commonStyle.message}>{tips[1].message}</div>
            </div>
            <div 
              className={styles.className}
              style={{
                display: [...this.props.foodIngredientWeekList].length === 0 ? 'none' : 'block' 
              }}
            ><HeartOutlined style={{marginRight: '10px'}}/>食材</div>
            {[...this.props.foodIngredientWeekList].map((item: any) => {
              return (
              <div key={'week' + item[1][0].time}>
                {this.renderClassBox(item[0], item[1], 1)}
              </div>
              );
            })}
            <div 
              className={styles.className}
              style={{
                display: [...this.props.flavoringWeekList].length === 0 ? 'none' : 'block' 
              }}
            ><FireOutlined  style={{marginRight: '10px'}}/>调味</div>
            {[...this.props.flavoringWeekList].map((item: any) => {
              return (
              <div key={'week' + item[1][0].time}> 
                {this.renderClassBox(item[0], item[1], 2)}
              </div>
              );
            })}
            <div 
              className={styles.className}
              style={{
                display: [...this.props.convenientFoodWeekList].length === 0 ? 'none' : 'block' 
              }}
            ><SmileOutlined  style={{marginRight: '10px'}}/>方便</div>
            {[...this.props.convenientFoodWeekList].map((item: any) => {
              return (
              <div key={'week' + item[1][0].time}>
                {this.renderClassBox(item[0], item[1], 3)}
              </div>
              );
            })}
          </div>
          <div id="time-page3" className={styles.page} style={{left: `${-(this.state.nowTab*100-300)}vw`}}>
            <div className={commonStyle.tipBox}>
              <div className={commonStyle.tip}>{tips[2].tip}</div>
              <div className={commonStyle.message}>{tips[2].message}</div>
            </div>
            <div 
              className={styles.className}
              style={{
                display: [...this.props.foodIngredientLongList].length === 0 ? 'none' : 'block' 
              }}
            ><HeartOutlined style={{marginRight: '10px'}}/>食材</div>
            {[...this.props.foodIngredientLongList].map((item: any) => {
              return (
              <div key={'long' + item[1][0].time}>
                {this.renderClassBox(item[0], item[1], 1)}
              </div>
              );
            })}
            <div 
              className={styles.className}
              style={{
                display: [...this.props.flavoringLongList].length === 0 ? 'none' : 'block' 
              }}
            ><FireOutlined  style={{marginRight: '10px'}}/>调味</div>
            {[...this.props.flavoringLongList].map((item: any) => {
              return (
              <div key={'long' + item[1][0].time}>
                {this.renderClassBox(item[0], item[1], 2)}
              </div>
              );
            })}

            <div 
              className={styles.className}
              style={{
                display: [...this.props.convenientFoodLongList].length === 0 ? 'none' : 'block' 
              }}
            ><SmileOutlined  style={{marginRight: '10px'}}/>方便</div>
            {[...this.props.convenientFoodLongList].map((item: any) => {
              return (
              <div key={'long' + item[1][0].time}>
                {this.renderClassBox(item[0], item[1], 3)}
              </div>
              );
            })}
          </div>
          </SlideBox>
        </div>
      </div>
    );
  }
}

export default connect((state: any) => ({...state.time, isBasket: state.index.isBasket}))(Time);