<template>
  <div>
    <el-form ref="form">
      <search-bar :shopList="shopList" :nationList="nationList" :periodSelect="7" @onChange="searchBarChange($event)" ></search-bar>
      <!-- <el-row>
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
              <el-select class="period-select" v-model="periodSelect" @change="updateLu">
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
        </el-row> -->

        <el-row>
          <el-col :span="6" style="padding-right: 5px;">
            <el-form-item label="订单">
              <el-input
                class="shop-select"
                placeholder="输入订单号"
                clearable
                v-model="filter.orderId">
              </el-input>
            </el-form-item>
          </el-col> 
          <el-col :span="4" style="padding-right: 5px;">
            <el-form-item label="买家">
              <el-input
                class="nation-select"
                placeholder="请输入买家Id"
                clearable
                v-model="filter.buyerId">
              </el-input>
            </el-form-item>
          </el-col>  
 
          <el-col :span="6" :offset="1">
            <el-form-item label="产品ASIN">
                <el-input
                  placeholder="输入ASIN"
                  class="asin-input"
                  clearable
                  v-model="filter.productId">
                </el-input>
              </el-form-item>
          </el-col>
          <el-col :span="6" style="padding-right: 5px;">
              <el-form-item label="订单状态">
                <el-select clearable v-model="orderStatus" placeholder="选择状态" @change="orderStatusChange" class="shop-select">
                  <el-option
                    v-for="status in statusList"
                    :key="status"
                    :label="status"
                    :value="status">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          <el-col :span="24" :offset="0" class="text-right">
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
          <el-col :span="16">
            <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="currentPage"
            :page-sizes="[20, 50, 100]"
            :page-size="pageSize"
            layout="sizes, total, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
          </el-col>
        <!-- <el-col :span="5" :offset="0" class="text-right"> -->
          <!-- <el-button size="mini" icon="el-icon-plus" @click="ExportCsv">导出表格</el-button> -->
          <!-- </el-col> -->
          <el-col :span="8" class="text-right">
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
        <el-table v-if="gridData.length>0"
          border
          stripe
          :data="gridData">
          <el-table-column 
            v-for="(headerName, index) in Object.keys(dynamicHeaders)" 
            :width="headerWidth[headerName]?headerWidth[headerName]:''"
            :key="headerName + '_' + index" 
            :label="enMap[headerName]"
            v-if="dynamicHeaders[headerName]">
            <template slot-scope="scope" v-if="scope.row[headerName]">
              {{scope.row[headerName]}}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24">
          <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="currentPage"
          :page-sizes="[20, 50, 100]"
          :page-size="pageSize"
          layout="sizes, total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
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
import searchBar from '@/components/search-bar/search-bar'

export default {
  components: {
    VueCsvDownload,
    searchBar
  },
  data () {
    return {
      orderStatus: '',
      download: [],
      filter: {
        shopId: null,
        // asinOrName: '',
        period: {
          start: '',
          end: ''
        },
        status: ['Pendding', 'Unshipped', 'Shipped', 'Canceled'],
        countryCode: '',
        productId: '',
        buyerId: '',
        ordeId: ''
      },
      mockData: [
        {date: '', orderId: '', status: '', asin: '', productName: '', buyerName: '', buyerId: '', quantity: '', price: '', country: '', shopId: ''}
        // {date: '11111-111', orderId: 'asdadasdasdasdasd', status: 'xxxx', asin: 'xxxxxxxxx', productName: '12121212', buyerName: 'asdasd', buyerId: '1212123', quantity: '1212', price: 200, country: 'UK', shopId: '2'},
        // {date: '11111-111', orderId: 'asdadasdasdasdasd', status: 'xxxx', asin: 'xxxxxxxxx', productName: '12121212', buyerName: 'asdasd', buyerId: '1212123', quantity: '1212', price: 200, country: 'UK', shopId: '3'},
        // {date: '11111-111', orderId: 'asdadasdasdasdasd', status: 'xxxx', asin: 'xxxxxxxxx', productName: '12121212', buyerName: 'asdasd', buyerId: '1212123', quantity: '1212', price: 200, country: 'UK', shopId: '4'},
        // {date: '11111-111', orderId: 'asdadasdasdasdasd', status: 'xxxx', asin: 'xxxxxxxxx', productName: '12121212', buyerName: 'asdasd', buyerId: '1212123', quantity: '1212', price: 200, country: 'UK', shopId: '5'}
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
      nationList: [],
      statusId: '',
      statusList: ['All', 'Pendding', 'Unshipped', 'Shipped', 'Canceled'],
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
      periodSelect: 7,
      dr: null,
      searchField: {
        productId: '',
        auditor: '',
        proposer: ''
      },
      headers: [],
      headerWidth: {
        reviewDate: 100,
        reviews: 70,
        score: 60,
        operatorId: 100,
        orders: 60,
        lastUpdateTime: 160,
        'Session Percentage': 90
      },
      enMap: {
        date: '购买时间',
        orderId: '订单号',
        status: '订单状态',
        asin: 'ASIN',
        productName: '产品名字',
        buyerName: '买家名字',
        buyerId: '买家ID',
        quantity: '订单数量',
        price: '订单价格',
        country: '国家',
        shopId: '店铺'
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
    // this.search_val = this.$route.query.productId
    // this.shopId = this.$route.query.shopId

    this.getShopList()
    this.getNationList()

    this.getPageProducts()
  },
  methods: {
    orderStatusChange (evnet) {
      console.log(this.orderStatus)
      if (this.orderStatus === 'All') {
        this.filter.status = ['Pendding', 'Unshipped', 'Shipped', 'Canceled']
      } else {
        this.filter.status = [this.orderStatus]
      }
    },
    searchGrid () {
      this.getPageProducts()
    },
    sizeChange (e) {
      this.pageSize = e
      this.getPageProducts()
    },
    currentChange (e) {
      this.currentPage = e
      this.getPageProducts()
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
        if (key !== 'review') {
          this.dynamicHeaders[key] = true
          this.headers = [...this.headers, key]
        }
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
      this.getPageProducts()
    },
    getPageProducts () {
      let pagination = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      // if (filter) {
      //   pagination.filter = filter
      // }
      pagination.filter = this.filter
      const period = this.filter.period
      // delete this.filter.period
      // request.filter = {}
      this.$store.dispatch('setLoadingState', true)
      // this.gridData = this.mockData
      // this.download = this.gridData
      // this.total = this.mockData.length

      // this.$store.dispatch('setLoadingState', false)
      api.post('/api/product/orders', {pagination, period}).then(res => {
        if (res.status === 200 && res.data) {
          this.gridData = res.data.grid
          this.download = this.gridData
          this.total = res.data.pagination.total
          this.createHeader()
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
    getNationList () {
      api.get('/api/country').then(res => {
        this.nationList = res.data.grid
        this.nationListBK = this.nationList
      })
    },
    searchBarChange (filter) {
      console.log('searchBarChange', filter)
      this.filter = {...this.filter, ...filter}
      this.getPageProducts()
    },
    updatePageProducts (currentPage) {
      this.currentPage = currentPage
      this.getPageProducts()
    },
    showHideLiked () {
      let filter = {
        productId: this.search_val,
        shopId: this.shopId,
        interestedOnly: this.isShowLiked ? 1 : undefined
      }
      this.getPageProducts(filter)
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
<style>
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

.period-select {
  width: 150px!important;
}

.shop-select {
  width: 160px!important;
}
.el-checkbox+.el-checkbox {
  margin-left: 0!important;
}
</style>

