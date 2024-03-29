import { defineConfig } from 'umi';

export default defineConfig({
  history: {
    type: 'hash'
  },
  base: './',
  publicPath: './',
  hash: true,
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/note', component: '@/pages/note/note' },
    { path: '/alldata', component: '@/pages/setting/alldata' },
  ],
});
