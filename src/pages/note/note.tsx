import React from 'react';
import { history } from 'umi';
import BraftEditor from 'braft-editor';
import { ControlType } from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import { connect, EffectsCommandMap, Model } from 'dva';
import {
	LeftOutlined,
	CheckOutlined,
	HighlightOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import { ModelNote } from '../../utils/interface';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/note.less';
import app from '@/utils/app';

// 编辑器的控件
const controls: Array<ControlType> = [
	'text-color', 'bold', 'italic', 'underline', 'strike-through', 
	'remove-styles', 'text-align', 
	'headings', 'list-ul', 'list-ol', 
	'hr', 
	'media', 
];

interface IState {
	isEdit: boolean;
	// 创建一个空的editorState作为初始值
	editorState: any;
	newtag: string;
}


// 该页面用于编辑展示日记
class Note extends React.Component<ModelNote & { dispatch: any }> {
	state: IState = {
		isEdit: true,
		// 创建一个空的editorState作为初始值
		editorState: BraftEditor.createEditorState(null),
		newtag: '',
	}

	componentDidMount() {
		let htmlContent = '';
		const timeId = history.location.query?.timeId;
		if(!(timeId === 'null')) {
			// 详情查看
			this.props.dispatch({
				type: 'note/getNoteData',
				payload: {
					timeId: history.location.query?.timeId,
				}
			});
		}
		// 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
		this.setState({
			editorState: BraftEditor.createEditorState(htmlContent)
		})
	}

	saveNote = () => {
		// 在编辑器获得焦点时按下ctrl+s会执行此方法
		// 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
		this.props.dispatch({
      type: 'note/saveNote',
      payload: {
        data: this.state.editorState.toHTML().toString(),
				goBack: history.goBack,
      },
    });
	}

	handleEditorChange = (editorState: any) => {
		this.setState({ editorState })
	}

	changeModelState = (proName: string, data: any) => {
		this.props.dispatch({
      type: 'note/changeState',
      payload: {
        [proName]: data,
      },
    });
	}


	// 添加tag
	addTag = () => {
		let tags = this.props.tags;
		tags.push(this.state.newtag);
		this.changeModelState('tags', tags);
		this.setState({
			newtag: '',
		});
	}
	
	// 删除tag
	deleteTag = (index: number) => {
		if(!this.state.isEdit) { return; }
		let tags = this.props.tags;
		tags.splice(index, 1);
		this.changeModelState('tags', tags);
	}



	render() {
		return (
			<div className={styles.note}>
				<div className={styles.title}>
					<LeftOutlined onClick={() => history.goBack()} />
					<input
						type='text'
						value={this.props.title}
						onChange={(e) => {this.changeModelState('title', e.target.value)}}
					></input>
					{this.state.isEdit ? <CheckOutlined onClick={this.saveNote} /> : <HighlightOutlined onClick={() => this.setState({isEdit: true})}/>}
				</div>
				<div className={styles.tags}>
					{this.props.tags.length === 0 ? <span>暂无标签</span> : 
						this.props.tags.map((tag: string, index: number) => {
							return <span key={index} onClick={() => this.deleteTag(index)}>{tag}</span>
						})
					}
				</div>
				<div className={styles.addTag}>
					<span>addTag: </span>
					<input type="text" value={this.state.newtag} onChange={(e) => {this.setState({newtag: e.target.value})}}/>
					<PlusOutlined onClick={this.addTag}/>
				</div>
				<div className="my-component">
					<BraftEditor
						value={this.state.editorState}
						readOnly={this.state.isEdit ? false : true}
						controls={this.state.isEdit ? controls : []}
						onChange={this.handleEditorChange}
						// onSave={this.submitContent}
					/>
				</div>
			</div>
		);
	}
}

export default connect((state: any) => ({
	...state.note,
}))(Note);