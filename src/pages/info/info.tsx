import React from 'react';
import {connect} from 'dva';
import SlideBox from '@/common-components/SlideBox';
import { FoodIngredientClass, ModelInfo } from '../../utils/interface';
import {
  FileAddOutlined,
} from '@ant-design/icons';

import commonStyle from '@/common-styles/common.less';
import styles from './style/info.less';
import app from '@/utils/app';

const tips = [
  {
    tip: '省钱绝招!',
    message: '——泥土的芬芳0v0',
  },
  {
    tip: '白水煮菜也可',
    message: '——仿佛天天吃火锅~',
  },
  {
    tip: '偶尔享受!',
    message: '——虽然也要自己动手~',
  },
];


interface IProps {
  toPushNote: any;
}
interface IState {
  nowTab: number;
}
class Info extends React.Component<IProps & ModelInfo & {isBasket: boolean;dispatch: any}> {
  state: IState = {
    nowTab: 1, //当前所处的tab页
  }

  componentDidMount = () => {
  }

  // 左滑行为
  slideLeft = (e?: any) => {
    if(this.state.nowTab == 1) {
      return;
    }
    for(let i = 1; i <= 3; i++) {
      const page: any = document.querySelector(`#info-page${i}`);
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
      const page: any = document.querySelector(`#info-page${i}`);
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

  // 双击类 300ms之内算双击
  count = 0;
  classClick = (e: any, item: FoodIngredientClass) => {
    this.count ++;
    const clickTime = setTimeout(() => {
      if(this.count === 1) {
        // 单机
        this.count = 0;
      } else if(this.count === 2) {
        this.addBasket(e, item);
        this.count = 0;
      }
    }, 300);
  }

  addBasket = (e: any, item: FoodIngredientClass) => {
    if(!this.props.isBasket) {
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

  // 渲染类
  renderCardFoodIngredient = (item: any) => {
    const changeShow = () => {
      const showBox: any = document.querySelector('#renderCardFoodIngredient'+item[0] + item[1][0].time);
      if(showBox.style.display === 'block') {
        showBox.style.display = 'none';
      } else {
        showBox.style.display = 'block';
      }
    }
    return (
      <div key={item[0] + item[1][0].time}>
        <div 
          className={styles.cardClassTag}
          onClick={changeShow}
        >{item[0]} {item[1].length}</div>
        <div 
          id={'renderCardFoodIngredient'+item[0] + item[1][0].time}
          style={{
            display: 'block',
          }}
        >
          {item[1].map((item: FoodIngredientClass) => {
            return this.renderCardFoodIngredientItem(item);
          })}
        </div>
      </div>
    );
  }
  renderCardFoodIngredientItem = (item: FoodIngredientClass) => {
    return (
      <div 
        key={item.time} 
        className={styles.cardBox} 
        style={{opacity: item.num === 0 ? '.5' : '1'}}
        onClick={(e: any) => this.classClick(e, item)}
      >
        <div className={styles.card} key={item.time}>
        <div className={styles.cardName}>{item.name}-{item.num}</div>
        <div className={styles.cardMain}>
          <div>
            <span style={{color: '#444'}}>保鲜度/天:</span>
            <span style={{ marginLeft: '5px'}}>{item.day}</span>
          </div>
          <div>
            <div style={{color: '#444'}}>价格区间/￥:</div>
            <div style={{textAlign: 'right'}}>{app.getTowPointNum(item.minValue)}-{app.getTowPointNum(item.maxValue)}</div>
          </div>
        </div>
        {/* <div className={styles.cardTag}>{item.classValue}</div> */}
        <FileAddOutlined onClick={() => this.props.toPushNote(item, this.state.nowTab)} className={styles.cardAdd} />
      </div>
      <div className={styles.cardNote}>
        {item.notes.map((notes: any) => {
          return (
          <div key={`note-${notes.time}`}>
            <span>{app.msgTime(notes.time)}:</span>
            <div>{notes.note}</div>
          </div>
          );
        })}
      </div>
      </div>
    );
  };

  render() {
    return (
      <div className={`${commonStyle.page} ${styles.info}`}>
        {/* 导航 */}
        <div className={commonStyle.navbarChild}>
          <div 
            onClick={() => this.checkTab(1)}
            style={{
              borderBottom: this.state.nowTab == 1 ? '3px solid #000' : 'none'
            }}
          >食材</div>
          <div
            onClick={() => this.checkTab(2)}
            style={{
              borderBottom: this.state.nowTab == 2 ? '3px solid #000' : 'none'
            }}
          >调味</div>
          <div 
            onClick={() => this.checkTab(3)}
            style={{
              borderBottom: this.state.nowTab == 3 ? '3px solid #000' : 'none'
            }}
          >方便</div>
        </div>
        {/* 具体页面 */}
        <div className={styles.pageBox}>
        <SlideBox
          id="info"
          slideDistance={150}
          // slideLeft={this.slideLeft}
          // slideRight={this.slideRight}
        >
          <div id="info-page1" className={styles.page} style={{left: `${-(this.state.nowTab*100-100)}vw`}}>
            <div className={commonStyle.tipBox}>
              <div className={commonStyle.tip}>{tips[0].tip}</div>
              <div className={commonStyle.message}>{tips[0].message}</div>
            </div>
            {[...this.props.foodIngredientClass].map((item: any) => {
              return this.renderCardFoodIngredient(item)
            })}
          </div>
          <div id="info-page2" className={styles.page} style={{left: `${-(this.state.nowTab*100-200)}vw`}}>
            <div className={commonStyle.tipBox}>
              <div className={commonStyle.tip}>{tips[1].tip}</div>
              <div className={commonStyle.message}>{tips[1].message}</div>
            </div>
            {[...this.props.flavoringClass].map((item: any) => {
              return this.renderCardFoodIngredient(item);
            })}
          </div>
          <div id="info-page3" className={styles.page} style={{left: `${-(this.state.nowTab*100-300)}vw`}}>
            <div className={commonStyle.tipBox}>
              <div className={commonStyle.tip}>{tips[2].tip}</div>
              <div className={commonStyle.message}>{tips[2].message}</div>
            </div>
            {[...this.props.convenientFoodClass].map((item: any) => {
              return this.renderCardFoodIngredient(item);
            })}
          </div>
          </SlideBox>
        </div>
      </div>
    );
  }
}

export default connect((state: any) => ({...state.info, isBasket: state.index.isBasket}))(Info);