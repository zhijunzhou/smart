<template>
    <div>
      <el-row>
        <!-- <el-form ref="form">
          <el-col :span="4">
            <el-button>选择店铺</el-button>
          </el-col>
          <el-col :span="8">        
            <el-form-item label="产品类型：">
              <el-select v-model="productType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-input
                placeholder="帽子"
                prefix-icon="el-icon-search"
                v-model="search_val">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="padding-left: 5px;">
            <el-button type="primary" icon="el-icon-search">搜索</el-button>
          </el-col>
          <el-col :span="7" class="text-right">
            <el-form-item>
              <el-checkbox v-model="showLiked">只显示我关注的</el-checkbox>
            </el-form-item>
          </el-col>
        </el-form> -->
      </el-row>
      <el-row :gutter="20">
        <!-- <el-col :span="24" class="text-right"> -->
          <!-- <el-pagination
            layout="total, prev, pager, next, jumper"
            @current-change="updatePageProducts"
            :page-size="pageSize"
            :total="total">
          </el-pagination> -->
        <!-- </el-col> -->
        <el-col :span="24">
          <el-table
            :data="products">
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
              <!-- <el-table-column
                label="所属店铺"
                prop="shops">
                <template slot-scope="scope">
                  <span v-for="shop in scope.row.shops">
                    <el-tag size="mini" :hit="false">{{ getShopName(shop) }}</el-tag>
                  </span>
                </template>
              </el-table-column>             -->
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
            @current-change="updatePageProducts"
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
        products: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        pageProducts: [],
        search_val: '',
        showLiked: false,
        options: [],
        productType: ''
      }
    },
    created () {
      this.getUserData()
      // for (let i = 1; i <= 5; i++) {
      // this.products.push({
      //   index: 1,
      //   name: '测试数据' + 1,
      //   role: Math.round(Math.random() * 10),
      //   sales: Math.round(Math.random() * 45 + 55),
      //   userId: '员工号码',
      //   userName: '员工名',
      //   userImg: '',
      //   shops: [
      //     '1', '2', '3'
      //   ],
      //   userStatus: 2
      // })
      // }
      // this.products[0].userName = this.$store.state.userInfo.nickname
      // this.products[0].userImg = this.$store.state.userInfo.headimgurl
      // this.pageProducts = this.products.slice(0, this.pageSize)
    },
    mounted () {
    },
    methods: {
      getUserData () {
        const pagination = {
          pagesize: this.pageSize,
          currentpage: this.currentPage
        }
        api.post('/api/user/pagination', {pagination}).then(res => {
          this.products = res.data.grid
          this.total = res.data.pagination.total
          console.log(this.products)
        })
      },
      updatePageProducts (currentPage) {
        this.currentPage = currentPage
        this.getUserData()
        // let start = (currentPage - 1) * this.pageSize
        // let lastPageSize = this.products.length % this.pageSize
        // let isLastPage = Math.ceil(this.products.length / this.pageSize) === currentPage
        // let end = start + (isLastPage ? lastPageSize : this.pageSize)
        // this.pageProducts = this.products.slice(start, end)
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
  
  