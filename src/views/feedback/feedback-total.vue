<template>
  <div>
    <el-form ref="form">
      <el-row>
        <el-col :span="6" style="padding-right: 5px;">
          <el-form-item label="店铺">
            <el-select clearable v-model="shopId" placeholder="选择店铺" class="shop-select">
              <el-option
                v-for="shop in shopList"
                :key="shop.value"
                :label="shop.shopName"
                :value="shop.shopId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" style="padding-right: 5px;">
          <el-form-item label="国家">
            <el-select clearable v-model="nationId" placeholder="选择国家" class="nation-select">
              <el-option
                v-for="nation in nationList"
                :key="nation.value"
                :label="nation"
                :value="nation">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
            <el-form-item label="选择时间">
              <el-select class="time-select" v-model="periodSelect" @change="updateLu">
                <el-option
                v-for="item in periodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="periodSelect===0">
              <el-date-picker
                v-model="dr"
                @change="updateDateRangeValue"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item v-else>&nbsp;</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5" style="padding-right: 5px;">
            <el-form-item label="星评">
              <el-select clearable v-model="stars" placeholder="选择星评" class="shop-select">
                <el-option
                  v-for="rate in rateList"
                  :key="rate"
                  :label="rate"
                  :value="rate">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品ASIN">
                <el-input
                  placeholder="输入ASIN"
                  type="textarea"
                  class="asin-input"
                  clearable
                  v-model="searchField.auditor">
                </el-input>
              </el-form-item>
          </el-col>
          <el-col :span="5" :offset="0">
              <el-button type="primary" round icon="el-icon-search" @click="searchGrid">搜索</el-button>
              <el-button type="" round icon="el-icon-search" @click="searchGrid">重置</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-popover
            ref="showHideColumns"
            trigger="hover">
            <el-checkbox-group v-model="checkedList" @change="updateVisibleColumns">
              <el-checkbox v-for="(header, index) of headers" :key="index" :label="header" style="width: 100%;"></el-checkbox>
            </el-checkbox-group>
          </el-popover>
          <el-col :span="8">
            <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="currentPage"
            :page-sizes="[20, 50, 100]"
            :page-size="pageSize"
            layout="sizes, total, prev, pager, next"
            :total="total">
          </el-pagination>
        </el-col>
        <el-col :span="16" class="text-right">
          <el-button size="mini" v-popover:showHideColumns>显示/隐藏列</el-button>
          <vue-csv-download
            :data="download"
            :fields="fieldsCn"
            class="download"
            >
            <el-button size="mini" icon="el-icon-document">下载</el-button>
          </vue-csv-download>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-table 
          border
          stripe
          height="500"
          :data="gridData">
          <el-table-column 
            v-for="(headerName, index) in Object.keys(dynamicHeaders)" 
            :width="headerWidth[headerName]?headerWidth[headerName]:''"
            :key="headerName + '_' + index" 
            :label="headerName"
            v-if="dynamicHeaders[headerName]">
            <template slot-scope="scope" v-if="scope.row[headerName]">
              {{scope.row[headerName]}}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '../../utils/api'
import { Message } from 'element-ui'
import moment from 'moment'
import VueCsvDownload from '@/components/csvDownload/csvDownload'
import {PERIOD_OPTIONS} from '../../utils/enum'

