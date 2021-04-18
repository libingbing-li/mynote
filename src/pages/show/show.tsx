import React from 'react';
import {history} from 'umi';
import moment from 'moment';
import { connect, EffectsCommandMap, Model } from 'dva';
import { NoteShow, ModelShow } from '../../utils/interface';
import indexedDB from '../../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/show.less';
import app from '@/utils/app';

let data = [
	{
		timeId: 0,
		title: '这是一个标题',
		data: '这是一个html字符串内容',
		tags: ['tag1', 'tag2'],
	},
	{
		timeId: 1,
		title: '这是一个标题11111111111111111111111111111111111111',
		data: '这是一个html字符串内容1111111111111111111111111111111111111wwwwwwwwwwwwwwww1wwwwwwwwwwwwwwwwww1ssssssssssss1wwwwwww1',
		tags: ['tag1', 'tag2'],
	},
	{
		timeId: 2,
		title: '这是一个标题',
		data: '这是一个html字符串内容',
		tags: ['tag1', 'tag2'],
	},
	{
		timeId: 3,
		title: '这是一个标题',
		data: '这是一个html字符串内容',
		tags: ['tag1', 'tag2'],
	},
	{
		timeId: 4,
		title: '这是一个标题',
		data: '这是一个html字符串内容111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111ssssssssssssssssssssssss',
		tags: ['tag1', 'tag2'],
	},
];


interface IState {
	noteDatas: Array<any>;
}
// 展示日记，可以点击进入详情
class Show extends React.Component<ModelShow & {dispatch: any}> {
	state: IState = {
		noteDatas: data,
	}

	showNote = (item: NoteShow) => {
		return (
			<div className={styles.noteShow} key={item.timeId} onClick={() => history.push(`/note?isEdit=false&timeId=${item.timeId}`)}>
				<div className={styles.noteShow_time}>
					{moment(item.timeId).fromNow()}
				</div>
				<div className={styles.noteShow_title}>
					{item.title}
				</div>
				{/* <div className={styles.noteShow_data} dangerouslySetInnerHTML={{__html: item.data}}></div> */}
				<div className={styles.noteShow_data}>{item.data} </div>
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
        {this.state.noteDatas.map((item: NoteShow) => {
						return	this.showNote(item);
					})}
      </div>
		);
	}
}

export default connect((state: any) => ({
}))(Show);