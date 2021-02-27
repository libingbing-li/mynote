// 类别

// 食材 
export interface FoodIngredientClass {
  classId: number; //表示归属哪个表
  time: number; //时间戳-id
  classValue: string; //小分类
  name: string; //名称
  day: number; //保鲜天数
  minValue: number; //最小价格
  maxValue: number; //最大价格
  notes: Array<string>; //记录所有实例的笔记
  num: number; // 当前这个类所有的数量 如果为0类变成灰色
}

// 实例

// 食材
export interface FoodIngredient {
  classId: number; //表示归属哪个表
  time: number; //时间戳-id
  classValue: string; //小分类
  name: string; //名称
  day: number | string; //保鲜天数
  num: number | string; //个数
  weight: number | string; //重量
  value: number | string; //价格
  note: string; //备注
}

// model
export interface ModelIndex extends FoodIngredient {
  classId: number;
  data: any;
  isBasket: boolean;
  noteModalStr: string;
}
export interface ModelInfo {
  foodIngredientClass: Map<string,Array<FoodIngredientClass>>; //食材
  flavoringClass: Map<string,Array<FoodIngredientClass>>; //调味
  convenientFoodClass: Map<string,Array<FoodIngredientClass>>; //方便
  infoNote: string;
  infoTime: number;
  infoData: FoodIngredientClass;
  classIdInfo: number;
}
export interface ModelTime {
  foodIngredientNowList: Map<string,Array<FoodIngredient>>; //食材
  foodIngredientWeekList: Map<string,Array<FoodIngredient>>; //菜谱
  foodIngredientLongList: Map<string,Array<FoodIngredient>>; //调味
  flavoringNowList: Map<string,Array<FoodIngredient>>; //食材
  flavoringWeekList: Map<string,Array<FoodIngredient>>; //菜谱
  flavoringLongList: Map<string,Array<FoodIngredient>>; //调味
  convenientFoodNowList: Map<string,Array<FoodIngredient>>; //食材
  convenientFoodWeekList: Map<string,Array<FoodIngredient>>; //菜谱
  convenientFoodLongList: Map<string,Array<FoodIngredient>>; //调味
  timeTime: number; //当前接受编辑的item的timeid
  classIdTime: number;
}
export interface ModelNow {
  recordList: Array<any>;
  taskList: Array<TaskItem>;
  surpriseList: Array<SurpriseItem>;
  nowNote: string;
  nowTime: number;
  nowClassId: number; //当前类型
  nowItemClassId: number; //surprise和task的classId
  nowDate: any;
}
export interface ModelBasket {
  nowBasket: number; //1buy 2morning 3afternoon 4evening!
  basketBuy: Array<Item>;
  basketMorning: Array<Item>;
  basketAfternoon: Array<Item>;
  basketEvening: Array<Item>;
}


// 全部数据格式
export interface AllData {
  convenientFood: Array<FoodIngredient>;
  convenientFoodClass: Array<FoodIngredientClass>;
  flavoring: Array<FoodIngredient>;
  flavoringClass: Array<FoodIngredientClass>;
  foodIngredient: Array<FoodIngredient>;
  foodIngredientClass: Array<FoodIngredientClass>;
  recordClass: Array<RecordNote | RecordItem>;
}



// 记录
// note
export interface RecordNote {
  time: number;
  noteStr: string;
}
export interface Item {
  name: string;
  time: number;
  classId: number;
}
export interface RecordItem {
  isCheck: boolean;
  list: Array<Item>;
  clazz: number;
  note: string;
  time: number;
}

// surprise
export interface SurpriseDate {
  firstDate: number;
  endDate: number;
}

export interface SurpriseItem {
  isOnGoing: boolean; //此时是否在持续
  name: string; //特殊日名称
  dateList: Array<SurpriseDate>; //记录所有日期 倒序,最新的是第一个
  classId: number; //表明当前是什么类型
  time: number; //创建时间戳
}

// task
export interface TaskItem {
  name: string; //任务名称
  classId: number; //任务类别 同surprise
  time: number; //创建时间戳
  num: number; //完成次数
}