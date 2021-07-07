import LZString from 'lz-string';
import app from '../utils/app';
import { AllData, ModelIndex } from '../utils/interface';
import indexedDB from '../utils/indexedDB';

export default {
  namespace: 'index',
  state: {
    nowPage: 1,
  },
  reducers: {
    changeState(state: ModelIndex, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  effects: {},
};
