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
        <el-col :span="24" class="text-right">
          <el-pagination
            layout="total, prev, pager, next, jumper"
            @current-change="updatePageProducts"
            :page-size="pageSize"
            :total="products.length">
          </el-pagination>
        </el-col>
        <el-col :span="24">
          <el-table
            :data="pageProducts">
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
                  {{ scope.row.role | role }}
                </template>
              </el-table-column>
              <el-table-column
                label="所属店铺">
              </el-table-column>            
              <el-table-column
                label="状态"
                prop="userStatus">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" round>编辑</el-button>
                  <el-button size="mini" round>
                    <router-link :to="{path: '/main/analysis'}">分析</router-link>
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
            :total="products.length">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
</template>
<script>
  // import { ROLE } from '../../../static/enum.js'
  export default {
    data () {
      return {
        products: [],
        pageSize: 15,
        pageProducts: [],
        search_val: '',
        showLiked: false,
        options: [],
        productType: ''
      }
    },
    created () {
      for (let i = 1; i <= 5; i++) {
        this.products.push({
          index: i,
          name: '测试数据' + i,
          role: Math.round(Math.random() * 10),
          sales: Math.round(Math.random() * 45 + 55),
          userId: '员工号码',
          userName: '员工名',
          userImg: '',
          shops: [
            '1', '2', '3'
          ],
          userStatus: 0
        })
      }
      this.pageProducts = this.products.slice(0, this.pageSize)
    },
    methods: {
      updatePageProducts (currentPage) {
        let start = (currentPage - 1) * this.pageSize
        let lastPageSize = this.products.length % this.pageSize
        let isLastPage = Math.ceil(this.products.length / this.pageSize) === currentPage
        let end = start + (isLastPage ? lastPageSize : this.pageSize)
        this.pageProducts = this.products.slice(start, end)
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
</style>
  
  