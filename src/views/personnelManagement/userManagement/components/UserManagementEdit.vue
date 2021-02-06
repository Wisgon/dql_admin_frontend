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
          <el-checkbox label="admin"></el-checkbox>
          <el-checkbox label="editor"></el-checkbox>
          <el-checkbox label="tourist"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/userManagement'
  import { isInArray } from '@/utils/useful'
  import { doEdit as de } from '@/api/dql_userManagement'

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
        old_data: {},
        change_data: {},
        rules: {
          username: [
            { required: true, trigger: 'blur', message: '请输入用户名' },
          ],
          password: [
            { required: false, trigger: 'blur', message: '请输入密码' },
          ],
          email: [{ required: true, trigger: 'blur', message: '请输入邮箱' }],
          permissions: [
            { required: true, trigger: 'blur', message: '请选择权限' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
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
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            for (let key in this.old_data) {
              if (this.old_data[key] == this.form[key]) {
                continue
              }
              if (key != 'permissions') {
                this.change_data[key] = this.form[key]
              } else {
                this.change_data['permissions'] = {
                  add: [],
                  delete: [],
                }
                // 遍历新数据查看是否要新增
                this.form['permissions'].forEach((per) => {
                  if (!isInArray(this.old_data['permissions'], per)) {
                    // 没有在旧form中，说明是新增了
                    this.change_data['permissions']['add'].push(per)
                  }
                })
                // 遍历旧数据查看是否要删减
                this.old_data['permissions'].forEach((per) => {
                  if (!isInArray(this.form['permissions'], per)) {
                    // 没有在新form中，说明是删了
                    this.change_data['permissions']['delete'].push(per)
                  }
                })
              }
            }
            this.change_data['uid'] = this.old_data['uid']
            const resp = await de(this.change_data)
            console.log('resp :>> ', resp)
            const { msg } = await doEdit(this.form)
            this.$baseMessage(msg, 'success')
            this.$emit('fetch-data')
            this.close()
          } else {
            return false
          }
        })
      },
    },
  }
</script>
