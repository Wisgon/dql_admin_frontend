module.exports = {
  webpackBarName: 'dgraph_admin',
  webpackBanner:
    ' build: dgraph_admin \n dgraph_admin author: zhilong 1204505056@qq.com \n dgraph_admin QQ Group(QQ群): 972435319、1139183756 \n time: ',
  donationConsole() {
    const chalk = require('chalk')
    console.log(
      chalk.green(
        `> 欢迎使用dgraph_admin，开源地址：https://github.com/zhilong/dgraph_admin`
      )
    )

    console.log(
      chalk.green(
        `> pro版演示地址：http://chu1204505056.gitee.io/dgraph_admin-pro?hmsr=console&hmpl=&hmcu=&hmkw=&hmci=`
      )
    )

    console.log(
      chalk.green(
        `> vue 2.x版本演示地址（MIT协议免费商用）：http://chu1204505056.gitee.io/dgraph_admin?hmsr=console&hmpl=&hmcu=&hmkw=&hmci=`
      )
    )

    console.log(
      chalk.green(
        `> vue3.X版演示地址（element-plus 后期主线版本MIT协议免费商用）：即将发布请关注github dgraph_admin动态`
      )
    )

    console.log(
      chalk.green(
        `> vue3.X版演示地址（andv MIT协议免费商用）：http://chu1204505056.gitee.io/dgraph_admin-antdv?hmsr=console&hmpl=&hmcu=&hmkw=&hmci=`
      )
    )

    console.log(
      chalk.green(
        `> 使用中出现任何问题可加QQ群反馈，获取文档（群号：972435319，1139183756）`
      )
    )

    console.log(chalk.green(`> 如果您不希望显示以上信息，可在config中配置关闭`))
    console.log('\n')
  },
}
