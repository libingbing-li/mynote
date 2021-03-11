import React from 'react';
import { connect, EffectsCommandMap, Model } from 'dva';
import {
	UnorderedListOutlined,
	HighlightOutlined,
	HighlightFilled
} from '@ant-design/icons';
import SlideBox from '@/common-components/SlideBox';
import MoveBox from '@/common-components/MoveBox';
import Time from './time/time';
import Info from './info/info';
import Now from './now/now';
import Basket from './basket/basket';
import TopBox from './modal/topBox';
import Sidebar from './modal/sidebar';
import NewNote from './newnote/newnote';
import ModalNote from './modal/modalNote';
import ModalItem from './modal/modalItem';
import { FoodIngredient, FoodIngredientClass, ModelIndex, RecordNote } from '../utils/interface';
import indexedDB from '../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import styles from './index.less';
import app from '@/utils/app';

interface IState {
	nowPage: number; //当前处于哪个页面
	isFilter: boolean; //模糊模式
	// isAddItem: boolean; //添加项目
	// isLocking: boolean; //添加项目-是否添加后不关闭窗口
	isAddNote: boolean; //新建笔记
	// isAddNowItem: boolean;
}


class Index extends React.Component<ModelIndex & {infoNote: string; nowNote: string; dispatch: any}> {
	state: IState = {
		nowPage: 1,
		isFilter: false, //模糊模式
		// isAddItem: false, //添加项目
		// isLocking: false, //添加项目-是否添加后不关闭窗口
		isAddNote: false,
		// isAddNowItem: false,
	}


	// 下拉行为 - 刷新
	slideBottom = (e:any) => {
		// 刷新
		const refreshBox: any = document.querySelector(`#refreshBox`);
		const page: any = document.querySelector(`#index-page${this.state.nowPage}`);
		const navbar: any = document.querySelector(`#navbar`);
		let scrollTopNoZero = false;
		switch(this.state.nowPage) {
			case 1: 
			const t1: any = document.querySelector('#time-page1');
			const t2: any = document.querySelector('#time-page2');
			const t3: any = document.querySelector('#time-page3');
			console.log(t3);
			if(t1.scrollTop !== 0 ||
				t2.scrollTop !== 0 ||
				t3.scrollTop !== 0
				) {
					scrollTopNoZero = true;
				}
			break;
			case 2:
				if(page.lastElementChild.lastElementChild.scrollTop !== 0 ) {
					scrollTopNoZero = true;
				}
				break;
			case 3: 
			const i1: any = document.querySelector('#info-page1');
				const i2: any = document.querySelector('#info-page2');
				const i3: any = document.querySelector('#info-page3');
				if(i1.scrollTop !== 0 ||
					i2.scrollTop !== 0 ||
					i3.scrollTop !== 0
					) {
						scrollTopNoZero = true;
					}
				break;
		}
		console.log(scrollTopNoZero);
		if(scrollTopNoZero) {
			return;
		}
		refreshBox.style.top = '0vh';
		navbar.style.marginTop = '15vh';
		if(this.state.nowPage === 3) {
			this.props.dispatch({
				type: 'info/init'
			});
		} else if(this.state.nowPage  === 1) {
			this.props.dispatch({
				type: 'time/init'
			});
		} else {
			this.props.dispatch({
				type: 'now/init'
			});
		}
		setTimeout(() => {
			refreshBox.style.top = '-15vh';
			navbar.style.marginTop = '0vh';
		}, 1000);
	}
	// 左滑行为
	slideLeft = () => {
		console.log('slideLeft');
		if(this.state.nowPage == 1) {
			return;
		}
		for(let i = 1; i <= 2; i++) {
			const page: any = document.querySelector(`#index-page${i}`);
			let left = Number(page.style.left.substring(0,page.style.left.length - 2));
			page.style.left = left + 100 + 'vw';
		}
		this.setState((state: any) => {
			if(state.nowPage - 1 === 2) {
				this.props.dispatch({
					type: 'info/init'
				});
			} else if(state.nowPage - 1 === 1) {
				this.props.dispatch({
					type: 'time/init'
				});
			} else {
				this.props.dispatch({
					type: 'now/init'
				});
			}
			return {
				nowPage: state.nowPage - 1,
			};
		});
		this.sidebarClose();
	}
	// 右滑行为
	slideRight = () => {
		console.log('slideRight');
		if(this.state.nowPage == 2) {
			return;
		}
		for(let i = 2; i >= 1; i--) {
			const page: any = document.querySelector(`#index-page${i}`);
			let left = Number(page.style.left.substring(0,page.style.left.length - 2));
			page.style.left = left - 100 + 'vw';
		}
		this.setState((state: any) => {
			if(state.nowPage + 1 === 2) {
				this.props.dispatch({
					type: 'info/init'
				});
			} else if(state.nowPage + 1 === 1) {
				this.props.dispatch({
					type: 'time/init'
				});
			} else {
				this.props.dispatch({
					type: 'now/init'
				});
			}
			return {
				nowPage: state.nowPage + 1,
			};
		});
		this.sidebarClose();
	}

