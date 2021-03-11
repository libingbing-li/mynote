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
import { FoodIngredient, FoodIngredientClass, ModelIndex } from '../../utils/interface';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/sidebar.less';

interface IProps {
    str: string;
    close: () => void;
    style: any;
    isLocking: boolean;
    locking: () => void;
}
class Sidebar extends React.Component<IProps & ModelIndex & { infoNote: string; nowNote: string; dispatch: any }> {
    // 设置用户名

    // 导入

    // 导出

    render() {
        return (
            <div style={this.props.style} id="sidebar" className={styles.sidebar}>
                <div className={styles.title}>
                    MyNote
                </div>
                <div>
                    日光
                    {/* {this.props.username} */}
                </div>
                <div>
                    <VerticalAlignBottomOutlined onClick={this.saveFile}/>
                </div>
                <div>
                    <VerticalAlignTopOutlined onClick={this.importFile}/>
                </div>
                <div className={styles.description}>
                    My系列App日记本<br/>@libingbing-li开发
                </div>
            </div>
        );
    }
}
export default connect((state: any) => ({
    ...state.index,
}))(Sidebar);

