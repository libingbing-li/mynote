import React from 'react';
import { connect, EffectsCommandMap, Model } from 'dva';
import {
	UnorderedListOutlined,
	HighlightOutlined,
	HighlightFilled
} from '@ant-design/icons';
import SlideBox from '@/common-components/SlideBox';
import TopBox from '../modal/topBox';
import Sidebar from '../modal/sidebar';
import { FoodIngredient, FoodIngredientClass, ModelIndex, RecordNote } from '../../utils/interface';
import indexedDB from '../../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import styles from './index.less';
import app from '@/utils/app';

interface IState {
}


// 用于展示tag数和时间的分布
class Satisfy extends React.Component<ModelIndex & {infoNote: string; nowNote: string; dispatch: any}> {
	state: IState = {
	}


	render() {
		return (
      <div>
        新建
      </div>
		);
	}
}

export default connect((state: any) => ({
}))(Satisfy);