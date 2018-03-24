<template>
  <div>
    <el-row>
      <el-form ref="form">
        <el-col :span="8" style="padding-right: 5px;">
          <el-form-item label="店铺">
            <el-select v-model="shopId" placeholder="选择店铺">
              <el-option
                v-for="shop in shopList"
                :key="shop.value"
                :label="shop.shopName"
                :value="shop.shopId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8"></el-col>
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
          <el-button type="primary" icon="el-icon-search" @click="searchProduct">搜索</el-button>
        </el-col>
        <el-col :span="7" class="text-right">
          <el-form-item>
            <el-checkbox v-model="isShowLiked" @change="showHideLiked">只显示我关注的</el-checkbox>
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
              width="80"
              sortable>
              <template slot-scope="scope">
                <i class="el-icon-picture"></i>
                </template>              
            </el-table-column>
            <el-table-column
              label="S/N码"
              width="180">
              <template slot-scope="scope">
                <b>{{scope.row.asin}}</b>
                <div v-for="cp in scope.row.competitors" :key="cp">
                  {{cp}}&nbsp;<el-tag type="success" size="mini">竞</el-tag> 
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="商品描述"
              width="200"
              prop="name"
              sortable>
            </el-table-column>
            <el-table-column
              label="所属店铺"
              width="100"
              prop="shopName"
              sortable>
            </el-table-column>            
            <el-table-column
              label="销量"
              width="100"
              prop="orders"
              sortable>
            </el-table-column>
            <el-table-column
              label="价格"
              width="100"
              prop="price"
              sortable>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              label="操作">
              <template slot-scope="scope">
                <router-link :to="{path: '/main/edit-product', query: scope.row}">
                  <el-button size="mini" round>
                    编辑
                  </el-button>
                </router-link>
                <router-link :to="{path: '/main/analysis', query: {shopId: scope.row.shopId, productId: scope.row.asin}}">
                  <el-button size="mini" round>
                    分析
                  </el-button>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              label="关注">
              <template slot-scope="scope">
                <i class="el-icon-star-off large-icon" title="点击关注" v-if="isNotLike(scope.row)" @click="likeProduct(scope.row, true)"></i>
                <i class="el-icon-star-on large-icon" title="取消关注" v-else @click="likeProduct(scope.row, false)"></i>
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
import { Message } from 'element-ui'

export default {
  data () {
    return {
      products: [],
      pageSize: 15,
      productTotal: 0,
      currentPage: 1,
      pageProducts: [],
      search_val: undefined,
      shopId: undefined,
      isShowLiked: false,
      likedProducts: [],
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
    isNotLike (product) {
      return !this.likedProducts.find(p => {
        return product.asin === p.productId
      })
    },
    searchProduct () {
      let filter = {
        productId: this.search_val,
        shopId: this.shopId
      }
      this.getPageProducts(filter)
    },
    getPageProducts (filter) {
      let pagination = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      if (filter) {
        pagination.filter = filter
      }

      this.$store.dispatch('setLoadingState', true)
      api.post('/api/product/pagination', {pagination}).then(res => {
        if (res.status === 200 && res.data) {
          this.products = res.data.grid
          this.productTotal = res.data.pagination.total
          this.listLikedProducts()
        }
        this.$store.dispatch('setLoadingState', false)
      }).catch(err => {
        this.$store.dispatch('setLoadingState', false)
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
    updatePageProducts (currentPage) {
      this.currentPage = currentPage
      this.getPageProducts()
    },
    listLikedProducts () {
      api.get(`/api/interested`).then(res => {
        console.log(res.data)
        this.likedProducts = res.data
      })
    },
    showHideLiked () {
      let filter = {
        productId: this.search_val,
        shopId: this.shopId,
        interestedOnly: this.isShowLiked ? 1 : undefined
      }
      this.getPageProducts(filter)
    },
    likeProduct (product, like) {
      let productInfo = {
        productId: product.asin,
        shopId: product.shopId
      }
      if (like === true) {
        api.post(`/api/interested`, productInfo).then(res => {
          if (res && res.status === 200) {
            console.log(res)
            this.listLikedProducts()
          }
        })
      } else {
        let interested = this.likedProducts.find(p => p.productId === product.asin)
        api.delete(`/api/interested/${interested.interestedId}`).then(res => {
          this.listLikedProducts()
        })
      }
    }
  }
}
</script>

