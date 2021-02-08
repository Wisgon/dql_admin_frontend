const data = [
  {
    title: 'Admin Pro 3.0付费版本已发布，增加多项贴心功能，点我提前体验',
    url: 'https//www.baidu.com',
  },
  {
    title: 'Admin Plus 3.0内测版本已发布，增加多项贴心功能，点我提前体验',
    url: 'https//www.baidu.com',
  },
  {
    title: 'dgraph_admin（antdv） vue3.0版本已发布，点我提前体验',
    url: 'https//www.baidu.com',
  },
  {
    title: 'dgraph_admin（element-plus） vue3.0版本已发布，点我提前体验',
    url: 'https//www.baidu.com',
  },
]
module.exports = [
  {
    url: '/ad/getList',
    type: 'get',
    response() {
      return {
        code: 200,
        msg: 'success',
        data,
      }
    },
  },
]