	// 点击切换
	checkTab = () => {
		let page = 1;
		if(this.state.nowPage === 1) {
			page = 2;
		} 
		if(page > this.state.nowPage) {
			// 右滑
			for(let i = this.state.nowPage; i < page ; i++){
				this.slideRight();
			};
		} else {
			// 左滑
			for(let i = this.state.nowPage; i > page ; i--){
				this.slideLeft();
			};

		}
	}

	// 设置
	// setShow = () => {
	// 	const setBox: any = document.querySelector(`#setBox`);
	// 	const navbar: any = document.querySelector(`#navbar`);
	// 	if(setBox.style.top === '-50vh') {
	// 		setBox.style.top = '0vh';
	// 		navbar.style.marginTop = '50vh'
	// 	} else {
	// 		setBox.style.top = '-50vh';
	// 		navbar.style.marginTop = '0vh'
	// 	}
	// }
	// // 关闭设置
	// setClose = () => {
	// 	const setBox: any = document.querySelector(`#setBox`);
	// 	const navbar: any = document.querySelector(`#navbar`);
	// 	setBox.style.top = '-50vh';
	// 	navbar.style.marginTop = '0vh';
	// }

	// 侧边栏
	sidebarShow = () => {
		console.log('sidebarShow');
		const sidebar: any = document.querySelector(`#sidebar`);
		const page: any = document.querySelector(`#index-page${this.state.nowPage}`);
		const navbar: any = document.querySelector(`#navbar`);
		if(sidebar.style.left === '-200px') {
			sidebar.style.left = '0';
			page.style.left = '200px';
			navbar.style.left = '200px';
		} else {
			sidebar.style.left = '-200px';
			page.style.left = '0vh';
			navbar.style.left = '0vh';
		}
	}
	// 关闭侧边栏
	sidebarClose = () => {
		console.log('sidebarShow');
		const sidebar: any = document.querySelector(`#sidebar`);
		const page: any = document.querySelector(`#index-page${this.state.nowPage}`);
		const navbar: any = document.querySelector(`#navbar`);
		sidebar.style.left = '-200px';
		page.style.left = '0vh';
		navbar.style.left = '0vh';
	}

	// 进入模糊模式
	filter = () => {
		this.setState({
			isFilter: true,
		});
	}
	// 退出模糊模式
	filterClose = () => {
		this.setState({
			isFilter: false,
		});
	}

	// 点击页面
	pageClick = () => {
		console.log('pageClick');
		// 当侧边栏存在，点击关闭
		const sidebar: any = document.querySelector(`#sidebar`);
		if(sidebar.style.left !== '-200px') {
			this.sidebarClose();
		}
	}

