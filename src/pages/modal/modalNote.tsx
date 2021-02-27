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
import { FoodIngredient, FoodIngredientClass, ModelIndex, ModelNow, ModelInfo } from '../../utils/interface';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/modal.less';


interface IProps {
  str: string;
  close: () => void;
  style: any;
}
class ModalNote extends React.Component<IProps & ModelIndex & ModelInfo & ModelNow & { dispatch: any}> {
  // 方法
  changeValue = ( data: any, proName?: string) => {
    switch(this.props.str) {
      case 'infoPushNote': 
      proName = 'infoNote'
      this.props.dispatch({
        type: 'info/changeState',
        payload: {
          [proName]: data,
        },
      });
        break;
      case 'nowAddNote':
        proName = 'nowNote';
        this.props.dispatch({
          type: 'now/changeState',
          payload: {
            [proName]: data,
          },
        });
        break;
      case 'nowEditNote':
        proName = 'nowNote';
        this.props.dispatch({
          type: 'now/changeState',
          payload: {
            [proName]: data,
          },
        });
        break;
    }
  }
  // 删除info-类
  removeInfo = () => {
    this.props.dispatch({
      type: 'info/remove',
      payload: this.props.close,
    });
  }
  // 删除now-笔记
  removeNowNote = () => {
    let type = 'now/removeRecordNote';
    switch(this.props.nowClassId) {
      case 2: type = 'now/removeTask'; break;
      case 3: type = 'now/removeSurprise'; break;
    }
    this.props.dispatch({
      type,
      payload: this.props.close,
    });
  }
  // info-添加类备注
  addInfoNote = () => {
    this.props.dispatch({
      type: 'info/pushNote',
      payload: this.props.close,
    });
  }

  // now - 添加笔记
  addNowNote = () => {
    let type = 'now/addNote';
    switch(this.props.nowClassId) {
      case 2: type = 'now/addTask'; break;
      case 3: type = 'now/addSurprise'; break;
    }
    this.props.dispatch({
      type,
      payload: this.props.close,
    });
  }

  //now - 编辑record笔记
  editNowNote = () => {
    let type = 'now/editRecordNote';
    switch(this.props.nowClassId) {
      case 2: type = 'now/editTask'; break;
      case 3: type = 'now/editSurprise'; break;
    }
    this.props.dispatch({
      type,
      payload: this.props.close,
    });
  }

  // 获取数据
  getValue = () => {
    let str = '';
    switch(this.props.str) {
      case 'infoPushNote': 
        str = this.props.infoNote
        break;
      case 'nowAddNote':
        str = this.props.nowNote
        break;
      case 'nowEditNote':
        str = this.props.nowNote
        break;
    }
    return str;
  }
  // 删除按钮是否出现 true出现
  getRemoveBtnDisplay = () => {
    if(this.props.noteModalStr === 'nowAddNote' 
    ) {
      return false;
    } else {
      return true;
    }
  }
  getAddBtnString = () => {
    if(this.props.noteModalStr === 'nowEditNote' ||
    (this.props.noteModalStr === 'nowEditNote' && this.props.nowClassId !== 1)
    ) {
      return '修改';
    } else {
      return '添加';
    }
  }
  //添加按钮点击
  addClick = () => {
    switch(this.props.str) {
      case 'infoPushNote': 
        this.addInfoNote();
        break;
      case 'nowAddNote':
        this.addNowNote();
        break;
      case 'nowEditNote':
        this.editNowNote();
        break;
    }
  }
  //删除按钮点击
  removeClick = () => {
    switch(this.props.str) {
      case 'infoPushNote': 
        this.removeInfo();
        break;
      case 'nowEditNote':
        this.removeNowNote();
        break
    }
  }

