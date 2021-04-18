// 日记格式
export interface Note {
  
}

// 日记显示格式
export interface NoteShow {
  timeId: number;
  title: string;
  data: string;
  tags: Array<any>;
}


// model
export interface ModelIndex {
}
export interface ModelShow {
  notedata: Array<NoteShow>;
}
export interface ModelNote {
  note: NoteShow;
}

// 全部数据格式
export interface AllData {
  
}