	// 进入购物篮
	// basket = () => {
	// 	this.changeValue('isBasket', true);
	// 	let now = 1;
	// 	if(this.state.nowPage === 1) {
	// 		now = 2;
	// 	}
	// 	this.props.dispatch({
	// 		type: 'basket/changeState',
	// 		payload: {
	// 			nowBasket: now,
	// 		}
	// 	});
	// 	this.props.dispatch({type: 'basket/init'});
	// 	const basket: any = document.querySelector(`#basket`);
	// 	basket.style.right = '0vw';
	// }
	// // 退出购物篮
	// basketClose = () => {
	// 	this.changeValue('isBasket', false);
	// 	this.props.dispatch({
	// 		type: 'basket/changeState',
	// 		payload: {
	// 			nowBasket: 1,
	// 		}
	// 	});
	// 	const basket: any = document.querySelector(`#basket`);
	// 	basket.style.right = '-30vw';
	// }

	
	// 进入添加项目
	// addItem = () => {
	// 	this.filter();
	// 	if(this.state.nowPage === 2) {
	// 		this.nowNote();
	// 	} else {
	// 		this.setState({
	// 			isAddItem: true,
	// 		});
	// 	}
	// }
	// infoNote = (item: FoodIngredientClass, classId: number) => {
	// 	this.filter();
	// 	this.setState({
	// 		isAddNote: true,
	// 	});
	// 	this.changeValue('noteModalStr', 'infoPushNote');
	// 	this.changeValueInfo('infoData', item);
	// 	this.changeValueInfo('infoTime', item.time);
	// 	this.changeValueInfo('classIdInfo', classId);
	// }
	// nowNote = () => {
	// 	this.setState({
	// 		isAddNote: true,
	// 	});
	// 	this.changeValue('noteModalStr', 'nowAddNote');
	// 	this.filter();
	// }
	// 退出添加项目
	// addClose = () => {
	// 	this.props.dispatch({
	// 		type: 'index/changeState',
	// 		payload: {
	// 			time: 0, //时间戳-id
	// 			classId: 1, //分类: 1   //1食材 2菜谱 3调味 4方便食物
	// 			classValue: '默认', //小分类
	// 			name: '',
	// 			day: '', //保鲜天数
	// 			num: '', //个数
	// 			weight: '', //重量
	// 			value: '', //价格
	// 			note: '', //备注
	// 		},
	// 	});
	// 	if(this.state.isLocking) {
	// 		// 如果锁定,清除文字但不关闭
	// 		return;
	// 	}
	// 	this.filterClose();
	// 	this.setState({
	// 		isAddItem: false,
	// 	});
	// }
	// addCloseInfo = () => {
	// 	this.filterClose();
	// 	this.setState({
	// 		isAddNote: false,
	// 	});
	// 	if(this.state.nowPage === 2) {
	// 		this.props.dispatch({
	// 			type: 'now/changeState',
	// 			payload: {
	// 				nowNote: '',
	// 			},
	// 		});
	// 		return;
	// 	} 
	// 	this.props.dispatch({
	// 		type: 'info/changeState',
	// 		payload: {
	// 			infoTime: 0, //时间戳-id
	// 			infoNote: '', 
	// 		},
	// 	});
	// }
	// 锁定 - 添加项目后不会关闭,方便一次添加多条
	// locking = () => {
	// 	this.setState((state: any) => {
	// 		return {
	// 			isLocking: !state.isLocking,
	// 		};
	// 	});
	// }


	// 进入添加日记
	addNote = () => {
		console.log('addNote');
		this.setState({
			isAddNote: true,
		});
		const newnote: any = document.querySelector(`#newnote`);
		newnote.style.bottom = '0vh';
		this.filter();
		this.sidebarClose();
	}

	

	

	// dispatch
	// changeValue = (proName: string, data: any) => {
	// 	this.props.dispatch({
	// 		type: 'index/changeState',
	// 		payload: {
	// 			[proName]: data,
	// 		},
	// 	});
	// }
	// changeValueInfo = (proName: string, data: any) => {
	// 	if(this.state.nowPage === 2) {
	// 		this.props.dispatch({
	// 			type: 'now/changeState',
	// 			payload: {
	// 				[proName]: data,
	// 			},
	// 		});
	// 		return;
	// 	}
	// 	this.props.dispatch({
	// 		type: 'info/changeState',
	// 		payload: {
	// 			[proName]: data,
	// 		},
	// 	});
	// }

	
	

	// 编辑 给予additem数据
	// giveAddItemInfo = (data: FoodIngredient, classId: number) => {
	// 	this.props.dispatch({
	// 		type: 'index/changeState',
	// 		payload: {
	// 			...data,
	// 			data: data,
	// 			classId,
	// 		},
	// 	});
	// 	this.addItem();
	// }



