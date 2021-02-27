import app from '../utils/app';
import { ModelBasket, Item, ModelNow, TaskItem, SurpriseDate, SurpriseItem } from '../utils/interface'; 
import indexedDB from '../utils/indexedDB';
import time from './time';


export default {
  namespace: 'now',
  state: {
    recordList: [],
    taskList: [],
    surpriseList: [],
    nowNote: '',
    nowTime: 0,
    nowClassId: 1,
    nowItemClassId: 1,
    nowData: null, //需要edit的原数据
  },
  reducers: {
    changeState(state: ModelBasket, { payload }: any) {
      return {...state, ...payload};
    },
  },
  effects: {
    *openDB({ payload }: any, {put, call, select}: any) {
      const success = yield indexedDB.openDataBase();
      if(success) {
        yield put({
          type: 'init'
        });
      }
    },
    *init({ payload }: any, {put, call, select}: any) {

      // 获取
      const today = new Date().setHours(0,0,0,0);
      const oneDay = 24 * 60 * 60 * 1000;
      let list: any = yield indexedDB.getData('recordClass','time', undefined, undefined, undefined, 'prev');
      if(list === null){
        list = [];
      } else {
        const getTimeStr = (time: number) => {
          const nowStr = ['今天', '昨天']
          const weekStr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
          for(let i = 0; i < 7; i++) {
            if(today - i * oneDay < time && time < today - (i - 1) * oneDay) {
              if(i < 2){
                return nowStr[i];
              } else if(i < 7) {
                const week = new Date(time).getDay()
                return weekStr[week];
              }
              break;
            }
          }
        }
        let timeMap = new Map();
        list.forEach((item: any, index: number) => {
          for(let i = 0; i < 7; i++) {
            if(today - i * oneDay < item.time && item.time < today - (i - 1) * oneDay) {
              let str = 'time'+i;
              if(timeMap.has(str)){
                let arr = timeMap.get(str);
                arr.push(item);
                timeMap.set(str, arr);
              } else {
                timeMap.set(str, [item]);
              }
              break;
            }
          }
        });
        let listCopy: any = [];
        for(let i = 0; i < 7; i++) {
          let str = 'time'+i;
          if(timeMap.has(str)){
            let arr = timeMap.get(str);
            arr.unshift({
              timeStr: getTimeStr(arr[0].time),
              time: arr[0].time+1,
            });
            listCopy = [...listCopy, ...arr];
          }
        }
        list = listCopy
      }
      
      let arr = ['basketBuy', 'basketMorning', 'basketAfternoon', 'basketEvening'];
      let noArr = true;
      arr.forEach((item, index) => {
        const local = localStorage.getItem(item);
        if(local){
          if(JSON.parse(local)?.length !== 0) {
            const data = {
              clazz: index + 1,
              time: new Date().getTime() + index,
              list: JSON.parse(local),
              note: '——=w=~',
              isCheck: false,
            }
            list.unshift(data);
            noArr = false;
          }
        }
      });
      if(!noArr) {
        list.unshift({
          timeStr: '当前',
          time: 0,
        });
      }

      // 获取任务和特殊日
      let taskList: Array<TaskItem> = yield indexedDB.getData('taskClass');
      let surpriseList: Array<SurpriseItem> = yield indexedDB.getData('surpriseClass');
      if(taskList === null) {
        taskList = [];
      }
      const myDay: SurpriseItem = {
        name: '生理期',
        classId: 0,
        time: 0,
        isOnGoing: false,
        dateList: [],
      }
      if(surpriseList === null) {
        surpriseList = [myDay]
        const success = yield indexedDB.add('surpriseClass', myDay);
      } else if(surpriseList[0].classId !== 0) {
        surpriseList.unshift(myDay);
        const success = yield indexedDB.setData('surpriseClass', surpriseList)
      }

      // 修改数据
      yield put({
        type: 'changeState',
        payload: {
          recordList: list,
          taskList,
          surpriseList,
        },
      });
    },
    *checkItemBox({ payload }: any, {put, call, select}: any) {
      const state: ModelBasket = yield select((state: any) => state.basket);
      let list = ['basketBuy', 'basketMorning', 'basketAfternoon', 'basketEvening'];     
      let arr: any = [];
      for(let item of payload.itemBox.list) {
        arr.push(item);
      }
      payload.itemBox.list = arr;
      payload.itemBox.isCheck = true;
      const success = yield indexedDB.add('recordClass', payload.itemBox);
      if(success) {
        localStorage.setItem(list[payload.itemBox.clazz - 1], JSON.stringify([]));
        yield put({
          type: 'init',
        });
      } else {
        app.info('操作失败');
      }
    },
    *addNote({ payload }: any, {put, call, select}: any) {
      const state: ModelNow = yield select((state: any) => state.now);
      if(state.nowNote === '') {
        app.info('请输入笔记');
        return;
      }
      console.log(state);
      const success = yield indexedDB.pushRecordNote('recordClass', state.nowNote);
      if(success) {
        yield put({
          type: 'init',
        });
        payload();
      } else {
        app.info('添加笔记失败');
      }
    },
    *editRecordNote({ payload }: any, {put, call, select}: any) {
      const state: ModelNow = yield select((state: any) => state.now);
      const data = {
        noteStr: state.nowNote,
        time: state.nowTime,
      }
      const success = yield indexedDB.put('recordClass', data);
      if(success) {
        yield put({
          type: 'init',
        });
        payload();
      }
    },
    *removeRecordNote({ payload }: any, {put, call, select}: any) {
      const state: ModelNow = yield select((state: any) => state.now);
      const success = yield indexedDB.remove('recordClass', state.nowTime);
      if(success) {
        yield put({
          type: 'init',
        });
        payload();
      }
    },
    *addTask({ payload }: any, {put, call, select}: any) {
      const state: ModelNow = yield select((state: any) => state.now);
      if(state.nowNote === '') {
        app.info('请输入任务名称');
        return;
      }
      const data: TaskItem = {
        name: state.nowNote,
        classId: state.nowItemClassId,
        time: new Date().getTime(),
        num: 0,
      }
      const success = yield indexedDB.add('taskClass', data);
      if(success) {
        yield put({
          type: 'init',
        });
        payload();
      } else {
        app.info('添加任务失败');
      }
    },
    *editTask({ payload }: any, {put, call, select}: any) {
      const state: ModelNow = yield select((state: any) => state.now);
      const data = state.nowDate;
      data.classId = state.nowItemClassId;
      data.name = state.nowNote;
      const success = yield indexedDB.put('taskClass', data);
      if(success) {
        yield put({
          type: 'init',
        });
        payload();
      }
    },
    *removeTask({ payload }: any, {put, call, select}: any) {
      const state: ModelNow = yield select((state: any) => state.now);
      const success = yield indexedDB.remove('taskClass', state.nowTime);
      if(success) {
        yield put({
          type: 'init',
        });
        payload();
      }
    },
    *addTaskNum({ payload }: any, {put, call, select}: any) {
      console.log('addTaskNum');
      const state: ModelNow = yield select((state: any) => state.now);
      const data = payload.task;
      data.num++;
      const success = yield indexedDB.put('taskClass', data);
      if(success) {
        yield put({
          type: 'init',
        });
      }
    },
    *addSurprise({ payload }: any, {put, call, select}: any) {
      const state: ModelNow = yield select((state: any) => state.now);
      if(state.nowNote === '') {
        app.info('请输入特殊日名称');
        return;
      }
      const data: SurpriseItem = {
        name: state.nowNote,
        classId: state.nowItemClassId,
        time: new Date().getTime(),
        isOnGoing: false,
        dateList: [],
      }
      const success = yield indexedDB.add('surpriseClass', data);
      if(success) {
        yield put({
          type: 'init',
        });
        payload();
      } else {
        app.info('添加特殊日失败');
      }
    },
    *editSurprise({ payload }: any, {put, call, select}: any) {
      const state: ModelNow = yield select((state: any) => state.now);
      const data = state.nowDate;
      data.classId = state.nowItemClassId;
      data.name = state.nowNote;
      const success = yield indexedDB.put('surpriseClass', data);
      if(success) {
        yield put({
          type: 'init',
        });
        payload();
      }
    },
    *removeSurprise({ payload }: any, {put, call, select}: any) {
      const state: ModelNow = yield select((state: any) => state.now);
      const success = yield indexedDB.remove('surpriseClass', state.nowTime);
      if(success) {
        yield put({
          type: 'init',
        });
        payload();
      }
    },
    *enterSurpriseOnGoing({ payload }: any, {put, call, select}: any) {
      const state: ModelNow = yield select((state: any) => state.now);
      const data: SurpriseItem = payload.surprise;
      data.isOnGoing = !payload.surprise.isOnGoing;
      if(data.isOnGoing) {
        data.dateList.push({
          firstDate: new Date().getTime(),
          endDate: 0,
        });
      } else {
        data.dateList[data.dateList.length - 1].endDate = new Date().getTime();
      }
      const success = yield indexedDB.put('surpriseClass', data);
      if(success) {
        yield put({
          type: 'init',
        });
      }
    },
  }
};