import React from 'react';
import { history } from 'umi';
import BraftEditor from 'braft-editor';
import { ControlType } from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import { connect, EffectsCommandMap, Model } from 'dva';
import { Menu, Dropdown } from 'antd';
import {
  LeftOutlined,
  CheckOutlined,
  HighlightOutlined,
  PlusOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { ModelNote } from '../../utils/interface';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/note.less';
import app from '@/utils/app';

// 编辑器的控件
const controls: Array<ControlType> = [
  'text-color',
  'bold',
  'italic',
  'underline',
  'strike-through',
  'remove-styles',
  'text-align',
  'headings',
  'list-ul',
  'list-ol',
  'hr',
];

// // 详情-编辑-下拉菜单
// const menu = (
//   <Menu>
//     <Menu.Item key="0">
// 			<CheckOutlined onClick={this.saveNote} />
//     </Menu.Item>
//     <Menu.Item key="1">
// 			<DeleteOutlined/>
//     </Menu.Item>
//   </Menu>
// );

interface IState {
  isEdit: boolean;
  // 创建一个空的editorState作为初始值
  editorState: any;
  newtag: string;
  tags: Array<string>;
}

// 该页面用于编辑展示日记
class Note extends React.Component<ModelNote & { dispatch: any }> {
  state: IState = {
    isEdit: true,
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(null),
    newtag: '',
    tags: [],
  };

  componentDidMount() {
    const timeId = history.location.query?.timeId;
    if (!(timeId === 'null')) {
      // 详情查看
      // 在此处model数据更新
      this.props.dispatch({
        type: 'note/getNoteData',
        payload: {
          timeId: history.location.query?.timeId,
        },
      });
      this.setState({
        isEdit: false,
      });
    }
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    // 由于dispatch是异步操作，所以此时的props是上一次的props
    this.setState({
      editorState: BraftEditor.createEditorState(this.props.data),
    });
  }

  //在本处获取新的props并更新
  componentWillReceiveProps = (nextProps: any) => {
    // 此时异步操作完成，更改model数据后，在这个生命周期函数中发现props更新(此时是真正需要的props值)，然后更新state中的数据
    if (nextProps.data === '') {
      return;
    }
    this.setState({
      editorState: BraftEditor.createEditorState(nextProps.data),
    });
    if (nextProps.tags.length === 0) {
      return;
    }
    this.setState({
      tags: nextProps.tags,
    });
  };

  saveNote = () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    this.props.dispatch({
      type: 'note/saveNote',
      payload: {
        data: this.state.editorState.toHTML().toString(),
        goBack: history.goBack,
        tags: this.state.tags,
      },
    });
  };

  removeNote = () => {
    this.props.dispatch({
      type: 'note/removeNote',
      payload: {
        goBack: history.goBack,
      },
    });
  };

  handleEditorChange = (editorState: any) => {
    this.setState({ editorState });
  };

  changeModelState = (proName: string, data: any) => {
    this.props.dispatch({
      type: 'note/changeState',
      payload: {
        [proName]: data,
      },
    });
  };

  // 添加tag
  addTag = () => {
    let tags = this.state.tags;
    tags.push(this.state.newtag);
    this.setState({
      newtag: '',
      tags,
    });
  };

  // 删除tag
  deleteTag = (index: number) => {
    if (!this.state.isEdit) {
      return;
    }
    let tags = this.state.tags;
    tags.splice(index, 1);
    this.setState({
      tags,
    });
  };

  // 详情-编辑-下拉菜单
  menu = (
    <Menu>
      <Menu.Item key="0" style={{ textAlign: 'center' }}>
        <CheckOutlined style={{ margin: 0 }} onClick={this.saveNote} />
      </Menu.Item>
      <Menu.Item key="1" style={{ textAlign: 'center' }}>
        <DeleteOutlined style={{ margin: 0 }} onClick={this.removeNote} />
      </Menu.Item>
    </Menu>
  );

  // 后退清空数据
  back = () => {
    this.props.dispatch({
      type: 'note/changeState',
      payload: {
        timeId: 0,
        tags: [],
        data: '',
        title: '请输入标题',
      },
    });
    history.goBack();
  };

  render() {
    return (
      <div className={styles.note}>
        <div className={styles.title}>
          <LeftOutlined onClick={this.back} />
          <input
            type="text"
            value={this.props.title}
            onChange={(e) => {
              this.changeModelState('title', e.target.value);
            }}
          ></input>
          {history.location.query?.timeId === 'null' ? (
            <CheckOutlined onClick={this.saveNote} />
          ) : this.state.isEdit ? (
            // <EllipsisOutlined onClick/>
            <Dropdown overlay={this.menu} trigger={['click']}>
              <EllipsisOutlined />
            </Dropdown>
          ) : (
            <HighlightOutlined
              onClick={() => this.setState({ isEdit: true })}
            />
          )}
        </div>
        <div
          className={styles.tags}
          style={{
            borderBottom: this.state.isEdit ? 'none' : 'solid 1px #eee',
            paddingBottom: this.state.isEdit ? 0 : '5px',
          }}
        >
          {this.state.tags.length === 0 ? (
            <span>暂无标签</span>
          ) : (
            this.state.tags.map((tag: string, index: number) => {
              return (
                <span key={index} onClick={() => this.deleteTag(index)}>
                  {tag}
                </span>
              );
            })
          )}
        </div>
        <div
          className={styles.addTag}
          style={{ display: this.state.isEdit ? 'block' : 'none' }}
        >
          <span>addTag: </span>
          <input
            type="text"
            value={this.state.newtag}
            onChange={(e) => {
              this.setState({ newtag: e.target.value });
            }}
          />
          <PlusOutlined onClick={this.addTag} />
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
