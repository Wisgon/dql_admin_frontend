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
  import { isInArray } from '@/utils/useful'
  import { doEdit } from '@/api/dql_userManagement'
  import { getList as getRolesLst } from '@/api/dql_roleManagement'
  import permissions from '@/layouts/components/zx-layouts/Permissions'

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
        old_data: {},
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
          this.rules.password[0].required = false
          this.form = Object.assign({}, row)
          this.old_data = Object.assign({}, row)
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
            }
            // for (let key in this.old_data) {
            //   if (this.old_data[key] == this.form[key]) {
            //     continue
            //   }
            //   if (key != 'permissions') {
            //     this.change_data[key] = this.form[key]
            //   } else {
            //     this.change_data['permissions'] = {
            //       add: [],
            //       delete: [],
            //     }
            //     // 遍历新数据查看是否要新增
            //     this.form['permissions'].forEach((per) => {
            //       if (!isInArray(this.old_data['permissions'], per)) {
            //         // 没有在旧form中，说明是新增了
            //         this.change_data['permissions']['add'].push(per)
            //       }
            //     })
            //     // 遍历旧数据查看是否要删减
            //     this.old_data['permissions'].forEach((per) => {
            //       if (!isInArray(this.form['permissions'], per)) {
            //         // 没有在新form中，说明是删了
            //         this.change_data['permissions']['delete'].push(per)
            //       }
            //     })
            //   }
            // }
            // this.change_data['uid'] = this.old_data['uid']
            // console.log('this.form :>> ', this.form)
            // console.log('this.change_data :>> ', this.change_data)
            // var update_data = { update_data: this.change_data }

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
          } else {
            return false
          }
        })
      },
      async fetchData() {
        var queryForm = {
          pageNo: 1,
          pageSize: 10,
        }
        const resp = await getRolesLst(queryForm)
        this.roles = resp.data
      },
    },
  }
</script>
