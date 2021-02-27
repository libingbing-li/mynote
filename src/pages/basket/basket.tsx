import React from 'react';
import {connect} from 'dva';
import { ModelBasket } from '../../utils/interface';
import styles from './style/basket.less';

interface IProps {
  style: any;
}

class Basket extends React.Component<IProps & ModelBasket & {dispatch: any}> {

  componentDidMount = () => {
    this.props.dispatch({type: 'basket/init'});
  }

  // dispatch
  changeValue = (proName: string, data: any) => {
    this.props.dispatch({
      type: 'basket/changeState',
      payload: {
        [proName]: data,
      },
    });
  }
  
  remove = (item: any, index: number, now: number) => {
    if(now !== this.props.nowBasket) {
      return;
    }
    this.props.dispatch({
      type: 'basket/remove',
      payload: {
        item,
        index
      },
    });
  }

  render() {
    return (
      <div id="basket" className={styles.basket} style={this.props.style}>
        <div 
          className={styles.topName}
          style={{display: this.props.nowBasket === 1 ? 'block' : 'none'}}
        >买菜</div>
        <div 
          className={styles.itemBox}
          style={{display: this.props.nowBasket === 1 ? 'block' : 'none'}}
        >
          {this.props.basketBuy.map((item, index) => {
            return (
            <div 
              className={styles.item} 
              key={index}
              onClick={() => this.remove(item,index, 1)}
            >{item.name}</div>
            );
          })}
        </div>
        <div 
          className={styles.topName}
          style={{
            display: this.props.nowBasket !== 1 ? 'block' : 'none',
            opacity: this.props.nowBasket === 2 ? 1 : .5
          }}
          onClick={() => this.changeValue('nowBasket', 2)}
        >早餐</div>
        <div 
          className={styles.itemBox}
          style={{
            display: this.props.nowBasket !== 1 ? 'block' : 'none',
            opacity: this.props.nowBasket === 2 ? 1 : .5
          }}
        >
          {this.props.basketMorning.map((item, index) => {
            return (
              <div 
              className={styles.item} 
              key={'morning'+index}
              onClick={() => this.remove(item,index, 2)}
            >{item.name}</div>
            );
          })}
        </div>
        <div 
          className={styles.topName}
          style={{
            display: this.props.nowBasket !== 1 ? 'block' : 'none',
            opacity: this.props.nowBasket === 3 ? 1 : .5
          }}
          onClick={() => this.changeValue('nowBasket', 3)}
        >午餐</div>
        <div 
          className={styles.itemBox}
          style={{
            display: this.props.nowBasket !== 1 ? 'block' : 'none',
            opacity: this.props.nowBasket === 3 ? 1 : .5
          }}
        >
          {this.props.basketAfternoon.map((item, index) => {
            return (
              <div 
              className={styles.item} 
              key={'afternoon'+index}
              onClick={() => this.remove(item,index, 3)}
            >{item.name}</div>
            );
          })}
        </div>
        <div 
          className={styles.topName}
          style={{
            display: this.props.nowBasket !== 1 ? 'block' : 'none',
            opacity: this.props.nowBasket === 4 ? 1 : .5
          }}
          onClick={() => this.changeValue('nowBasket', 4)}
        >晚餐</div>
        <div 
          className={styles.itemBox}
          style={{
            display: this.props.nowBasket !== 1 ? 'block' : 'none',
            opacity: this.props.nowBasket === 4 ? 1 : .5
          }}
        >
          {this.props.basketEvening.map((item, index) => {
            return (
              <div 
              className={styles.item} 
              key={'evening'+index}
              onClick={() => this.remove(item,index, 4)}
            >{item.name}</div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default connect((state: any) => ({...state.basket}))(Basket);