import app from './app';
import { FoodIngredient, FoodIngredientClass } from './interface'; 
// 使用indexedDB数据库保存数据,全部为异步操作,所以需要返回promise以便进行后续操作(类似发请求,本处就为app的后台)

// 实例的存储
const list = [
  // 食材
  ['foodIngredient', [
    'time',
    'classValue',
    'name',
    'day',
    'num',
    'weight',
    'value',
    'note',
  ]],
  // 调味
  ['flavoring', [
    'time',
    'classValue',
    'name',
    'day',
    'num',
    'weight',
    'value',
    'note',
  ]],
  // 方便食品
  ['convenientFood', [
    'time',
    'classValue',
    'name',
    'day',
    'num',
    'weight',
    'value',
    'note',
  ]],
];

const objectStoreNamesList = new Map();
list.forEach(([key, value]) => objectStoreNamesList.set(key, value));

// 类别的存储
const classList = [
  ['foodIngredientClass', [
    'time',
    'classValue',
    'name',
    'day',
    'minValue',
    'maxValue',
  ]],
  ['flavoringClass', [
    'time',
    'classValue',
    'name',
    'day',
    'minValue',
    'maxValue',
  ]],
  ['convenientFoodClass', [
    'time',
    'classValue',
    'name',
    'day',
    'minValue',
    'maxValue',
  ]],
  // 存储记录,只有time作为键值
  ['recordClass', [
    'time',
  ]],
  ['surpriseClass', [
    'time',
  ]],
  ['taskClass', [
    'time',
  ]],
]; 

const objectStoreNamesClassList = new Map();
classList.forEach(([key, value]) => objectStoreNamesClassList.set(key, value));


class IndexedDB {
  database: IDBDatabase | undefined = undefined; //数据库
  // 构造方法
  constructor() {
    this.openDataBase();
  }

