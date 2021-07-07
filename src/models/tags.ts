import app from '../utils/app';
import indexedDB from '../utils/indexedDB';
import { ModelTags, NoteShow } from '../utils/interface';

export default {
  namespace: 'tags',
  state: {
    notedata: [],
    scrollTop: 0,
  },
  reducers: {
    changeState(state: ModelTags, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *openDB({ payload }: any, { put, call, select }: any) {
      const success: boolean = yield indexedDB.openDataBase();
      if (success) {
        yield put({
          type: 'init',
        });
      }
    },
    *search({ payload }: any, { put, call, select }: any) {
      const state: ModelTags = yield select((state: any) => state.show);
      let dbName = 'NoteShow';
      let notedata: Array<NoteShow> = [];
      /*
      直接进入：显示当月日记
      选择日期：根据payload时间区间显示
      从日记详情退回：之前是哪个月就是哪个月
      */
      notedata = yield indexedDB.getData(dbName, 'timeId');
      console.log(notedata);
      if (notedata === null) {
        notedata = [];
      }
      let arr: Array<NoteShow> = [];
      notedata.forEach((note: NoteShow) => {
        for (let i = 0; i < note.tags.length; i++) {
          if (note.tags[i].includes(payload.str)) {
            arr.push(note);
            break;
          }
        }
      });
      yield put({
        type: 'changeState',
        payload: {
          notedata: arr,
        },
      });
    },
  },
};
