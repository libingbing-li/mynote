
## 想法需求
1. info - 存放类
2. time - 存放实例
    时间划分,大分类(暂时默认食材),小分类,排序;时间早-晚
3. now - 对买菜和食谱进行规划
5. now - 智能检测实例判断今天要不要买菜并推送到now
6. 删除前出现一个弹窗, 弹窗组件, 参考antd modal和app.info


## 组件
1. 左右滑动盒子
2. 任意移动(可贴边)盒子

## 封装功能
1. indexedDB本地存储数据库
    操作需求: 保存数据, 读取数据
2. interface文档保存所有数据结构


## 使用技术
1. ui组件: react
2. 数据联通: dva, 和ts的兼容取巧手写,没有配置 ( connect, dispatch, modal )
3. 数据本地存储: indexedDB, 操作均为异步操作, 返回查找值的时候使用promise, 在model中的effects异步操作得到promise对象,使用generator函数* + yield获取值,
4. 类型控制: ts, 写了个interface封装


# 当前功能 
## v1.0.0
增ok  删ok  改ok 显示ok

-- 类均为通过实例生成数据,不可自行添加修改,但可以删除(一键删除所有对应实例)

1. time 增删改ok 双击单个实例-1(动画) 收起
2. info 增删改ok 添加note 收起
3. now-record Note 增删改ok ItemFood 点击修改,双击完成 显示一周

## v1.1.0
增ok  删  改  显示ok
1. now-task 增删改 ok 双击num+1(动画)
2. now-surprise 增删改 ok 双击进入onGoing


## v1.1.0
# 需求

# 功能
4. 改数据结构之前做好旧数据迁移的转换函数

task, surprise项目的添加,编辑,删除
task, s的点击,进入ongoing操作
整理readme文档

添加购物栏的时候也给个动画?
app.info原生组件