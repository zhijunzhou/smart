<template>
  <div>
    <el-form ref="form">
      <el-row class="first-search">
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
    </el-row>
  <el-row>
        <el-col :span="8">
          <el-form-item>
            <el-radio-group v-model="radio">
              <el-radio :label="3">按店铺</el-radio>
              <el-radio :label="6">按订单</el-radio>
              <el-radio :label="9">按数量</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="text-left">
          <el-form-item>
            <el-checkbox v-model="isShowLiked" @change="showHideLiked">只显示我关注的</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-input
            placeholder="请输入产品ASIN"
            v-model="search_val"
            @clear="searchProduct"
            clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchProduct">搜索</el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="8">
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
      <el-col :span="16" class="text-right">
        <vue-csv-download
          :data="download"
          :fields="fieldsCn"
          class="download"
          >
          <el-button size="mini" icon="el-icon-document">下载</el-button>
        </vue-csv-download>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-table
            :data="gridData">
            <el-table-column
              label="店铺"
              width="150"
              prop="shopName"
              >
            </el-table-column>
            <el-table-column
              label="国家"
              width="60"
              prop="marketPlaceName"
              >
            </el-table-column>  
            <el-table-column
              label="ASIN"
              width="120">
              <template slot-scope="scope">
                <a :href="scope.row.url">{{scope.row.productASIN}}</a>
                <div v-for="cp in scope.row.competitors" :key="cp">
                  {{cp}}&nbsp;<el-tag type="success" size="mini">竞</el-tag> 
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="产品名称"
              width="200"
              sortable>
              <template slot-scope="scope">
                {{scope.row.productName}}
                <i class="el-icon-edit" @click="changeName(scope.row)"></i>
              </template>
            </el-table-column>
 
            <el-table-column v-for="orderData in gridData[0].orderList"
              :label="orderData.label"
              width="100"
              :prop="orderData.label"
              >
            </el-table-column>
            <el-table-column
              label="合计"
              width="100"
              prop="totalCount"
              fixed="right"
              >
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              width="200"
              fixed="right"
              label="操作">
              <template slot-scope="scope">
                <el-button size="mini" round @click="add(scope.row)">
                  建议
                </el-button>
                <router-link :to="{path: '/main/edit-product', query: scope.row}">
                  <el-button size="mini" round>
                    编辑
                  </el-button>
                </router-link>
                <router-link :to="{path: '/main/analysis', query: {shopId: scope.row.shopId, productId: scope.row.productASIN}}">
                  <el-button size="mini" round>
                    分析
                  </el-button>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              fixed="right"
              label="关注">
              <template slot-scope="scope">
                <i class="el-icon-star-off large-icon" title="点击关注" v-if="isNotLike(scope.row)" @click="likeProduct(scope.row, true)"></i>
                <i class="el-icon-star-on large-icon" title="取消关注" v-else @click="likeProduct(scope.row, false)"></i>
              </template>              
            </el-table-column>
          </el-table>
      </el-col>
      <el-col :span="24" class="text-left">
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
    <el-dialog title="工作流" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="ASIN" :label-width="formLabelWidth">
              {{form.productASIN}}
          </el-form-item>
          <!-- <el-form-item label="产品描述" :label-width="formLabelWidth">
              {{form.name}}
          </el-form-item> -->
          <el-form-item label="产品名称" :label-width="formLabelWidth">
            {{form.productName}}
          </el-form-item>
          <el-form-item label="优化类型" :label-width="formLabelWidth">
            <el-select v-model="form.optimizationType" placeholder="选择优化类型">
              <el-option
                v-for="option in optimizationTypes"
                :key="option.typeId"
                :label="option.typeName"
                :value="option.typeName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属店铺" :label-width="formLabelWidth">
            {{form.shopName}}
          </el-form-item>
          <el-form-item label="所属国家" :label-width="formLabelWidth">
              {{form.marketPlaceName}}
            </el-form-item>
          <el-form-item label="建议主题" :label-width="formLabelWidth">
            <el-row>
              <el-col :span="10">
                <el-input v-model="form.title"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="建议" :label-width="formLabelWidth">
              <el-input type="textarea" :maxlength="maxlength" :autosize="{ minRows: 3, maxRows: 5}" :placeholder="'请输入建议内容, 最大字数' + maxlength" v-model="form.suggestion"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>        
          <el-button type="primary" @click="saveWork" v-if="modalType === 'add'">保  存</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import api from '../../utils/api'