  // 打开数据库 
  openDataBase() {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      // 在此新建数据库并创建好所有需要的表(对象仓库)和数据结构
    let request = window.indexedDB.open('MyFood'); //一个打开数据库的请求
    request.onupgradeneeded = (e: any) => {
      this.database = e.target.result;
      // 在此进行数据结构的构造-存放实例的表
      for(let [name, indexNames] of objectStoreNamesList) {
        let objectStore = this.database?.createObjectStore(name, {keyPath: 'time'}); //设定时间戳为主键
        indexNames.forEach((indexName: string) => {
          objectStore?.createIndex(indexName, indexName, {unique: false}); //创建索引
        });
      }
      // 存放类的表
      for(let [nameClass, indexNamesClass] of objectStoreNamesClassList) {
        let objectStoreClass = this.database?.createObjectStore(nameClass, {keyPath: 'time'}); //设定时间戳为主键
        indexNamesClass.forEach((indexName: string) => {
          objectStoreClass?.createIndex(indexName, indexName, {unique: false}); //创建索引
        });
      }
      console.log('新建数据库');
      resolve(true);
    }
    request.onsuccess = (e: any) => {
      // 打开数据库
      this.database = e.target.result;
      console.log('数据库已打开');
      resolve(true);
    }
    request.onerror = (e: any) => {
      // 失败了
      console.log('打开本地数据库失败');
      app.info('打开本地数据库失败');
      resolve(false);
    }
    });
    return promise;
  }






  // 增删查改
  // 添加数据 - 实例: 添加类,成功再添加实例
  add(name: string, data: any, isSetAllDate: boolean = false) {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      // 添加方法
      const add = () => {
        let objectStore = _this.database?.transaction(name, 'readwrite').objectStore(name);
        let request = objectStore?.add(data); 
        if(request) {
          request.onsuccess = () => {
            console.log('add-success');
            resolve(true);
          }
          request.onerror = () => {
            console.log('add-error');
            resolve(false);
          }
        }
      }
      // 判断是类还是实例,是实例就再添加类 -- 如果是导入则直接add
      if(name.indexOf('Class') == -1 && !isSetAllDate) {
        const p = _this.addClass(name, data);
        p.then((success) => {
          if(success) {
            // 类添加成功 - 添加到实例
            add();
          } else {
            resolve(false);
          }
        });
      } else {
        // 添加到实例
        add();
      }
    });
    return promise;
  }

  // 更新数据 - time
  put(name: string, newData: any, data?: any) {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      // 更新方法
      const put = () => {
        let objectStore = _this.database?.transaction(name, 'readwrite').objectStore(name);
        let request = objectStore?.put(newData); // 根据对象仓库的主键更新
        if(request) {
          request.onsuccess = () => {
            resolve(true);
            console.log('put-success');
          }
          request.onerror = () => {
            resolve(false);
            console.log('put-error');
          }
        }
      }
      // 判断是类还是实例,是实例就再添加类
      if(name.indexOf('Class') == -1 && data) {
        if(newData.name === data.name) {
          const p = _this.putClass(name, newData, data);
          p.then((success) => {
            if(success) {
              put();
            } else {
              resolve(false);
            }
          });
        } else {
          // 如果名字不同的话,就认为是创建了一个新类
          let time = new Date().getTime();
          const p = _this.addClass(name, {...newData, time});
          p.then((success) => {
            if(success) {
              put();
            } else {
              resolve(false);
            }
          });
        }
      } else {
        put();
      }
    });
    return promise;
  }

  // 添加类 -- 根据新建的实例更新或添加类数据
  addClass = (name: string, data: any) => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      // 根据实例数据建立类数据
    let dataClass = {
      time: data.time,
      classValue: data.classValue,
      name: data.name,
      day: data.day,
      minValue: data.value / data.weight * 500,
      maxValue: data.value / data.weight * 500,
      notes: data.note ? [{note: data.note, time: data.time}] : [],
      num: data.num,
    }
    // 遍历类表查看是否已存在该类 -- 名称
    // 获取表 IDBObejectStore
    let objectStore = _this.database?.transaction(name+'Class').objectStore(name+'Class');
    // 获取索引表 IDBIndex 也是一个对象仓库,但主键可以是重复的其他属性
    let objectStoreIndex = objectStore?.index('name');
    // 获取关键字 IDBKeyRange 限定范围
    let keyRangeValue = IDBKeyRange.only(data.name);
    // 获取游标请求结果
    let request = objectStoreIndex?.openCursor(keyRangeValue);
    if(request) {
      request.onsuccess = (e: any) => {
        const cursor = e.target.result;
        if(cursor) {
          //存在这个数据, 进行更新
          dataClass.time = cursor.value.time;
          dataClass.notes = cursor.value.notes;
          if(data.note !== '') {
            dataClass.notes.push({note: data.note, time: data.time});
          }
          dataClass.num = cursor.value.num + data.num;
          // dataClass.classValue = cursor.value.classValue; 小类别是否更新
          if(dataClass.minValue > cursor.value.minValue) {
            dataClass.minValue = cursor.value.minValue;
          }
          if(dataClass.maxValue < cursor.value.maxValue) {
            dataClass.maxValue = cursor.value.maxValue;
          }
          const p = _this.put(name+'Class', dataClass);
          p.then((success) => {
            if(success) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        } else {
          //不存在数据 进行新建
          const p = _this.add(name+'Class', dataClass);
          p.then((success) => {
            if(success) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        }
      }
      request.onerror = () => {
        console.log('addClass-error');
        resolve(false);
      }
    }
    });
    return promise;
  }

  // 查找类并更新 -- 根据实例
  putClass = (name: string, newData: any, data: any) => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      // 获取表 IDBObejectStore
    let objectStore = _this.database?.transaction(name+'Class').objectStore(name+'Class');
    // 获取索引表 IDBIndex 也是一个对象仓库,但主键可以是重复的其他属性
    let objectStoreIndex = objectStore?.index('name');
    // 获取关键字 IDBKeyRange 限定范围
    let keyRangeValue = IDBKeyRange.only(data.name);
    // 获取游标请求结果
    let request = objectStoreIndex?.openCursor(keyRangeValue);
    if(request) {
      request.onsuccess = (e: any) => {
        const cursor = e.target.result;
        if(cursor) {
          //存在这个数据, 进行更新
        // 根据实例数据建立类数据
        if(newData.note !== data.note) {
          cursor.value.notes.push({note: newData.note, time: newData.time});
        }
    let dataClass = {
      time: cursor.value.time,
      classValue: newData.classValue,
      name: cursor.value.name,
      day: newData.day,
      minValue: newData.value / newData.weight * 500,
      maxValue: newData.value / newData.weight * 500,
      notes: cursor.value.notes,
      num: cursor.value.num + newData.num - data.num,
    }
    console.log('cursor.value.num', typeof cursor.value.num);
    console.log('newData.num', typeof newData.num);
    console.log('data.num', typeof data.num);
        dataClass.classValue = cursor.value.classValue;
        if(dataClass.minValue > cursor.value.minValue) {
          dataClass.minValue = cursor.value.minValue;
        }
        if(dataClass.maxValue < cursor.value.maxValue) {
          dataClass.maxValue = cursor.value.maxValue;
        }
        const p = _this.put(name+'Class', dataClass);
        p.then((success) => {
          if(success) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
        }
        
      }
      request.onerror = () => {
        console.log('putClass-error');
        resolve(false);
      }
    }
    });
    return promise;
  } 

  // 删除
  remove = (name: string, time: number, dataName?: string, dataNum?: number) => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      // 删除方法
      const remove = () => {
        let objectStore = _this.database?.transaction(name, 'readwrite').objectStore(name);
        let request = objectStore?.delete(time); // 根据对象仓库的主键更新
        if(request) {
          request.onsuccess = () => {
            resolve(true);
            console.log('remove-success');
          }
          request.onerror = () => {
            resolve(false);
            console.log('remove-error');
          }
        }
      }
      // 判断是类还是实例,是实例就对类进行更新
      if(name.indexOf('Class') == -1 && dataName && dataNum) {
        const p = _this.classReduce(name+'Class', dataName, dataNum);
        p.then((success) => {
          if(success) {
            // 类添加成功 - 添加到实例
            remove();
          } else {
            resolve(false);
          }
        });
      } else {
        // 删除类
        remove();
      }
    });
    return promise;
  }






  // 其他操作
  // 为类添加note
  pushClassNote = (name: string, time: number, note: string) => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      let objectStore = this.database?.transaction(name).objectStore(name);
      let result = objectStore?.get(time);
      if(result) {
        result.onsuccess = (e: any) => {
          const data = e.target.result;
          data.notes.push({note: note, time: new Date().getTime()});
          const p = this.put(name, data);
          p.then((success) => {
            if(success) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        }
        result.onerror = (e: any) => {
          resolve(false);
          console.log('pushClassNote-error');
        }
      }
    });
    return promise;
  };

  // now - addnote
  pushRecordNote = (name: string, note: string) => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      let data = {
        noteStr: note,
        time: new Date().getTime(),
      }
      const p = this.add(name, data);
      p.then((success) => {
        if(success) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
    return promise;
  };

  // 对类的num-删除了的实例数字
  classReduce = (name: string, className: string, num: number) => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      let objectStore = this.database?.transaction(name).objectStore(name);
      let objectStoreIndex = objectStore?.index('name');
      let result = objectStoreIndex?.get(className);
      if(result) {
        result.onsuccess = (e: any) => {
          // 获取到了这个实例
          const data = e.target.result;
          // 接下来先对类-1 再实例
          data.num = data.num - num;
          const p = this.put(name, data);
          p.then((success) => {
            if(success) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        }
        result.onerror = (e: any) => {
          resolve(false);
          console.log('classReduce-error');
        }
      }
    });
    return promise;
  }
  // 为实例num 减某个数量
  itemReduce = (name: string, time: number, num: number = 1) => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      let objectStore = this.database?.transaction(name).objectStore(name);
      let result = objectStore?.get(time);
      if(result) {
        result.onsuccess = (e: any) => {
          // 获取到了这个实例
          const data = e.target.result;
          // 接下来先对类-1 再实例
          const p = this.classReduce(name+'Class', data.name, num);
          p.then((success) => {
            if(success){
              // 对实例进行修改
              data.num = data.num - num;
              data.weight = (data.weight / (data.num + num)) * data.num;
              const p = this.put(name, data);
              p.then((success) => {
                if(success) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              });
            } else {
              resolve(false);
            }
          });
        }
        result.onerror = (e: any) => {
          resolve(false);
          console.log('itemReduce-error');
        }
      }
    });
    return promise;
  }






  // set
  // 清空原本的数据库,将文件中的内容覆盖
  setIndexedDB = (data: any) => {
    app.info('上传文件功能开发中...');
  }

  
  // get 返回数据
  // 获取最新添加的同名数据,并返回 -- name
  getOtherInfo = (name: string, itemName: string) => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      let objectStore = this.database?.transaction(name).objectStore(name);
      let objectStoreIndex = objectStore?.index('name');
      // 获取关键字 IDBKeyRange 限定范围
      let keyRangeValue = IDBKeyRange.only(itemName);
      let request = objectStoreIndex?.openCursor( keyRangeValue, 'prev'); //倒序游标
      if(request) {
        request.onsuccess = (e: any) => {
          const cursor = e.target.result;
          if(cursor) {
            resolve(cursor.value);
          } else {
            // 没有实例,搜索类获取数据
            let objectStore = this.database?.transaction(name+'Class').objectStore(name+'Class');
            let objectStoreIndex = objectStore?.index('name');
            // 获取关键字 IDBKeyRange 限定范围
            let keyRangeValue = IDBKeyRange.only(itemName);
            let request = objectStoreIndex?.openCursor( keyRangeValue, 'prev'); //倒序游标
            if(request) {
              request.onsuccess = (e: any) => {
                const cursor = e.target.result;
                if(cursor) {
                  let data = {
                    classValue: cursor.value.classValue,
                    day: cursor.value.day,
                    value: cursor.value.minValue,
                    weight: 500,
                  };
                  resolve(data);
                } else {
                  resolve(null);
                }
              }
              request.onerror = () => {
                resolve(null);
              }
            }
          }
        }
        request.onerror = () => {
          console.log('getOtherInfo-error');
        }
      }
    });
    return promise;
  }

  // 获取筛选/全部数据
  getData = (name: string, indexName?: string, key?: any, minKey?: any, maxKey?: any, prev?: any) => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      let objectStore = this.database?.transaction(name).objectStore(name);
      let objectStoreIndex = indexName ? objectStore?.index(indexName) : objectStore;
      // 获取关键字 IDBKeyRange 限定范围
      let keyRangeValue = key ? IDBKeyRange.only(key) : (
        minKey || maxKey ? (
          minKey && maxKey ? IDBKeyRange.bound(minKey, maxKey) : (
            minKey ? IDBKeyRange.lowerBound(minKey) : IDBKeyRange.upperBound(maxKey)
          )
        ) : undefined
      );
      let request = objectStoreIndex?.count(keyRangeValue);
      let length = 0;
      if(request) {
        request.onsuccess = (e: any) => {
          length = e.target.result;
          if(length) {
            let request = objectStoreIndex?.openCursor(keyRangeValue, prev);
            let data: any = []; let i = 0;
            if(request) {
              request.onsuccess = (e: any) => {
                const cursor = e.target.result;
                if(cursor) {
                  data.push(cursor.value);
                  i++;
                  if(i < length) {
                    cursor.continue();
                  } else {
                    resolve(data);
                  }
                } 
              }
              request.onerror = () => {
                console.log('getData-cursor-error');
              }
            }
          } else {
            resolve(null);
          }
        }
        request.onerror = () => {
          console.log('getData-count-error');
        }
      }
    });
    return promise;
  }

  // 获取保鲜度数据 临期-一周-长期
  /* 
  算法: 遍历食材-保鲜度索引表
  首先获取1-2区间直接赋予临期
  其次获取3-7区间,根据创建时间和保鲜度决定赋予临期还是一周
  其次获取8+区间,根据创建时间和保鲜度决定赋予一周还是长期
  */
  getTimeData = (name: string, indexName: string = 'day') => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      let objectStore = this.database?.transaction(name).objectStore(name);
      let objectStoreIndex = indexName ? objectStore?.index(indexName) : objectStore; //获取以day为索引的表
      // 获取关键字 IDBKeyRange 限定范围
      // let keyRangeValue = key ? IDBKeyRange.only(key) : (
      //   minKey || maxKey ? (
      //     minKey && maxKey ? IDBKeyRange.bound(minKey, maxKey) : (
      //       minKey ? IDBKeyRange.lowerBound(minKey) : IDBKeyRange.upperBound(maxKey)
      //     )
      //   ) : undefined
      // );
      let request = objectStoreIndex?.count();
      let length = 0;
      let nowT = new Date(new Date().setHours(0,0,0,0)).getTime();
      if(request) {
        request.onsuccess = (e: any) => {
          length = e.target.result;
          if(length) {
            let request = objectStoreIndex?.openCursor();
            let i = 0;
            let dataNow: any = []; 
            let dataWeek: any = []; 
            let dataLong: any = []; 
            if(request) {
              request.onsuccess = (e: any) => {
                const cursor = e.target.result;
                if(cursor) {
                  if(cursor.value.day <= 2) {
                    dataNow.push(cursor.value);
                  } else if(cursor.value.day <= 7) {
                    const isNow = (cursor.value.time + cursor.value.day * 24 * 60 * 60 * 1000) < (nowT + 2 * 24 * 60 * 60 * 1000);
                    if(isNow) {
                      dataNow.push(cursor.value);
                    } else {
                      dataWeek.push(cursor.value);
                    }
                  } else {
                    const isWeek = (cursor.value.time + cursor.value.day * 24 * 60 * 60 * 1000) < (nowT + 7 * 24 * 60 * 60 * 1000);
                    if(isWeek) {
                      dataWeek.push(cursor.value);
                    } else {
                      dataLong.push(cursor.value);
                    }
                  }
                  i++;
                  if(i < length) {
                    cursor.continue();
                  } else {
                    resolve({
                      dataNow,
                      dataWeek,
                      dataLong
                    });
                  }
                } 
              }
              request.onerror = () => {
                console.log('getTimeData-cursor-error');
              }
            }
          } else {
            resolve({
              dataNow: [],
              dataWeek: [],
              dataLong: []
            });
          }
        }
        request.onerror = () => {
          console.log('getTimeData-count-error');
        }
      }
    });
    return promise;
  }

  // 获取所有数据用于保存为文件
  getAllData = () =>　{
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const nameList = [
        'foodIngredient',
        'flavoring',
        'convenientFood',
        'foodIngredientClass',
        'flavoringClass',
        'convenientFoodClass',
        'recordClass',
        'surpriseClass',
        'taskClass'
      ];
      const listObj = Object.create(null);
      let i = 1;
      nameList.forEach((name: string) => {
        const p = this.getData(name);
        //浏览器的事件流机制?就是大任务和小任务那块,异步方法和同步的执行顺序
        p.then((data) => {
          listObj[name] = data ? data : [];
          if(i === 9) {
            resolve(listObj);
          }
          i++;
        });
      });
    });
    return promise;
  }

  // 清空数据
  setDataNull = (name: string) => {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const objectStore = _this.database?.transaction(name, 'readwrite').objectStore(name);
        let request = objectStore?.clear(); // 根据对象仓库的主键更新
        if(request) {
          request.onsuccess = () => {
            resolve(true);
            console.log('setDataNull-success');
          }
          request.onerror = () => {
            resolve(false);
            console.log('setDataNull-error');
          }
        }
    });
    return promise;
  }
  // 重置数据
  setData = (name: string, data: any = []) => {
    console.log(name, data);
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      data.forEach((item: any, index: number) => {
        const p = this.add(name, item, true);
        p.then((success) => {
          if(!success) {
            resolve(false);
          } else {
            if(index === data.length - 1) {
              resolve(true);
            }
          }
        });
      });
    });
    return promise;
  }

  // 获取数据并覆盖数据库
  setAllData = (data: any) =>　{
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      console.log(data);
      const nameList = [
        'foodIngredient',
        'flavoring',
        'convenientFood',
        'foodIngredientClass',
        'flavoringClass',
        'convenientFoodClass',
        'recordClass',
        'surpriseClass',
        'taskClass'
      ];
      const set = () => {
        let j = 1;
        nameList.forEach((name: string) => {
          const p = this.setData(name, data[name]);
          p.then((success) => {
            if(!success) {
              resolve(false);
            }
            if(j === 9) {
              resolve(true);
            }
            j++;
          });
        });
      }
      // 清空
      let i = 1;
      nameList.forEach((name: string) => {
        const p = this.setDataNull(name);
        p.then((success) => {
          if(!success) {
            resolve(false);
          } else {
            if(i === 9) {
              // 结束清空,开始重置
              set();
            }
            i++;
          }
        });
      });
    });
    return promise;
  }
}

// 构造实例
const indexedDB = new IndexedDB();

export default indexedDB;



