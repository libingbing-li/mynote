import app from '../utils/app';
import { FoodIngredient, FoodIngredientClass, ModelInfo } from '../utils/interface'; 
import indexedDB from '../utils/indexedDB';

export default {
  namespace: 'info',
  state: {
    foodIngredientClass: [], //食材
    flavoringClass: [], //调味
    convenientFoodClass: [], //方便
    infoNote:'',
    infoTime: 0,
    infoData: null,
    classIdInfo: 0,
  },
  reducers: {
    changeState(state: ModelInfo, { payload }: any) {
      return {...state, ...payload};
    },
  },
  effects: {
    *init({ payload }: any, {put, call, select}: any) {
      let arr = ['foodIngredientClass', 'flavoringClass', 'convenientFoodClass'];
      for(let name of arr) {
        let data = yield indexedDB.getData(name, 'classValue');
        if(data) {
          // 进行小类别区分
        let map = new Map();
        data.forEach((item: FoodIngredientClass) => {
          // 判断item.classValue是否存在于map的主键当中
          if(map.has(item.classValue)) {
            let arr = map.get(item.classValue);
            arr.push(item);
            map.set(item.classValue, arr);
          } else {
            let arr: Array<FoodIngredientClass> = [];
            arr.push(item);
            map.set(item.classValue, arr);
          }
        });
          yield put({
            type: 'changeState',
            payload: {
              [name]: map,
            },
          });
        } 
      }
    },
    *remove({ payload }: any, {put, call, select}: any) {
      const state: ModelInfo = yield select((state: any) => state.info);
      if(state.infoData.num !== 0) {
        app.info('该类仍有实例存在,不可删除');
        return;
      }
      // 选择库名
      let dbStr = '';
      switch(Number(state.classIdInfo)) {
        case 1: dbStr = 'foodIngredientClass'; break;
        case 2: dbStr = 'flavoringClass'; break;
        case 3: dbStr = 'convenientFoodClass'; break;
      }
      const success = yield indexedDB.remove(dbStr, state.infoTime);
      if(success) {
        if(payload) {
          payload();
        }
        yield put({
          type: 'init',
        });
        yield put({
          type: 'time/init'
        });
      } else {
        app.info('数据删除失败');
      }
    },
    *pushNote({ payload }: any, {put, call, select}: any) {
      const state: ModelInfo = yield select((state: any) => state.info);
      if(state.infoNote === '') {
        app.info('请输入备注');
        return;
      }
      // 选择库名
      let dbStr = '';
      switch(Number(state.classIdInfo)) {
        case 1: dbStr = 'foodIngredientClass'; break;
        case 2: dbStr = 'flavoringClass'; break;
        case 3: dbStr = 'convenientFoodClass'; break;
      }
      const success = yield indexedDB.pushClassNote(dbStr, state.infoTime, state.infoNote);
      if(success) {
        yield put({
          type: 'init',
        });
        yield put({
          type: 'time/init'
        });
        payload();
      } else {
        app.info('添加笔记失败');
      }
    }
  }
};