  render() {
    return (
      <div
          onClick={this.props.close}
          className={styles.modal}
          style={this.props.style}
        >
          <div 
            className={styles.classline1}
            onClick={(e: any) => e.stopPropagation()}
            style={{
              justifyContent: 'flex-start',
              display: this.props.str?.indexOf('nowAddNote') === -1 ? 'none' : 'flex'
            }}
          >
            <div
              className={this.props.nowClassId == 1 ? styles.chase : ''}
              onClick={() => {
                this.props.dispatch({
                  type: 'now/changeState',
                  payload: {
                    nowClassId: 1,
                  }
                });
              }}
              style={{
                marginLeft: 0,
              }}
            >笔记</div>
            <div
              onClick={() => {
                this.props.dispatch({
                  type: 'now/changeState',
                  payload: {
                    nowClassId: 2,
                  }
                });
              }}
              className={this.props.nowClassId == 2 ? styles.chase : ''}
            >任务</div>
            <div
              onClick={() => {
                this.props.dispatch({
                  type: 'now/changeState',
                  payload: {
                    nowClassId: 3,
                  }
                });
              }}
              className={this.props.nowClassId == 3 ? styles.chase : ''}
            >特殊</div>
          </div>
          {/* now-additem */}
          <div 
            className={styles.classline1}
            onClick={(e: any) => e.stopPropagation()}
            style={{
              justifyContent: 'flex-start',
              display: this.props.str?.indexOf('now') === -1 || this.props.nowClassId === 1
              ? 'none' : 'flex' 
            }}
          >
            <div
              className={this.props.nowItemClassId == 1 ? styles.chase : ''}
              onClick={() => {
                this.props.dispatch({
                  type: 'now/changeState',
                  payload: {
                    nowItemClassId: 1,
                  }
                });
              }}
              style={{
                marginLeft: 0,
              }}
            >家人</div>
            <div
              onClick={() => {
                this.props.dispatch({
                  type: 'now/changeState',
                  payload: {
                    nowItemClassId: 2,
                  }
                });
              }}
              className={this.props.nowItemClassId == 2 ? styles.chase : ''}
            >生活</div>
            <div
              onClick={() => {
                this.props.dispatch({
                  type: 'now/changeState',
                  payload: {
                    nowItemClassId: 3,
                  }
                });
              }}
              className={this.props.nowItemClassId == 3 ? styles.chase : ''}
            >爱好</div>
          </div>
          <div
            className={`${styles.inputlineNote} ${styles.inputline}`}
            onClick={(e: any) => e.stopPropagation()}
            style={{
              display: this.props.str?.indexOf('now') === -1 || this.props.nowClassId === 1
              ? 'none' : 'block',
              height: 'auto',
              padding: '0 10px',
            }}
          >
            <input
              type='text'
              placeholder={'名称'} 
              value={this.getValue()}
              onChange={(e: any) => {this.changeValue(e.target.value)}}
              style={{
                color: '#000'
              }}
            />
          </div>
          {/* 备注 */}
          <div
            className={`${styles.inputlineNote} ${styles.inputline}`}
            onClick={(e: any) => e.stopPropagation()}
            style={{
              display: this.props.str?.indexOf('now') !== -1 && this.props.nowClassId !== 1
              ? 'none' : 'block',
            }}
          >
            <textarea 
              placeholder={'备注'} 
              value={this.getValue()}
              onChange={(e: any) => {this.changeValue(e.target.value)}}
            />
          </div>
          
          {/* 按钮组 */}
          <div 
            style={{display: 'flex',justifyContent: 'flex-end', width: '95vw'}}
            onClick={(e: any) => e.stopPropagation()}
          >
            <div
              className={styles.btnline1}
              style={{
                display: this.getRemoveBtnDisplay() ? 'block' : 'none',
              }}
              onClick={this.removeClick}
            >
              <UnorderedListOutlined 
                style={{
                  marginRight: '10px',
                }}
              />
              删 除
            </div>
            <div
              onClick={this.addClick}
              className={styles.btnline2}
            >
              <PlusOutlined 
                style={{
                  marginRight: '10px',
                }}
              />
              {this.getAddBtnString()}
            </div>
          </div>
          </div>
    );
  }
} 
export default connect((state: any) => ({
  ...state.index,
  ...state.info,
  ...state.now,
}))(ModalNote);