	render() {
		return (
			<div id={styles.index}>
				{/* 模糊层 */}
				<div
					className={styles.addCover}
					style={{
						display: this.state.isFilter ? 'block' : 'none',
					}}
				></div>
				{/* 刷新层 */}
				<TopBox str="refresh"></TopBox>
				{/* 设置层 */}
				{/* <TopBox str="set"></TopBox> */}
				{/* 各类弹窗 */}
				{/* 备注 */}
				{/* <ModalNote
					str={this.props.noteModalStr}
					close={this.addCloseInfo}
					style={{
						display: this.state.isAddNote ? 'flex' : 'none',
					}}
				></ModalNote> */}
				{/* index-添加项目 */}
				{/* <ModalItem
					close={this.addClose}
					style={{
						display: this.state.isAddItem ? 'flex' : 'none',
					}}
					isLocking={this.state.isLocking}
					locking={this.locking}
				></ModalItem> */}
				{/* 侧边栏 */}
				<Sidebar
					style={{
						left: '-200px'
					}}
				></Sidebar> 
				{/* 新建日记 */}
				<NewNote></NewNote>
				{/* 顶栏 */}
				<div 
					id="navbar"
					className={commonStyle.navbar}
					style={{
						filter: this.state.isFilter ? 'blur(3px)' : 'blur(0px)',
						left: '0px'
					}}  
				>
					<UnorderedListOutlined onClick={this.sidebarShow}/>
					<span onClick={this.checkTab}>
						{this.state.nowPage === 1 ? 'MyNote' : 'Satisfy'}
					</span>
					{this.state.isAddNote ? <HighlightFilled /> : <HighlightOutlined onClick={this.addNote} />}
				</div>
				{/* page */}
				<div 
					className={styles.pageBox} 
					id="index-page"
					style={{
						filter: this.state.isFilter ? 'blur(3px)' : 'blur(0px)'
					}}  
					onClick={this.pageClick}
				>
				<SlideBox
					id="index"
					slideDistance={50}
					slideLeft={this.slideLeft}
					slideRight={this.slideRight}
					slideBottom={this.slideBottom}
				>
					<div id="index-page1" className={styles.page} style={{left: `${-(this.state.nowPage*100-100)}vw`}}>
						1
						{/* <Time 
							edit={this.giveAddItemInfo}
						></Time> */}
					</div>
					<div id="index-page2" className={styles.page} style={{left: `${-(this.state.nowPage*100-200)}vw`}}>
						2
						{/* <Now
							edit={this.nowNote}
						></Now> */}
					</div>
					{/* <div id="index-page3" className={styles.page} style={{left: `${-(this.state.nowPage*100-300)}vw`}}>
						<Info 
							toPushNote={(item: FoodIngredientClass, classId: number) => this.infoNote(item, classId)}
						></Info>
					</div> */}
					</SlideBox>
				</div>
				{/* 添加按钮 */}
				{/* <MoveBox
					id="index-add"
					right="5px"
					bottom="100px"
					minTop={55}
					minLeft={5}
					minBottom={65}
					minRight={5}
					isRight={true}
					isLeft={true}
					fx={document.querySelector(`#${styles.index}`)?.clientWidth}
					fy={document.querySelector(`#${styles.index}`)?.clientHeight}
				>
					<div 
						className={styles.addBtn}
						onClick={this.addItem}
						style={{
							filter: this.state.isFilter ? 'blur(3px)' : 'blur(0px)'
						}}  
					>
						<PlusOutlined />
					</div>
				</MoveBox> */}
				{/* 底栏 */}
				{/* <div 
					className={styles.tabBar}
					style={{
						filter: this.state.isFilter ? 'blur(3px)' : 'blur(0px)'
					}}  
				>
					<div onClick={() => this.checkTab(1)}>
						{this.state.nowPage == 1 ? <CarryOutFilled /> : <CarryOutOutlined />}
					</div>
					<div onClick={() => this.checkTab(2)}>
						{this.state.nowPage == 2 ? <HomeFilled /> : <HomeOutlined />}
					</div>
				</div> */}
			</div>
		);
	}
}

export default connect((state: any) => ({
	...state.index,
	...state.info,
	nowNote: state.now.nowNote
}))(Index);