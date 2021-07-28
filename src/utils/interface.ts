// 日记格式
export interface Note {}

// 日记显示格式
export interface NoteShow {
  timeId: number;
  title: string;
  data: string;
  tags: Array<string>;
}

// model
export interface ModelIndex {
  nowPage: number;
}
export interface ModelShow {
  notedata: Array<NoteShow>;
  minTime: number;
  maxTime: number;
  scrollTop: number; //用于保存滚动状态
}
export interface ModelNote {
  timeId: number;
  title: string;
  data: string;
  tags: Array<string>;
}
export interface ModelSetting {
  dataTxt: string;
  minTime: number;
  maxTime: number;
}
export interface ModelTags {
  notedata: Array<NoteShow>;
  str: string;
  scrollTop: number;
}

// 全部数据格式
export interface AllData {}
