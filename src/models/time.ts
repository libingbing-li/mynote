import app from '../utils/app';
import { FoodIngredient, FoodIngredientClass, ModelTime } from '../utils/interface'; 
import indexedDB from '../utils/indexedDB';

export default {
  namespace: 'time',
  state: {
    foodIngredientNowList: [], //短期
    foodIngredientWeekList: [], //周
    foodIngredientLongList: [], //长期
    flavoringNowList: [], //食材
    flavoringWeekList: [], //菜谱
    flavoringLongList: [], //调味
    convenientFoodNowList: [], //食材
    convenientFoodWeekList: [], //菜谱
    convenientFoodLongList: [], //调味
    timeTime: 0, //当前接受编辑的item的timeid
    classIdTime: 0,
  },
  reducers: {
    changeState(state: ModelTime, { payload }: any) {
      return {...state, ...payload};
    },
  },
  effects: {
    *init({ payload }: any, {put, call, select}: any) {
      const arr = ['foodIngredient', 'flavoring', 'convenientFood'];
      for(let name of arr) {
        const {dataNow, dataWeek, dataLong} = yield indexedDB.getTimeData(name);
        if(dataNow || dataWeek || dataLong) {
          // 根据小类别分类 建造map
          let nowList = new Map();
          dataNow.forEach((item: FoodIngredient) => {
            // 判断item.classValue是否存在于map的主键当中
            if(nowList.has(item.classValue)) {
              let arr = nowList.get(item.classValue);
              arr.push(item);
              nowList.set(item.classValue, arr);
            } else {
              let arr: Array<FoodIngredient> = [];
              arr.push(item);
              nowList.set(item.classValue, arr);
            }
          });
          let weekList = new Map();
          dataWeek.forEach((item: FoodIngredient) => {
            // 判断item.classValue是否存在于map的主键当中
            if(weekList.has(item.classValue)) {
              let arr = weekList.get(item.classValue);
              arr.push(item);
              weekList.set(item.classValue, arr);
            } else {
              let arr: Array<FoodIngredient> = [];
              arr.push(item);
              weekList.set(item.classValue, arr);
            }
          });
          let longList = new Map();
          dataLong.forEach((item: FoodIngredient) => {
            // 判断item.classValue是否存在于map的主键当中
            if(longList.has(item.classValue)) {
              let arr = longList.get(item.classValue);
              arr.push(item);
              longList.set(item.classValue, arr);
            } else {
              let arr: Array<FoodIngredient> = [];
              arr.push(item);
              longList.set(item.classValue, arr);
            }
          });
          yield put({
            type: 'changeState',
            payload: {
              [`${name}NowList`]: nowList,
              [`${name}WeekList`]: weekList,
              [`${name}LongList`]: longList,
            },
          });
        }
      }
    },
    *itemNumReduce({ payload }: any, {put, call, select}: any) {
      console.log(123);
      const state: ModelTime = yield select((state: any) => {return{ ...state.time, isBasket: state.index.isBasket} });
      // 选择库名
      let time = state.timeTime;
      let classId = state.classIdTime;
      let num = undefined;
      let dbStr = '';
      if(payload?.item) {
        // +1,basket那边的请求
        time = payload.item.time;
        classId = payload.item.classId;
        num = -1;
      }
      switch(classId) {
        case 1: dbStr = 'foodIngredient'; break;
        case 2: dbStr = 'flavoring'; break;
        case 3: dbStr = 'convenientFood'; break;
      }
      const success = yield indexedDB.itemReduce(dbStr, time, num);
      if(success) {
        yield put({
          type: 'info/init',
        });
        yield put({
          type: 'init'
        });
      } else {
        app.info('数据减少失败');
      };
    },
  }
}