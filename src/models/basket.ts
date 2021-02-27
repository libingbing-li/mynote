import app from '../utils/app';
import { ModelBasket } from '../utils/interface'; 
import indexedDB from '../utils/indexedDB';


export default {
  namespace: 'basket',
  state: {
    nowBasket: 1, //1buy 2morning 3afternoon 4evening
    basketBuy: [],
    basketMorning: [],
    basketAfternoon: [],
    basketEvening: [],
  },
  reducers: {
    changeState(state: ModelBasket, { payload }: any) {
      return {...state, ...payload};
    },
  },
  effects: {
    *add({ payload }: any, {put, call, select}: any) {
      const state: ModelBasket = yield select((state: any) => state.basket);
      let list = ['basketBuy', 'basketMorning', 'basketAfternoon', 'basketEvening'];
      let arr: any = JSON.parse(localStorage.getItem(list[state.nowBasket - 1])) || [];
      arr.push({
        name: payload.item.name,
        time: payload.item.time,
        classId: payload.item.classId,
      });
      localStorage.setItem(list[state.nowBasket - 1], JSON.stringify(arr));
      yield put({
        type: 'init',
      });
      yield put({
        type: 'now/init',
      });
    },
    *remove({ payload }: any, {put, call, select}: any) {
      const state: ModelBasket = yield select((state: any) => state.basket);
      let list = ['basketBuy', 'basketMorning', 'basketAfternoon', 'basketEvening'];     
      let arr: any = JSON.parse(localStorage.getItem(list[state.nowBasket - 1])) || [];
      arr.splice(payload.index, 1);
      localStorage.setItem(list[state.nowBasket - 1], JSON.stringify(arr));
      yield put({
        type: 'init',
      });
      yield put({
        type: 'now/init',
      });
    },
    *init({ payload }: any, {put, call, select}: any) {
      let arr = ['basketBuy', 'basketMorning', 'basketAfternoon', 'basketEvening'];
      for(let name of arr) {
        let arr: any = JSON.parse(localStorage.getItem(name)) || [];
        if(arr) {
          yield put({
            type: 'changeState',
            payload: {
              [name]: arr
            },
          });
        } 
      }
    },
  }
};