export default {
  components: {
    VueCsvDownload
  },
  data () {
    return {
      mockData: [
        {sellerId: '11111-111', asin: 'xxxxxxxxx', currentQuantity: '1212', totalQuantity: '1212', data1: '5', data2: '5', data3: '5', currentStars: '4', AverageStars: '4'},
        {sellerId: '11111-211', asin: 'xxxxxxxxx', currentQuantity: '1212', totalQuantity: '1212', data1: '5', data2: '5', data3: '5', currentStars: '4', AverageStars: '4'},
        {sellerId: '11111-311', asin: 'xxxxxxxxx', currentQuantity: '1212', totalQuantity: '1212', data1: '5', data2: '5', data3: '5', currentStars: '4', AverageStars: '4'},
        {sellerId: '11111-411', asin: 'xxxxxxxxx', currentQuantity: '1212', totalQuantity: '1212', data1: '5', data2: '5', data3: '5', currentStars: '4', AverageStars: '4'},
        {sellerId: '11111-511', asin: 'xxxxxxxxx', currentQuantity: '1212', totalQuantity: '1212', data1: '5', data2: '5', data3: '5', currentStars: '4', AverageStars: '4'},
        {sellerId: '11111-611', asin: 'xxxxxxxxx', currentQuantity: '1212', totalQuantity: '1212', data1: '5', data2: '5', data3: '5', currentStars: '4', AverageStars: '4'}
      ],
      stars: '',
      dynamicHeaders: {},
      checkedList: [],
      periodOptions: PERIOD_OPTIONS,
      rateList: [1, 2, 3, 4, 5],
      pageSize: 20,
      total: 0,
      currentPage: 1,
      maxlength: 200,
      nationId: '',
      nationList: ['US', 'UK', 'DE', 'FR', 'IT', 'ES', 'JP'],
      statusId: '',
      statusList: ['All', 'Active', 'Processing Succeed', 'Failed Deleted'],
      userId: '',
      userList: [],
      gridData: [],
      productTotal: 0,
      pageProducts: [],
      search_val: undefined,
      shopId: undefined,
      isShowLiked: false,
      likedProducts: [],
      shopList: [],
      formLabelWidth: '120px',
      options: [],
      productType: '',
      dialogFormVisible: false,
      optimizationTypes: [
      ],
      periodSelect: null,
      dr: null,
      searchField: {
        productId: '',
        auditor: '',
        proposer: ''
      },
      headers: [],
      headerWidth: {
        sellerId: 240,
        currentQuantity: 140,
        asin: 120,
        QA: 40,
        orders: 60,
        lastUpdateTime: 160,
        'Session Percentage': 90
      },
      form: {
        productId: '',
        shopId: undefined,
        productName: '',
        optimizationType: '',
        suggestion: '',
        title: '',
        sn: 1
      }
    }
  },
  computed: {
    fieldsCn () {
      return this.headers
    }
  },
  created () {
    this.search_val = this.$route.query.productId
    this.shopId = this.$route.query.shopId

    this.getShopList()

    if (this.search_val && this.shopId) {
      this.searchProduct()
    } else {
      this.getPageProducts()
    }
    this.listSuggestTypes()
  },
  methods: {
    searchGrid () {

    },
    sizeChange () {

    },
    currentChange () {

    },
    updateVisibleColumns () {
      this.showHideColumns(this.checkedList)
      // this.headers = this.checkedList
    },
    showHideColumns (newHeaders) {
      for (let dh in this.dynamicHeaders) {
        let found = newHeaders.find(nh => {
          return dh === nh
        })
        if (found) {
          this.dynamicHeaders[dh] = true
        } else {
          this.dynamicHeaders[dh] = false
        }
      }
      this.dynamicHeaders = { ...this.dynamicHeaders }
    },
    createHeader () {
      for (let key in this.gridData[0]) {
        this.dynamicHeaders[key] = true
        this.headers = [...this.headers, key]
      }
      this.checkedList = this.headers
      delete this.dynamicHeaders.reviewDate
      // this.gridData.map(dt => {
      //   dt.info.map((io, index) => {
      //     if (!this.gridData[io.label]) {
      //       this.gridData[io.label] = {}
      //     }
      //     if (!self.dynamicHeaders[dt.name]) {
      //       self.dynamicHeaders[dt.name] = true
      //     }
      //     this.gridData[io.label][dt.name] = Object.create(io)
      //   })
      // })
    },
    updateLu () {
      let format = 'YYYY-MM-DD'
      let start = moment().subtract(this.periodSelect, 'days').format(format)
      let end = moment().format(format)
      const status = this.getStatus

      console.log('updateLu', status, start, end)
      // this.searchField.period = {
      //   dateType: status.join(','),
      //   start: start,
      //   end: end
      // }
      // this.getPageWorkflows()
    },
    updateDateRangeValue () {
      console.log(this.dr)
    },
    listSuggestTypes () {
      api.get(`/api/suggest_type`).then(res => {
        this.optimizationTypes = res.data
      })
    },
    saveWork () {
      let self = this
      self.form.sn = undefined
      api.post(`/api/suggestion`, self.form).then(res => {
        Message({
          showClose: true,
          message: '更新成功!',
          type: 'success'
        })
        self.dialogFormVisible = false
        self.getPageWorkflows(true)
      }).catch(err => {
        self.errorHandler(err, {code: 404, message: '产品未找到'})
      })
    },
    edit (row) {
      console.log(row)
      this.form = row
      this.dialogFormVisible = true
    },
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
      this.gridData = this.mockData
      this.download = this.gridData
      this.total = this.mockData.length
      this.createHeader()
      this.$store.dispatch('setLoadingState', false)
      // api.post('/api/product/pagination', {pagination}).then(res => {
      //   if (res.status === 200 && res.data) {
      //     this.products = res.data.grid
      //     this.productTotal = res.data.pagination.total
      //     this.listLikedProducts()
      //   }
      //   this.$store.dispatch('setLoadingState', false)
      // }).catch(err => {
      //   this.$store.dispatch('setLoadingState', false)
      //   Message({
      //     showClose: true,
      //     message: err.response.statusText,
      //     type: 'error'
      //   })
      // })
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
    },
    errorHandler (err, specialCase) {
      if (specialCase && err.request.status === specialCase.code) {
        Message({
          showClose: true,
          message: specialCase.message,
          type: 'error'
        })
      } else if (err.request.status === 403) {
        Message({
          showClose: true,
          message: '当前用户权限不足',
          type: 'error'
        })
      } else if (err.request.status === 431) {
        Message({
          showClose: true,
          message: '数据提交冲突',
          type: 'error'
        })
      } else {
        Message({
          showClose: true,
          message: err.response.statusText,
          type: 'error'
        })
      }
    }
  }
}
</script>
<style scoped>
.el-icon-star-off {
  color:#FF6600
}

.nation-select {
  width: 110px!important;
}
.el-icon-star-on {
  color:#FF6600
}

.asin-input {
  width: 150px!important;
}
.rate-select {
  width: 110px!important;
}

.time-select {
  width: 150px!important;
}

.shop-select {
  width: 160px!important;
}
.el-checkbox+.el-checkbox {
  margin-left: 0!important;
}
</style>

