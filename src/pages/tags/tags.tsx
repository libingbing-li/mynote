import React from 'react';
import { history } from 'umi';
import moment from 'moment';
import { connect, EffectsCommandMap, Model } from 'dva';
import {
  UnorderedListOutlined,
  HighlightOutlined,
  HighlightFilled,
  SearchOutlined,
} from '@ant-design/icons';
import SlideBox from '@/common-components/SlideBox';
import TopBox from '../modal/topBox';
import Sidebar from '../modal/sidebar';
import { ModelTags, NoteShow } from '../../utils/interface';
import indexedDB from '../../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import styles from '../show/styles/show.less';
import app from '@/utils/app';

interface IState {
  str: string;
}

// 用于展示tag数和时间的分布
class Tags extends React.Component<
  ModelTags & { infoNote: string; nowNote: string; dispatch: any }
> {
  state: IState = {
    str: '',
  };

  componentDidMount = () => {
    const tags = document.querySelector('#tags');
    tags?.addEventListener('scroll', (e: any) => {
      this.props.dispatch({
        type: 'tags/changeState',
        payload: {
          scrollTop: tags.scrollTop,
        },
      });
    });
    if (tags) {
      tags.scrollTop = this.props.scrollTop;
    }
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

  search = () => {
    this.props.dispatch({
      type: 'tags/search',
      payload: {
        str: this.state.str,
      },
    });
  };

  render() {
    return (
      <div className={styles.show} id="tags">
        <div className={styles.searchBox}>
          <input
            value={this.state.str}
            onChange={(e) => {
              this.setState({ str: e.target.value });
            }}
            type="text"
          />
          <div onClick={this.search}>
            <SearchOutlined />
          </div>
        </div>

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
  ...state.tags,
}))(Tags);
