const data = [
  {
    title: 'Admin Pro 3.0付费版本已发布，增加多项贴心功能，点我提前体验',
    url:
      'https://chu1204505056.gitee.io/admin-pro?hmsr=homeAd&hmpl=&hmcu=&hmkw=&hmci=',
  },
  {
    title: 'Admin Plus 3.0内测版本已发布，增加多项贴心功能，点我提前体验',
    url:
      'https://chu1204505056.gitee.io/admin-plus?hmsr=homeAd&hmpl=&hmcu=&hmkw=&hmci=',
  },
  {
    title: 'dgraph_admin（antdv） vue3.0版本已发布，点我提前体验',
    url:
      'http://dgraph_admin.com/dgraph_admin-antdv?hmsr=homeAd&hmpl=&hmcu=&hmkw=&hmci=',
  },
  {
    title: 'dgraph_admin（element-plus） vue3.0版本已发布，点我提前体验',
    url:
      'https://chu1204505056.gitee.io/admin-plus?hmsr=homeAd&hmpl=&hmcu=&hmkw=&hmci=',
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
