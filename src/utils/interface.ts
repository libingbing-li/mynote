// 日记格式
export interface Note {
  
}

// 日记显示格式
export interface NoteShow {
  timeId: number;
  title: string;
  data: string;
  tags: Array<string>;
}


// model
export interface ModelIndex {
}
export interface ModelShow {
  notedata: Array<NoteShow>;
  minTime: number;
  maxTime: number;
}
export interface ModelNote {
  timeId: number;
  title: string;
  data: string;
  tags: Array<string>;
}

// 全部数据格式
export interface AllData {
  
}


