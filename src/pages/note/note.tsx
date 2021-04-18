import React from 'react';
import { history } from 'umi';
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import { connect, EffectsCommandMap, Model } from 'dva';
import {
	LeftOutlined,
	UnorderedListOutlined,
	CheckOutlined,
	HighlightOutlined,
	HighlightFilled
} from '@ant-design/icons';
import SlideBox from '@/common-components/SlideBox';
import TopBox from '../modal/topBox';
import Sidebar from '../modal/sidebar';
import { ModelNote } from '../../utils/interface';
import indexedDB from '../../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/note.less';
import app from '@/utils/app';

interface IState {
	isEdit: boolean;
	// 创建一个空的editorState作为初始值
	editorState: any;
}


// 该页面用于编辑展示日记
class Note extends React.Component<ModelNote & { dispatch: any }> {
	state: IState = {
		isEdit: true,
		// 创建一个空的editorState作为初始值
		editorState: BraftEditor.createEditorState(null),
	}

	async componentDidMount() {
		const htmlContent = '';
		// 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
		this.setState({
			editorState: BraftEditor.createEditorState(htmlContent)
		})
	}

	submitContent = async () => {
		// 在编辑器获得焦点时按下ctrl+s会执行此方法
		// 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
		const htmlContent = this.state.editorState.toHTML()
	}

	handleEditorChange = (editorState: any) => {
		this.setState({ editorState })
	}


	render() {
		return (
			<div className={styles.note}>
				<div className={styles.title}>
					<LeftOutlined onClick={() => history.goBack()} />
					<input
						type='text'
						value={this.state.isEdit ? '请输入标题' : this.props.note.title}
					></input>
					{this.state.isEdit ? <CheckOutlined /> : <HighlightOutlined />}
				</div>
				<div className={styles.tags}></div>
				<div className="my-component">
					<BraftEditor
						value={this.state.editorState}
						onChange={this.handleEditorChange}
						onSave={this.submitContent}
					/>
				</div>
			</div>
		);
	}
}

export default connect((state: any) => ({
}))(Note);