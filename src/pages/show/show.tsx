import React from 'react';
import { history } from 'umi';
import moment from 'moment';
import { connect, EffectsCommandMap, Model } from 'dva';
import DateSelect from '../../common-components/DateSelect';
import { NoteShow, ModelShow } from '../../utils/interface';
import indexedDB from '../../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/show.less';
import app from '@/utils/app';
import './styles/antd.css';

interface IState {}
// 展示日记，可以点击进入详情
class Show extends React.Component<ModelShow & { dispatch: any }> {
  state: IState = {};

  componentDidMount = () => {
    const show = document.querySelector('#show');
    show?.addEventListener('scroll', (e: any) => {
      this.props.dispatch({
        type: 'show/changeState',
        payload: {
          scrollTop: show.scrollTop,
        },
      });
    });
    if (show) {
      show.scrollTop = this.props.scrollTop;
    }
    this.props.dispatch({
      type: 'show/openDB',
    });
  };

  showNote = (item: NoteShow) => {
    return (
      <div
        className={styles.noteShow}
        key={item.timeId}
        onClick={() => history.push(`/note?timeId=${item.timeId}`)}
      >
        <div className={styles.noteShow_time}>
          {moment(item.timeId).fromNow()}
        </div>
        <div className={styles.noteShow_title}>{item.title}</div>
        <div
          className={styles.noteShow_data}
          dangerouslySetInnerHTML={{ __html: item.data }}
        ></div>
        <div className={styles.noteShow_tags}>
          {item.tags.map((tag: string, index: number) => {
            return <span key={index}>{tag}</span>;
          })}
        </div>
      </div>
    );
  };

  getTime = (year: number, month: number, date: number) => {
    // console.log(year, month, date);
    let yearMax = 0;
    let monthMax = 0;
    if (month + 1 === 13) {
      yearMax = year + 1;
      monthMax = 1;
    } else {
      yearMax = year;
      monthMax = month + 1;
    }
    this.props.dispatch({
      type: 'show/init',
      payload: {
        minTime: new Date(`${year}-${month}-1`).getTime(),
        maxTime: new Date(`${yearMax}-${monthMax}-1`).getTime(),
      },
    });
  };

  render() {
    return (
      <div id="show" className={styles.show}>
        <DateSelect
          id="show"
          type={1}
          style={{
            width: '80vw',
            margin: '10px 10vw',
          }}
          returnTime={(year: number, month: number, date: number) =>
            this.getTime(year, month, date)
          }
        ></DateSelect>
        {this.props.notedata.length === 0 ? (
          <div className={styles.nothing}>
            当前还没有日记，点击右上角按钮新建日记~
          </div>
        ) : (
          this.props.notedata.map((item: NoteShow) => {
            return this.showNote(item);
          })
        )}
      </div>
    );
  }
}

export default connect((state: any) => ({
  ...state.show,
}))(Show);
