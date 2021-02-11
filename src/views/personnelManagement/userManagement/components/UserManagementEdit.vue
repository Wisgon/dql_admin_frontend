<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model.trim="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model.trim="form.password"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-checkbox-group v-model="form.permissions">
          <el-checkbox
            v-for="role in rolesWithoutAdmin"
            :key="role.uid"
            :label="role.uid"
          >
            {{ role.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <slot name="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </slot>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/dql_userManagement'
  import { getList as getRolesLst } from '@/api/dql_roleManagement'

  export default {
    name: 'UserManagementEdit',
    data() {
      return {
        form: {
          username: '',
          password: '',
          email: '',
          permissions: [],
        },
        roles: [],
        change_data: {},
        rules: {
          username: [
            { required: true, trigger: 'blur', message: '请输入用户名' },
          ],
          password: [
            { required: true, trigger: 'blur', message: '请输入密码' },
          ],
          email: [{ required: false, trigger: 'blur', message: '请输入邮箱' }],
          permissions: [
            { required: true, trigger: 'blur', message: '请选择权限' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    computed: {
      rolesWithoutAdmin: function () {
        return this.roles.filter(function (role) {
          return role.role_id != 'admin'
        })
      },
    },
    created() {
      this.fetchData()
    },

    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
          this.rules.password[0].required = true
        } else {
          this.title = '编辑'
          // 编辑的时候不一定要改password
          this.rules.password[0].required = false
          if (row.permissions == null) row.permissions = []
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      save() {
        var that = this
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            if (this.title == '添加') {
              this.$baseMessage('模拟添加成功', 'success')
              this.close()
              return
            } else {
              var update_data = {
                uid: this.form.uid,
                username: this.form.username,
                password: this.form.password,
                permissions: this.form.permissions,
              }
              const resp = await doEdit(update_data)
              // console.log('resp :>> ', resp)
              if (resp.code == 0) {
                this.$baseMessage(resp.message, 'success')
                setTimeout(() => {
                  that.$emit('fetch-data')
                  that.close()
                }, 1000)
              } else {
                this.$baseMessage(resp.message, 'error')
              }
            }
          } else {
            return false
          }
        })
      },
      async fetchData() {
        var queryForm = {
          pageNo: 1,
          pageSize: 10240,
        }
        const resp = await getRolesLst(queryForm)
        this.roles = resp.data
      },
    },
  }
</script>
