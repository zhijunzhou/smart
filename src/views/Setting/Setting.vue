<template>
    <div>
      <el-row>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-table
            :data="users">
              <el-table-column
                label="用户编号"
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
                        <h6>{{ scope.row.userName }}</h6>
                        <span>昵称 {{ scope.row.wechatName }}</span>
                      </el-col>
                    </el-row>
                  </template>              
              </el-table-column>
              <el-table-column
                label="角色"
                prop="role">
                <template slot-scope="scope">
                  <span v-for="role in scope.row.roles">
                    <el-tooltip :content="role.shopName" placement="bottom" effect="light">
                      <span class="role-txt">{{ role.roleName }}</span>
                    </el-tooltip>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
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
                label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" round @click="edit(scope.row)">编辑</el-button>
                  <el-button size="mini" round>
                    <router-link :to="{path: '/main/analysis'}">删除</router-link>
                  </el-button>
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
            <el-form-item label="工号" :label-width="formLabelWidth">
              {{form.userId}}
            </el-form-item>
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input v-model="form.userName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
              <el-input v-model="form.cellPhone" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮件" :label-width="formLabelWidth">
              <el-input v-model="form.email" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色" :label-width="formLabelWidth">
              <el-checkbox-group v-model="roleSelected" >
                <el-checkbox v-for="role of roleList" :label="role.roleId" :disabled="hasSales(role.roleId)">{{role.roleName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="所属店铺" :label-width="formLabelWidth">
              <el-checkbox-group v-model="shopSelected" >
                <el-checkbox v-for="shop of shopList" :label="shop.shopId">{{shop.shopName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
  // import { ROLE } from '../../../static/enum.js'
  import api from '../../utils/api'
  export default {
    data () {
      return {
        users: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        search_val: '',
        showLiked: false,
        options: [],
        dialogFormVisible: false,
        productType: '',
        roleSelected: [],
        shopList: [],
        shopSelected: [],
        formLabelWidth: '120px',
        roleList: [
          { roleId: 4, roleName: '项目执行人' },
          { roleId: 3, roleName: '项目创建人' },
          { roleId: 5, roleName: '销售' },
          { roleId: 6, roleName: '销售总监' }
        ],
        form: {
          userId: '',
          userName: '',
          cellPhone: '',
          email: '',
          role: [],
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
      // changeRole (ev) {
      //   console.log(this.roleSelected)
      //   console.log(ev)
      // },
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
        this.form = user
        console.log(user)
        this.dialogFormVisible = true
      },
      getUserData () {
        const pagination = {
          pageSize: this.pageSize,
          currentPage: this.currentPage
        }
        api.post('/api/user/pagination', {pagination}).then(res => {
          this.users = res.data.grid
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
.role-txt {
  margin: 5px;
}
</style>
  
  