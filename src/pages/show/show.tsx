import React from 'react';
import {history} from 'umi';
import moment from 'moment';
import { connect, EffectsCommandMap, Model } from 'dva';
import { NoteShow, ModelShow } from '../../utils/interface';
import indexedDB from '../../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/show.less';
import app from '@/utils/app';



interface IState {
}
// 展示日记，可以点击进入详情
class Show extends React.Component<ModelShow & {dispatch: any}> {
	state: IState = {
	}

	componentDidMount = () => {
		this.props.dispatch({
			type: 'show/openDB'
		});
	}

	showNote = (item: NoteShow) => {
		return (
			<div className={styles.noteShow} key={item.timeId} onClick={() => history.push(`/note?timeId=${item.timeId}`)}>
				<div className={styles.noteShow_time}>
					{moment(item.timeId).fromNow()}
				</div>
				<div className={styles.noteShow_title}>
					{item.title}
				</div>
				<div className={styles.noteShow_data} dangerouslySetInnerHTML={{__html: item.data}}></div>
				<div className={styles.noteShow_tags}>
					{item.tags.map((tag: string, index: number) => {
						return <span key={index}>{tag}</span>
					})}
				</div>
			</div>
		);
	}

	render() {
		return (
      <div className={styles.show}>
        {this.props.notedata.map((item: NoteShow) => {
						return	this.showNote(item);
					})}
      </div>
		);
	}
}

export default connect((state: any) => ({
	...state.show,
}))(Show);