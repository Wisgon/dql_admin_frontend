const data = [
  {
    content: '遮罩添加高斯模糊',
    timestamp: '2020-10-25',
  },
  {
    content: 'vue3.0 + element-plus版本正式上线',
    timestamp: '2020-12-5',
  },
  {
    content: '完成首页重构，跟进echarts 5.0',
    timestamp: '2020-12-7',
  },
  {
    content: '更新sass版本至最新',
    timestamp: '2021-1-7',
  },
]

module.exports = [
  {
    url: '/changeLog/getList',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
        totalCount: 999,
        data: data,
      }
    },
  },
]
