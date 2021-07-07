import app from '../utils/app';
import indexedDB from '../utils/indexedDB';
import { ModelShow, NoteShow } from '../utils/interface';

export default {
  namespace: 'show',
  state: {
    notedata: [],
    minTime: 0,
    maxTime: 0,
    scrollTop: 0,
  },
  reducers: {
    changeState(state: ModelShow, { payload }: any) {
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
    *init({ payload }: any, { put, call, select }: any) {
      const state: ModelShow = yield select((state: any) => state.show);
      let dbName = 'NoteShow';
      let notedata: Array<NoteShow> = [];
      let minTime = state.minTime;
      let maxTime = state.maxTime;
      /*
      直接进入：显示当月日记
      选择日期：根据payload时间区间显示
      从日记详情退回：之前是哪个月就是哪个月
      */
      if (payload === undefined) {
        if (minTime === 0 || maxTime === 0) {
          // 直接进入
          // else 从详情返回，可直接使用state的数据
          if (new Date().getMonth() === 11) {
            // 选中12月
            minTime = new Date(`${new Date().getFullYear()}-12`).getTime();
            maxTime = new Date(`${new Date().getFullYear() + 1}-1`).getTime();
          } else {
            minTime = new Date(
              `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
            ).getTime();
            maxTime = new Date(
              `${new Date().getFullYear()}-${new Date().getMonth() + 2}`,
            ).getTime();
          }
        }
      } else {
        //选中了日期
        minTime = payload.minTime;
        maxTime = payload.maxTime;
      }
      notedata = yield indexedDB.getData(
        dbName,
        'timeId',
        undefined,
        minTime,
        maxTime,
      );
      if (notedata === null) {
        notedata = [];
      }
      yield put({
        type: 'changeState',
        payload: {
          notedata,
          minTime,
          maxTime,
        },
      });
    },
  },
};
