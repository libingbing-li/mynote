import React from 'react';
import { connect } from 'dva';
import {
  HomeOutlined,
  HomeFilled,
  CarryOutOutlined,
  CarryOutFilled,
  SnippetsOutlined,
  SnippetsFilled,
  PlusOutlined,
  UnorderedListOutlined,
  ReloadOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  StarFilled
} from '@ant-design/icons';
import { FoodIngredient, FoodIngredientClass, ModelIndex } from '../../utils/interface';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/modal.less';

interface IProps {
  str: string;
  close: () => void;
  style: any;
  isLocking: boolean;
  locking: () => void;
}
class ModalNote extends React.Component<IProps & ModelIndex & {infoNote: string; nowNote: string; dispatch: any}> {
  // 方法
  changeValue = (proName: string, data: any) => {
    this.props.dispatch({
      type: 'index/changeState',
      payload: {
        [proName]: data,
      },
    });
  }
  // 根据输入的名称自动获取相关的其他信息 -- 根据上一次实例
  getOtherInfoByName = (name: string) => {
    this.props.dispatch({
      type: 'index/getOtherInfoByName',
      payload: name,
    });
  }
  // 删除
  remove = () => {
    this.props.dispatch({
      type: 'index/remove',
      payload: this.props.close,
    });
  }
  // 添加index-item
  add = () => {
    this.props.dispatch({
      type: 'index/addItem',
      payload: this.props.close,
    });
  }

  


  renderItem = () => {
    return (
      <div
          onClick={this.props.close}
          className={styles.modal}
          style={this.props.style}
        >
          <div 
          onClick={(e: any) => e.stopPropagation()}
          className={styles.modalItem}
          >
            {/* 名字 */}
          <div style={{display: 'flex', marginBottom: '15px'}}>
          <div
            className={styles.inputline1}
          >
            {/* 名称 */}
            <input 
              type="text" 
              placeholder={'名称'} 
              value={this.props.name}
              onChange={(e: any) => {
                this.changeValue('name',e.target.value);
                this.getOtherInfoByName(e.target.value);
              }}
            />
          </div>
          <div
            className={styles.inputline2}
          >
            {/* 保鲜度 */}
            <input 
              type="number" 
              placeholder={'保鲜度 / 天'} 
              value={this.props.day}
              onChange={(e: any) => {
                this.changeValue('day',e.target.value);
              }}
            />
          </div>
          </div>
          {/* 数量重量等 */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between', 
              flexWrap: 'wrap', 
              width: '95vw'
            }
            }>
          {/* 数量 */}
          <div
            className={styles.inputline}
          >
            <input 
              type="number" 
              placeholder={'数量 / 次'}
              value={this.props.num} 
              onChange={(e: any) => {
                this.changeValue('num',e.target.value);
              }}
            />
          </div>
          {/* 重量 */}
          <div
            className={styles.inputline}
          >
            <input 
              type="number" 
              placeholder={'重量 / g'} 
              value={this.props.weight}
              onChange={(e: any) => {
                this.changeValue('weight',e.target.value);
              }}
            />
          </div>
          {/* 价格 */}
          <div
            className={styles.inputline}
          >
            <input 
              type="number" 
              placeholder={'价格 / ￥'} 
              value={this.props.value}
              onChange={(e: any) => {
                this.changeValue('value',e.target.value);
              }}
            />
          </div>
          {/* 第一行 大类别 */}
          <div className={styles.classline1}>
            <div
              className={this.props.classId == 1 ? styles.chase : ''}
              onClick={() => {
                this.changeValue('classId',1)
              }}
              style={{
                marginLeft: 0,
              }}
            >食材</div>
            <div
              onClick={() => {
                this.changeValue('classId',2)
              }}
              className={this.props.classId == 2 ? styles.chase : ''}
            >调味</div>
            <div
              onClick={() => {
                this.changeValue('classId',3)
              }}
              className={this.props.classId == 3 ? styles.chase : ''}
            >方便</div>
            <div
            className={styles.classline2}
            style={{
              marginRight: 0,
            }}
          >
            <input 
              type="text" 
              placeholder={'小类别'} 
              value={this.props.classValue}
              onChange={(e: any) => {
                this.changeValue('classValue',e.target.value);
              }}
            />
          </div>
          </div>
          {/* 备注 */}
          <div
            className={styles.inputline}
            style={{
              width: '95vw', 
              color: '#000', 
              background: '#fff',
              height: '100px',
              padding: '2.5vw'
            }}
            onClick={(e: any) => e.stopPropagation()}
          >
            <textarea 
              style={{width: '90vw', color: '#000'}}
              placeholder={'备注'} 
              value={this.props.infoNote}
              onChange={(e: any) => {
                this.changeValue('note',e.target.value);
              }}
            />
          </div>
          </div>
          
          {/* 按钮组 */}
          <div style={{display: 'flex'}}>
            <div
              className={styles.btnline1}
              onClick={this.props.time ? this.remove : this.props.locking}
              style={{
                color: this.props.isLocking ? '#fff' : '#000',
                background: this.props.isLocking ? '#000' : '#fff',
              }}
            >
              <UnorderedListOutlined 
                style={{
                  marginRight: '10px',
                  color: this.props.isLocking ? '#fff' : '#000',
                }}
              />
              {this.props.time ? `删 除` : '锁 定'}
            </div>
            <div
              onClick={this.add}
              className={styles.btnline2}
            >
              <PlusOutlined 
                style={{
                  marginRight: '10px',
                }}
              />
              {this.props.time ? `修 改` : '添 加'}
            </div>
          </div>
          </div>
        </div>
    );
  }
  // 渲染
  renderBox = () => {
    let div = <div></div>;
    switch(this.props.str) {
      default: div = this.renderItem();
    }
    return div;
  }
  render() {
    return this.renderBox();
  }
} 
export default connect((state: any) => ({
  ...state.index,
  ...state.info,
  nowNote: state.now.nowNote
}))(ModalNote);

