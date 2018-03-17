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
                label="用户名">
                <template slot-scope="scope">
                  <img :src="scope.row.userImg" class="privateImage" v-if="scope.row.userImg">
                  {{ scope.row.userName }}
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
                  <el-button size="mini" round>编辑</el-button>
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
        productType: ''
      }
    },
    created () {
      this.getUserData()
    },
    mounted () {
    },
    methods: {
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
  
  