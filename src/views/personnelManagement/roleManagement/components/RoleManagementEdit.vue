<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-tree
        v-if="title == '编辑'"
        ref="route_tree"
        node-key="value"
        :default-checked-keys="checked_pages"
        :data="allAsyncRoutes"
        :props="defaultProps"
        show-checkbox
      ></el-tree>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save(form.uid)">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/dql_roleManagement'
  import { getAccessablePages } from '@/api/dql_roleManagement'

  export default {
    name: 'RoleManagementEdit',
    data() {
      return {
        form: {
          id: '',
        },
        rules: {
          permission: [
            { required: true, trigger: 'blur', message: '请输入权限码' },
          ],
        },
        title: '',
        dialogFormVisible: false,
        allAsyncRoutes: [],
        myAsyncRoutes: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        checked_pages: [],
      }
    },
    created() {
      this.allAsyncRoutes = this.$store.getters['routes/allAsyncRoutes']
    },
    methods: {
      showEdit(row) {
        var that = this
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
          var param = '?role_id=' + row.role_id
          getAccessablePages(param).then((res) => {
            if (res.code != 0) {
              that.$baseMessage('获取角色权限失败', 'error')
            } else {
              this.$refs.route_tree.setCheckedKeys(
                Object.keys(res.data[row.role_id])
              )
            }
          })
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.checked_pages = []
        this.dialogFormVisible = false
      },
      save(uid) {
        var that = this
        var checked_nodes = this.$refs.route_tree.getCheckedNodes()
        var accessable_pages = []
        checked_nodes.forEach((node) => {
          if (node.value != null) {
            accessable_pages.push(node.value)
          }
        })
        var data = {
          uid,
          accessable_pages,
        }
        doEdit(data).then((res) => {
          if (res.code == 0) {
            this.$baseMessage(res.message, 'success')
          }
          that.close()
        })
      },
    },
  }
</script>
