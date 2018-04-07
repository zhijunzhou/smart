<template>
    <div>
      <el-row>
          <el-col :span="8">
          <el-input
            placeholder="请输入姓名"
            v-model="searchFullName"
            @clear="searchFullNameChange"
            clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchFullNameChange"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          &nbsp;
        </el-col>
        <el-col :span="2" class="header-content">
          用户状态:
        </el-col>
        <el-col :span="4" class="header-content">
          <el-checkbox-group v-model="userStatusSelected" @change="userStatusChange" :min="1">
            <el-checkbox v-for="status of userStatusList" :label="status.id" :key="status.id" >{{status.value}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="4" class="add-user">
          <el-button type="primary" icon="el-icon-plus" round @click="add">新增用户</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-table
            :data="users">
              <el-table-column
                label="编号"
                width="50"
                prop="userId">
              </el-table-column>
              <el-table-column
                label="用户">
                <template slot-scope="scope">
                    <el-row>
                      <el-col :span="6">
                        <img :src="scope.row.wechatImage" class="privateImage" v-if="scope.row.wechatImage">
                      </el-col>
                      <el-col :span="18">
                        <h6>{{ scope.row.fullName }}</h6>
                        <span v-if="scope.row.wechatName">昵称 {{ scope.row.wechatName }}</span>
                      </el-col>
                    </el-row>
                  </template>              
              </el-table-column>
              <el-table-column
                label="邮件"
                prop="email">
              </el-table-column>
              <el-table-column
                label="电话"
                width="100"
                prop="phone">
              </el-table-column>
              <el-table-column
                label="角色"
                prop="role">
                <template slot-scope="scope">
                  <span v-for="role in scope.row.roles">
                      <span class="role-txt">{{ role.roleName }}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
                width="80"
                prop="userStatus">
                <template slot-scope="scope">
                  <span v-if="scope.row.userStatus==='active'">
                    <el-tag size="mini" :hit="false" type="success">正常</el-tag>
                  </span>
                  <span v-if="scope.row.userStatus==='disabled'">
                    <el-tag size="mini" :hit="false" type="danger">禁用</el-tag>
                  </span>
                  <span v-if="scope.row.userStatus==='visit'">
                    
                    <el-button type="primary" icon="el-icon-check" size="mini" round></el-button>
                    <el-button icon="el-icon-close" size="mini" round></el-button>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="300">
                <template slot-scope="scope">
                  <el-button size="mini" round @click="edit(scope.row)" icon="el-icon-edit">编辑</el-button>
                  <el-popover :style="{ color: scope.row.changePasswordFlag ? 'red':'blue' }"
                    ref="changePassWord"
                    placement="top"
                    width="160"
                    v-model="scope.row.changePasswordFlag">
                    <p><b>{{scope.row.fullName}}的新密码</b></p>
                    <p>注意: 修改密码会同时解绑微信</p>
                    <el-input v-model="newPassword" placeholder="请输入密码"></el-input>
                    <p>&nbsp;</p>
                    <div style="text-align: right; margin: 0">
                      <el-button type="primary" size="mini" @click="confirmChangePassword(scope.row)">确定</el-button>
                    </div>
                  </el-popover>
                  <el-button size="mini" round icon="el-icon-view" v-popover:changePassWord>修改密码</el-button>
                  <el-button v-if="scope.row.userStatus==='disabled'"  icon="el-icon-check" size="mini" round @click="switchStatus(scope.row.userId, 1)">激活</el-button>
                  <el-button v-else size="mini" round icon="el-icon-close" @click="switchStatus(scope.row.userId, 0)" >禁用</el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-col>
        <el-col :span="24" class="text-right">
          <el-pagination
            layout="total, prev, pager, next, jumper"
            @current-change="updatePageUsers"
            :page-size="pageSize"
            :total="total">
          </el-pagination>
        </el-col>
      </el-row>
      <el-dialog title="用户详情" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item v-if="modalType === 'edit'" label="工号" :label-width="formLabelWidth">
              {{form.userId}}
            </el-form-item>
            <!-- <el-form-item v-if="modalType === 'edit'" label="用户名" :label-width="formLabelWidth">
              {{form.userName}}
            </el-form-item> -->
            <el-form-item v-if="modalType === 'add'" label="用户名" :label-width="formLabelWidth">
                <el-input v-model="form.userName" auto-complete="off"></el-input>
              </el-form-item>
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input v-model="form.fullName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
              <el-input v-model="form.phone" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮件" :label-width="formLabelWidth">
              <el-input v-model="form.email" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色" :label-width="formLabelWidth">
              <el-checkbox-group v-model="roleSelected" >
                <el-checkbox v-for="role of roleList" :label="role.roleId" :key="role.roleId" :disabled="hasSales(role.roleId)">{{role.roleName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="所属店铺" :label-width="formLabelWidth">
              <el-checkbox-group v-model="shopSelected" >
                <el-checkbox v-for="shop of shopList" :label="shop.shopId" :key="shop.shopId">{{shop.shopName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveUser">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
  // import { ROLE } from '../../../static/enum.js'
  import api from '../../utils/api'
  import { Message } from 'element-ui'
  export default {
    data () {
      return {
        users: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        search_val: '',
        showLiked: false,
        newPassword: '',
        searchFullName: '',
        options: [],
        dialogFormVisible: false,
        productType: '',
        roleSelected: [],
        shopList: [],
        changePasswordFlag: true,
        shopSelected: [],
        formLabelWidth: '120px',
        filter: {
          userName: '',
          userStatus: ''
        },
        roleList: [
          // { roleId: 4, roleName: '项目执行人' },
          // { roleId: 3, roleName: '项目创建人' },
          { roleId: 5, roleName: '销售' },
          { roleId: 6, roleName: '销售主管' }
        ],
        userStatusList: [
          { id: 'active', value: '正常' },
          { id: 'disabled', value: '禁用' }
        ],
        userStatusSelected: ['active', 'disabled'],
        modalType: 'edit',
        form: {
          userId: '',
          userName: '',
          fullName: '',
          phone: '',
          email: '',
          roles: [],
          shops: []
        }
      }
    },
    created () {
      this.getUserData()
      this.getShopList()
    },
    mounted () {
    },
    methods: {
      unbind (userId) {
        const wechatId = null
        const wechatName = ''
        const wechatImage = ''
        const force = 1
        api.post('/api/wechat/bind', {userId, wechatId, wechatName, wechatImage, force}).then(res => {
          this.setUserInfo(res.data)
        })
      },
      getBoolen (value) {
        console.log(value)
        return value
      },
      changePassword (row) {
        row.changePasswordFlag = true
      },
      cancelChangePassword (row) {
        console.log(row)
        row.changePasswordFlag = true
        setTimeout(() => {
          row.changePasswordFlag = true
        }, 0)
        // this.users = this.users.map(u => {
        //   u.changePasswordFlag = false
        //   return u
        // })
        this.newPassword = ''
      },
      confirmChangePassword (row) {
        const userId = row.userId
        const passWord = this.newPassword
        api.post(`/api/user/password`, {userId, passWord}).then(res => {
          Message({
            showClose: true,
            message: '操作成功!',
            type: 'success'
          })
          this.newPassword = ''
          this.unbind(userId)
          row.changePasswordFlag = false
        }).catch(err => {
          row.changePasswordFlag = false
          Message({
            showClose: true,
            message: err.response.statusText,
            type: 'error'
          })
        })
      },
      searchFullNameChange () {
        this.filter.userName = this.searchFullName
        this.getUserData()
        console.log('searchFullNameChange', this.searchFullName)
      },
      userStatusChange () {
        console.log(this.userStatusSelected)
        this.filter.userStatus = this.userStatusSelected.length === 1 ? this.userStatusSelected[0] : ''
        this.getUserData()
      },
      switchStatus (userId, status) {
        api.post(`/api/user/status`, {userId, status}).then(res => {
          Message({
            showClose: true,
            message: '操作成功!',
            type: 'success'
          })
          this.getUserData()
        }).catch(err => {
          Message({
            showClose: true,
            message: err.response.statusText,
            type: 'error'
          })
        })
      },
      saveUser () {
        this.dialogFormVisible = false
        const fullName = this.form.fullName
        const email = this.form.email | ''
        const phone = this.form.phone | ''
        const userName = this.form.userName
        const roles = this.roleSelected
        const shops = this.shopSelected
        const body = this.modalType === 'edit' ? {fullName, email, phone, roles, shops} : {userName, fullName, email, phone, roles, shops}
        const url = this.modalType === 'edit' ? `/${this.form.userId}` : ''
        api.post(`/api/user${url}`, body).then(res => {
          Message({
            showClose: true,
            message: '操作成功!',
            type: 'success'
          })
          this.getUserData()
        }).catch(err => {
          console.log(err)
          Message({
            showClose: true,
            message: err.response.statusText,
            type: 'error'
          })
        })
      },
      getShopList () {
        api.get('/api/shop').then(res => {
          this.shopList = res.data
        })
      },
      hasSales (id) {
        let res = false
        switch (id) {
          case 5:
            res = (this.roleSelected.indexOf(6) > -1)
            console.log(id, res)
            break
          case 6:
            res = (this.roleSelected.indexOf(5) > -1)
            console.log(id, res)
            break
        }
        return res
      },
      edit (user) {
        this.modalType = 'edit'
        this.form = user
        this.roleSelected = user.roles.map(u => u.roleId)
        console.log(user)
        this.dialogFormVisible = true
      },
      add () {
        this.modalType = 'add'
        this.form = {
          userId: '',
          userName: '',
          fullName: '',
          phone: '',
          email: '',
          roles: [],
          shops: []
        }
        this.roleSelected = []
        this.dialogFormVisible = true
      },
      getUserData () {
        const pagination = {
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          filter: this.filter
        }
        api.post('/api/user/pagination', {pagination}).then(res => {
          this.users = res.data.grid
          this.users.forEach(u => {
            u.changePasswordFlag = false
          })
          this.total = res.data.pagination.total
        })
      },
      updatePageUsers (currentPage) {
        this.currentPage = currentPage
        this.getUserData()
      },
      getShopName (shopId) {
        const scope = this.getShops().find(s => s.shopId === shopId)
        return scope ? scope.shopName : ''
      },
      getShops () {
        return [
          { shopId: '1', shopName: '店铺A' },
          { shopId: '2', shopName: '店铺B' },
          { shopId: '3', shopName: '店铺C' }
        ]
      }
    }
  }
</script>
<style>
    .privateImage{
	display:inline-block;
	border-radius:50%;
	height: 40px;
	vertical-align:middle;
}
.add-user {
  text-align: right;
}
.role-txt {
  margin: 5px;
}
.header-content {
  height: 40px;
  line-height: 40px;
}
</style>
  
  