import app from '../utils/app';
import indexedDB from '../utils/indexedDB';
import { ModelNote, NoteShow } from '../utils/interface';

export default {
  namespace: 'note',
  state: {
    timeId: 0,
    tags: [],
    data: '',
    title: '请输入标题',
  },
  reducers: {
    changeState(state: ModelNote, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *saveNote({ payload }: any, { put, call, select }: any) {
      /* 
      put: 触发action yield put({ type: 'todos/add', payload: 'Learn Dva'});
      call: 调用异步逻辑, 支持Promise const result = yield call(fetch, '/todos');
      select: 从state中获取数据,属性名是命名空间的名字 const todos = yield select(state => state.todos);
      */
      const state: ModelNote = yield select((state: any) => state.note);
      let dbName = 'NoteShow';
      let success: boolean = false;
      if (state.timeId) {
        // 编辑
        let note: NoteShow = {
          timeId: state.timeId,
          title: state.title === '请输入标题' ? '' : state.title,
          tags: state.tags,
          data: payload.data,
        };
        success = yield indexedDB.put(dbName, note);
      } else {
        console.log('进入添加');
        // 添加
        let note: NoteShow = {
          timeId: new Date().getTime(),
          title: state.title === '请输入标题' ? '' : state.title,
          tags: state.tags,
          data: payload.data,
        };
        success = yield indexedDB.add(dbName, note);
      }
      console.log(success);
      if (success) {
        yield put({
          type: 'changeState',
          payload: {
            timeId: 0,
            tags: [],
            data: '',
            title: '请输入标题',
          }
        });
        payload.goBack();
        yield put({
          type: 'show/init',
        });
      } else {
        app.info('日记保存失败');
      }
    },
    *getNoteData({ payload }: any, { put, call, select }: any) {
      const state: ModelNote = yield select((state: any) => state.note);
      let dbName = 'NoteShow';
      const notedata: Array<NoteShow> = yield indexedDB.getData(dbName, 'timeId', Number(payload.timeId));
      console.log(notedata);
      yield put({
        type: 'changeState',
        payload: {
          ...notedata,
        }
      })
    },
    // *remove({ payload }: any, {put, call, select}: any) {
    //   /* 
    //   put: 触发action yield put({ type: 'todos/add', payload: 'Learn Dva'});
    //   call: 调用异步逻辑, 支持Promise const result = yield call(fetch, '/todos');
    //   select: 从state中获取数据,属性名是命名空间的名字 const todos = yield select(state => state.todos);
    //   */
    //   let state = yield select((state: any) => state.index);
    //   if(payload?.data) {
    //     state = payload.data;
    //   }
    //   // 选择库名
    //   let dbStr = '';
    //   switch(state.classId) {
    //     case 1: dbStr = 'foodIngredient'; break;
    //     case 2: dbStr = 'flavoring'; break;
    //     case 3: dbStr = 'convenientFood'; break;
    //   }
    //   const success = yield indexedDB.remove(dbStr, state.time, state.name, state.num);
    //   if(success) {
    //     if(payload) {
    //       if(payload.data) {
    //         payload.close();
    //       } else {
    //         payload();
    //       }
    //     }
    //     yield put({
    //       type: 'info/init',
    //     });
    //     yield put({
    //       type: 'time/init'
    //     });
    //   } else {
    //     app.info('数据删除失败');
    //   }
    // },
  }
};