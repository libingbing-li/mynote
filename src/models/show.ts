import app from '../utils/app';
import indexedDB from '../utils/indexedDB';
import { ModelShow, NoteShow } from '../utils/interface';

export default {
  namespace: 'show',
  state: {
    notedata: [],
  },
  reducers: {
    changeState(state: ModelShow, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *openDB({ payload }: any, { put, call, select }: any) {
      const success: boolean = yield indexedDB.openDataBase();
      if(success) {
        yield put({
          type: 'init'
        });
      }
    },
    *init({ payload }: any, { put, call, select }: any) {
      const state: ModelShow = yield select((state: any) => state.show);
      let dbName = 'NoteShow';
      const notedata: Array<NoteShow> = yield indexedDB.getData(dbName);
      yield put({
        type: 'changeState',
        payload: {
          notedata,
        }
      });
    },
    // *saveNote({ payload }: any, { put, call, select }: any) {
    //   /* 
    //   put: 触发action yield put({ type: 'todos/add', payload: 'Learn Dva'});
    //   call: 调用异步逻辑, 支持Promise const result = yield call(fetch, '/todos');
    //   select: 从state中获取数据,属性名是命名空间的名字 const todos = yield select(state => state.todos);
    //   */
    //   const state: ModelNote = yield select((state: any) => state.note);
    //   let dbName = 'NoteShow';
    //   let success: boolean = false;
    //   if (state.timeId) {
    //     // 编辑
    //     let note: NoteShow = {
    //       timeId: state.timeId,
    //       title: state.title === '请输入标题' ? '' : state.title,
    //       tags: state.tags,
    //       data: payload.data,
    //     };
    //     success = yield indexedDB.put(dbName, note);
    //   } else {
    //     // 添加
    //     let note: NoteShow = {
    //       timeId: new Date().getTime(),
    //       title: state.title === '请输入标题' ? '' : state.title,
    //       tags: state.tags,
    //       data: payload.data,
    //     };
    //     success = yield indexedDB.add(dbName, note);
    //   }
    //   if (success) {
    //     payload();
    //     yield put({
    //       type: 'show/init',
    //     });
    //   } else {
    //     app.info('日记保存失败');
    //   }
    // },
  }
};