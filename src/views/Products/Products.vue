<template>
  <div>
    <el-row>
      <el-form ref="form">
        <el-col :span="3" style="padding-right: 5px;">
          <el-form-item>
            <el-select v-model="shopid" placeholder="选择店铺">
              <el-option
                v-for="shop in shopList"
                :key="shop.value"
                :label="shop.shopName"
                :value="shop.shopID">
              </el-option>
            </el-select>
          </el-form-item>
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
          <el-button type="primary" icon="el-icon-search" @click="getPageProducts">搜索</el-button>
        </el-col>
        <el-col :span="7" class="text-right">
          <el-form-item>
            <el-checkbox v-model="showLiked">只显示我关注的</el-checkbox>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24" class="text-right">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          @current-change="updatePageProducts"
          :page-size="pageSize"
          :total="productTotal">
        </el-pagination>
      </el-col>
      <el-col :span="24">
        <el-table
            :data="products">
            <el-table-column
              type="selection">
            </el-table-column>
            <el-table-column
              label="商品"
              sortable>
              <template slot-scope="scope">
                <i class="el-icon-picture"></i>
                </template>              
            </el-table-column>
            <el-table-column
              label="产品描述"
              prop="name"
              sortable>
            </el-table-column>
            <el-table-column
              label="所属店铺"
              prop="shopName"
              sortable>
            </el-table-column>            
            <el-table-column
              label="销量"
              prop="orders"
              sortable>
            </el-table-column>
            <el-table-column
              label="S/N码"
              prop="asin">
            </el-table-column>
            <el-table-column
              label="价格"
              prop="price">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button size="mini" round>
                  <router-link :to="{path: '/main/edit-product', query: scope.row}">编辑</router-link>
                </el-button>
                <br />
                <el-button size="mini" round>
                  <router-link :to="{path: '/main/analysis', query: {shopid: scope.row.shopID, productId: scope.row.asin}}">分析</router-link>
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
          :total="productTotal">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '../../utils/api'

export default {
  data () {
    return {
      products: [],
      pageSize: 15,
      productTotal: 0,
      currentPage: 1,
      pageProducts: [],
      search_val: '',
      showLiked: false,
      shopid: undefined,
      shopList: [],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      productType: ''
    }
  },
  created () {
    this.getShopList()
    this.getPageProducts()
  },
  methods: {
    getPageProducts () {
      const pagination = {
        pagesize: this.pageSize,
        currentpage: this.currentPage
      }

      api.post('/api/product/pagination', {pagination}).then(res => {
        if (res.status === 200 && res.data) {
          this.products = res.data.grid
          this.productTotal = res.data.pagination.total
        }
      })
    },
    getShopList () {
      api.get('/api/shop').then(res => {
        this.shopList = res.data
      })
    },
    updatePageProducts (currentPage) {
      this.currentPage = currentPage
      this.getPageProducts()
    }
  }
}
</script>

