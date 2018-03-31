<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="本产品" name="sales">
        <el-row>
          <el-col :span="24" style="padding-top: 0;">
            <chart 
              :options="statisticsBar"
              :init-options="initOptions"
              auto-resize
            />
          </el-col>
        </el-row>         
      </el-tab-pane>
      <el-tab-pane v-for="ca of categories" :key="ca" :label="getTabName(ca)" :name="ca">
        <el-row>
          <el-col :span="24" style="padding-top: 0;">
            <chart 
              :options="categoryBar(ca)"
              :init-options="initOptions"
              auto-resize
            />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-for="kw of keywords" :key="kw" :label="getTabName(kw)" :name="kw">
        <el-row>
          <el-col :span="24" style="padding-top: 0;">
            <chart 
              :options="categoryBar(kw)"
              :init-options="initOptions"
              auto-resize
            />
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <product-search 
      v-if="Object.keys(dynamicHeaders).length > 0"
      v-on:showHideColumns="showHideColumns"
      v-on:processUnitChange="processUnitChange"
      v-on:processDateRangeChange="processDateRangeChange"
      :columns="dynamicHeaders"
      :salesUnit="salesUnit" 
      :dateRange="dateRange"
    />

    <el-table 
      border
      stripe
      height="500"
      :data="productsData">
      <el-table-column
        sortable
        prop="date"
        label="日期">
      </el-table-column>
      <el-table-column 
        width="100%" 
        v-for="(headerName, index) in Object.keys(dynamicHeaders)" 
        :key="headerName + '_' + index" 
        :label="headerName"
        v-if="dynamicHeaders[headerName]">
        <template slot-scope="scope" v-if="scope.row.other[headerName]">
          {{scope.row.other[headerName].value}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from 'moment'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markArea'
import api from '@/utils/api'
import productSearch from '@/components/productSearch/productSearch'
import { Message } from 'element-ui'

export default {
  data () {
    return {
      activeName: 'sales',
      salesUnit: '7',
      latestUnit: '5',
      productId: this.$route.query.productId,
      shopId: this.$route.query.shopId,
      categories: [],
      keywords: [],
      dateRange: [],
      legends: [],
      dynamicHeaders: {},
      productsData: [],
      currentStatistics: [],
      competitionStatistics: [],
      chartTitle: '',
      initOptions: {
        renderer: 'svg'
      },
      mockWorkFlow: [
        {name: '建议0001', status: 'finished', content: '这是一个建议', date: '2018-03-10'},
        {name: '建议0002', status: 'finished', content: '这是一个建议', date: '2018-03-18'}
      ],
      toolBoxOptions: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: {readOnly: false},
          magicType: {type: ['line', 'bar']},
          restore: {},
          saveAsImage: {}
        }
      }
    }
  },
  created () {
    this.getStatistics()
  },
  methods: {
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
      this.dynamicHeaders = Object.assign({}, this.dynamicHeaders)
    },
    handleClick (tab, event) {
      this.chartTitle = tab.name
      console.log(tab, event)
    },
    getTabName (name) {
      const arr = name.split(' > ')
      let txt1 = ''
      if (name.substring(0, 8) === 'category') {
        txt1 = '类目'
      } else {
        txt1 = '关键字'
      }
      console.log('name', name, arr)
      return txt1 + arr.length
    },
    udpateSalesChart (unit, period) {
      let params

      if (period.length === 2) {
        params = {
          period: {
            start: period[0],
            end: period[1]
          },
          unit: unit,
          productId: this.productId,
          shopId: this.shopId
        }
      }
      this.productsData = []
      // this.dynamicHeaders = {}
      this.getStatistics(params)
    },
    processUnitChange (unit) {
      this.salesUnit = unit
      this.udpateSalesChart(unit, this.dateRange)
    },
    processDateRangeChange (range) {
      this.dateRange = range
      this.udpateSalesChart(this.salesUnit, range)
    },
    getStatistics (params) {
      let self = this

      if (!params) {
        let yesterday = moment().subtract(30, 'days')
        let format = 'YYYY-MM-DD'

        params = {
          period: {
            start: yesterday.format(format),
            end: moment().format(format)
          },
          unit: this.salesUnit,
          productId: this.productId,
          shopId: this.shopId
        }
      }

      this.$store.dispatch('setLoadingState', true)
      api.post('/api/product/statistics', params).then(res => {
        if (res.status === 200 && res.data) {
          self.currentStatistics = res.data
          self.parseCategories(self.currentStatistics)
          // console.log(self.currentStatistics)

          api.post('/api/product/competition', params).then(res1 => {
            this.$store.dispatch('setLoadingState', false)
            if (res1.status === 200 && res1.data) {
              self.competitionStatistics = res1.data
              self.parseStatisticsTableData()
            }
          }).catch(err => {
            this.$store.dispatch('setLoadingState', false)
            Message({
              showClose: true,
              message: err.response.statusText,
              type: 'error'
            })
          })
        }
      }).catch(err => {
        Message({
          showClose: true,
          message: err.response.statusText,
          type: 'error'
        })
        this.$store.dispatch('setLoadingState', false)
      })
    },
    parseCategories (statistics) {
      let self = this
      if (Array.isArray(statistics) && statistics.length > 0) {
        self.categories = []
        self.keywords = []
        statistics.map((dt, index) => {
          if (dt.name &&
            typeof dt.name === 'string') {
            self.legends.push(dt.name)
            if (dt.name.startsWith('category:') === true) {
              // dt.name.substr(10)
              self.categories.push(dt.name)
            }
            if (dt.name.startsWith('keyword:') === true) {
              // dt.name.substr(9)
              self.keywords.push(dt.name)
            }
          }
        })
      }
    },
    parseStatisticsTableData () {
      var self = this
      if (Array.isArray(self.currentStatistics) && self.currentStatistics.length > 0) {
        var productsData = {}

        self.currentStatistics.map(dt => {
          dt.info.map((io, index) => {
            if (!productsData[io.label]) {
              productsData[io.label] = {}
            }
            if (!self.dynamicHeaders[dt.name]) {
              self.dynamicHeaders[dt.name] = true
            }
            productsData[io.label][dt.name] = Object.create(io)
          })
        })
        // console.log(self.dynamicHeaders)

        // transform object to array
        self.productsData = []
        for (var x in productsData) {
          var item = productsData[x]
          self.productsData.push({
            date: x,
            other: item
          })
        }
        self.productsData.sort((a, b) => {
          if (a.date > b.date) return -1
          if (a.date < b.date) return 1
          return 0
        })
        // console.log(self.productsData)
        return productsData
      }
    },
    categoryBar (tabName) {
      // only process active tab
      if (this.activeName === tabName) {
        let composedArry = []
        this.competitionStatistics.map(pro => {
          let params = pro.info.filter(param => param.name === tabName)
          composedArry.push({
            id: pro.id,
            data: params.length === 0 ? [] : params[0].info
          })
        })
        composedArry.forEach(c => {
          c.data.forEach(d => {
            delete d.rate
          })
        })
        return {
          title: {
            text: this.chartTitle,
            top: 0
          },
          legend: {
            top: 24,
            data: composedArry.map(dt => dt.id)
          },
          toolbox: this.toolBoxOptions,
          xAxis: {
            type: 'category',
            boundaryGap: false,
            minInterval: 1,
            data: composedArry[0].data.map(dt => dt.label)
          },
          yAxis: {
            inverse: true,
            type: 'value'
          },
          tooltip: {
            trigger: 'axis'
          },
          series: composedArry.map(dt => {
            let name = dt.id
            let type = 'line'
            let markPoint = {
              clickable: true,
              data: this.mockWorkFlow.map(m => {
                return {
                  name: m.name, value: m.name, xAxis: m.date, yAxis: composedArry[0].data.find(dt => dt.label === m.date).value
                }
              })
            }
            let data = dt.data.map(i => i.value)
            return {name, type, markPoint, data}
          })
        }
      }
      return {}
    }
  },
  computed: {
    statisticsBar () {
      var self = this
      if (Array.isArray(self.currentStatistics) && self.currentStatistics.length > 0) {
        var selected = {}
        self.currentStatistics.map((dt, index) => {
          if (index < 3) {
            selected[dt.name] = true
          } else {
            selected[dt.name] = false
          }
        })
        return {
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              let res = '' + params[0].name + '</br>'
              params.forEach(param => {
                res = res + param.seriesName + ': ' + self.currentStatistics[param.seriesIndex].info[param.dataIndex].value + '</br>'
              })
              return res
            }
          },
          legend: {
            data: self.currentStatistics.map(dt => dt.name),
            selected: selected
          },
          toolbox: self.toolBoxOptions,
          xAxis: {
            type: 'category',
            boundaryGap: false,
            minInterval: 1,
            data: self.currentStatistics[0].info.map(dt => dt.label)
          },
          yAxis: {
            type: 'value'
          },
          series: self.currentStatistics.map(dt => {
            let name = dt.name
            let type = 'line'
            let markPoint = {
              clickable: true,
              data: this.mockWorkFlow.map(m => {
                return {
                  name: m.name, value: m.name, xAxis: m.date, yAxis: 0
                }
              })
            }
            let data = dt.info.map(i => i.rate)
            return {name, type, markPoint, data}
          })
        }
      }
    }
  },
  components: {
    productSearch
  }
}
</script>

<style scoped>
.br {
  margin-bottom: 15px;
  height: 15px;
  width: 100%;
}
.header-row-class-name> th> .cell {
  font-size: 12px;
}
.cell-class-name {
  font-size: 12px;
}
</style>