import { Message } from 'element-ui'
import {PERIOD_OPTIONS} from '../../utils/enum'
import VueCsvDownload from '@/components/csvDownload/csvDownload'
import moment from 'moment'

export default {
  components: {
    VueCsvDownload
  },
  data () {
    return {
      radio: 0,
      maxlength: 200,
      gridData: [],
      periodSelect: 7,
      filter: {
        period: {
          start: '2017-07-02',
          end: '2017-09-21'
        }
      },
      dr: null,
      nationId: '',
      periodOptions: PERIOD_OPTIONS,
      nationList: ['US', 'UK', 'DE', 'FR', 'IT', 'ES', 'JP'],
      pageSize: 15,
      total: 0,
      currentPage: 1,
      pageProducts: [],
      search_val: undefined,
      shopId: undefined,
      isShowLiked: false,
      likedProducts: [],
      shopList: [],
      formLabelWidth: '120px',
      options: [],
      productType: '',
      modalType: 'add',
      dialogFormVisible: false,
      optimizationTypes: [
      ],
      download: [],
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
      let headers = []
      if (this.gridData.length > 0) {
        for (let key in this.gridData[0]) {
          headers.push(key)
        }
      } else {
        headers = []
      }
      return headers
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
    changeName (row) {
      this.$prompt('请输入产品名称', '提示', {
        confirmButtonText: '确定',
        inputValue: row.productName,
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const shopId = row.shopId
        const name = value
        api.post(`/api/product/name/${row.productASIN}`, {shopId, name}).then(res => {
          this.$message({
            showClose: true,
            message: '更新成功!',
            type: 'success'
          })
          this.getPageProducts()
        }).catch(err => {
          this.errorHandler(err, {code: 404, message: '产品未找到'})
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '取消输入'
        // })
      })
    },
    updateDateRangeValue () {
      console.log(this.dr)
    },
    sizeChange () {

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
    getShopName (shopId) {
      const finder = this.shopList.find(s => s.shopId === shopId)
      return finder ? finder.shopName : ''
    },
    listSuggestTypes () {
      api.get(`/api/suggest_type`).then(res => {
        this.optimizationTypes = res.data
      })
    },
    saveWork () {
      let self = this
      self.form.productName = self.form.productName
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
    add (row) {
      console.log(row)
      const {asin, shopId, name} = row
      this.modalType = 'add'
      this.dialogFormVisible = true
      this.form.productId = asin
      this.form.name = name
      this.form.shopId = shopId
      this.form.productName = undefined
      this.form.optimizationType = undefined
      this.form.suggestion = undefined
      this.form.title = undefined
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
    getPageProducts () {
      let pagination = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      this.filter.period.start = moment().subtract(this.periodSelect, 'days').format('YYYY-MM-DD')
      this.filter.period.end = moment().format('YYYY-MM-DD')
      pagination.filter = this.filter
      this.$store.dispatch('setLoadingState', true)
      api.post('/api/product/pagination', {pagination}).then(res => {
        if (res.status === 200 && res.data) {
          this.gridData = res.data.grid
          this.download = this.gridData
          this.total = res.data.pagination.total
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
    currentChange (currentPage) {
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
<style>
.el-icon-star-off {
  color:#FF6600
}

.el-icon-edit {
  color:#FF6600
}

.el-icon-star-on {
  color:#FF6600
}

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

.radio-select {
  margin-top: 10px;
}
</style>

