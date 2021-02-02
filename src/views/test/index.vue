<template>
  <div class="test-container">
    <el-divider content-position="left">你可以在这里写demo</el-divider>
    <p>websocket demo</p>
    <div class="test">{{ receive_data }}</div>
  </div>
</template>
<script>
  export default {
    name: 'Test',
    data() {
      return {
        show: true,
        websock: null,
        receive_data: '',
      }
    },
    created() {
      this.initWebSocket()
    },
    mounted() {},
    destroyed() {
      this.websock.close() //离开路由之后断开websocket连接
    },
    methods: {
      initWebSocket() {
        //初始化weosocket
        const wsuri = 'ws://127.0.0.1:7777/ws'
        this.websock = new WebSocket(wsuri)
        this.websock.onmessage = this.websocketonmessage
        this.websock.onopen = this.websocketonopen
        this.websock.onerror = this.websocketonerror
        this.websock.onclose = this.websocketclose
      },
      websocketonopen() {
        //连接建立之后执行send方法发送数据
        let actions = { test: '12345' }
        this.websocketsend(JSON.stringify(actions))
        console.log('socket connected')
      },
      websocketonerror() {
        //连接建立失败重连
        console.log('connect error :')
        this.initWebSocket()
      },
      websocketonmessage(e) {
        //数据接收
        const redata = JSON.parse(e.data)
        console.log('redata :>> ', redata)
        this.receive_data = redata
      },
      websocketsend(Data) {
        //数据发送
        this.websock.send(Data)
      },
      websocketclose(e) {
        //关闭
        console.log('断开连接', e)
      },
    },
  }
</script>

<style lang="less"></style>
