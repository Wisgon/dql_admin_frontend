<template>
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="handleEdit">
          添加
        </el-button>
        <!-- <el-button icon="el-icon-delete" type="danger" @click="handleDelete">
          批量删除
        </el-button> -->
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.username"
              placeholder="请输入用户名"
              clearable
            />
            <el-checkbox v-model="queryForm.fuzz">模糊查询</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      @selection-change="setSelectRows"
    >
      <!-- <el-table-column show-overflow-tooltip type="selection"></el-table-column> -->
      <el-table-column
        show-overflow-tooltip
        prop="uid"
        label="id"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="username"
        label="用户名"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="email"
        label="邮箱"
      ></el-table-column>

      <el-table-column show-overflow-tooltip label="权限">
        <!-- 这里的#号其实是v-slot:的缩写 -->
        <template #default="{ row }">
          <el-tag v-for="(role, index) in row.roles" :key="index">
            {{ role.name }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="update_time"
        label="修改时间"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="200">
        <!-- 这里的row是elementui的tabel里面的scope里面的元素 -->
        <!-- 其实下面这句就相当于：<template slot-scope="scope"> 可查看elementui文档 -->
        <template #default="{ row }">
          <el-button
            v-if="row.username != 'admin'"
            type="text"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button v-else type="text" disabled>编辑</el-button>
          <el-button
            v-if="row.username != 'admin'"
            type="text"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
          <el-button v-else type="text" disabled>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <edit ref="edit" @fetch-data="fetchData"></edit>
  </div>
</template>

<script>
  import { getList, doDelete } from '@/api/dql_userManagement'
  import Edit from './components/UserManagementEdit'

  export default {
    name: 'UserManagement',
    components: { Edit },
    data() {
      return {
        list: null,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          username: '',
          fuzz: false,
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        if (row.uid) {
          this.$refs['edit'].showEdit(row)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleDelete(row) {
        if (row.uid) {
          var that = this
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { code, message } = await doDelete({ uid: row.uid })
            // console.log('message :>> ', message)
            if (code != 0) {
              that.$baseMessage(message, 'error')
            } else {
              that.$baseMessage(message, 'success')
              that.$router.go(0)
            }
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.uid).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids })
              this.$baseMessage(msg, 'success')
              this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        const resp = await getList(this.queryForm)
        //console.log('resp :>> ', resp)
        this.listLoading = true
        const data = resp.data
        // todo:这里应该是获取所有user的数量，现在先用返回数量顶着
        const totalCount = resp.data.length
        this.list = data
        this.total = totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>
