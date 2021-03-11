import React from 'react';
import { connect } from 'dva';
import {
	AlignLeftOutlined,
	AlignCenterOutlined,
	AlignRightOutlined,
	FontSizeOutlined,
	BoldOutlined,
	ItalicOutlined,
	UnderlineOutlined,
	StrikethroughOutlined,
	PictureOutlined,
	CloseOutlined,
	CheckOutlined
} from '@ant-design/icons';
import style from './style/newnote.less';

class NewNote extends React.Component {
	state = {
		dateStr: '',
		txtDate: '写点什么吧...',
	}

	componentDidMount = () => {
		// 为可编辑div区域添加内容变动监听
		// const text = document.getElementById('newNotetxtArea');
		const text = document.querySelector('#newNotetxtArea');
		text?.addEventListener('focusin', function () {
			console.log('newNote-focusin-暂存内容')
			if (text && text.innerHTML !== '') {
				localStorage.setItem('newNote_Txt', text.innerHTML.toString());
			}
		})
		text?.addEventListener('focusout', function () {
			console.log('newNote-focusout-暂存内容')
			if (text && text.innerHTML !== '') {
				localStorage.setItem('newNote_Txt', text.innerHTML.toString());
			}
		})
		const operatingSpace = document.querySelector('#newnote_operatingSpace');
		operatingSpace?.addEventListener('mousedown', function (e) {
			console.log('operatingSpace-mousedown-禁止失去焦点');
			e.preventDefault();
		})
		// 获取时间
		const nowDateStr = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate();
		const txt = localStorage.getItem('newNote_Txt');
		this.setState({
			dateStr: nowDateStr,
			txtDate: txt,
		});
	}

	changeNewNoteTxt = (e) => {
		console.log(e)
		// 随着更改改变localStorage暂存的日记文本
		const text = document.getElementById('newNotetxtArea');
		console.log(text?.innerHTML);
	}

	saveNote = () => {
		const text = document.getElementById('newNotetxtArea');
		if (text && text.innerHTML !== '') {
			localStorage.setItem('newNote_Txt', text.innerHTML.toString());
		}
	}

	// 富文本编辑器
	fontSize = () => {
		const text = document.getElementById('newNotetxtArea');
		console.log();
	}


	render() {
		return (
			<div id="newnote" className={style.newnote}>
				<div className={style.newnote_time}>
					<CloseOutlined />
					{this.state.dateStr}
					<CheckOutlined onClick={this.saveNote} />
				</div>
				<div className={style.newnote_main}>
					<input className={style.newnote_title} type="text" placeholder="写个标题吧..."></input>
					<div className={style.newnote_location}>地点: <span>暂无</span></div>
					<div className={style.newnote_weather}>天气: <span>暂无</span></div>
					<div className={style.newnote_mood}>心情: <span>暂无</span></div>
					<div
						id="newNotetxtArea"
						contentEditable={true}
						dangerouslySetInnerHTML={{ __html: this.state.txtDate }}
						className={style.newnote_text}
					></div>
				</div>
				<div id="newnote_operatingSpace" className={style.newnote_operatingSpace}>
					<FontSizeOutlined onClick={this.fontSize} />
					<BoldOutlined />
					<ItalicOutlined />
					<UnderlineOutlined />
					<StrikethroughOutlined />
					<AlignLeftOutlined />
					<AlignCenterOutlined />
					<AlignRightOutlined />
					<div className={style.newnote_colorbtn}></div>
					<PictureOutlined />
				</div>
			</div>
		);
	}
}

export default NewNote;