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
      <el-tab-pane v-for="ca of categories" :key="ca" :label="ca" :name="ca">
        <!-- <el-row>
          <el-col :span="24" style="padding-top: 0;">
            <chart 
              :options="statisticsBar"
              :init-options="initOptions"
              auto-resize
            />
          </el-col>
        </el-row> -->
      </el-tab-pane>
    </el-tabs>
    <product-search 
      :options="options" 
      :columns="[]" 
      :latestUnit="latestUnit" 
      :salesUnit="salesUnit" 
      :dateRange="dateRange" 
      :processUnitChange="processUnitChange" 
      :processDateRangeChange="processDateRangeChange"
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
      <el-table-column width="100%" v-for="headerName in Object.keys(dynamicHeaders)" :key="headerName" :label="headerName" show-overflow-tooltip>
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

export default {
  data () {
    return {
      activeName: 'sales',
      salesUnit: '7',
      latestUnit: '5',
      products: [],
      pageSize: 15,
      pageProducts: [],
      productId: this.$route.query.productId,
      shopId: this.$route.query.shopId,
      line: {},
      categories: [],
      dateRange: [],
      replyData: [],
      tableData: [],
      initOptions: {
        renderer: 'svg'
      },
      legends: [],
      dynamicHeaders: {},
      productsData: [],
      currentStatistics: [],
      competitionStatistics: [],
      lineColumns: {
        '类目1排名': true,
        '类目2排名': true,
        '类目3排名': true
      },
      LEGEND: [],
      options: [
        {
          label: '周',
          value: '6'
        }, {
          label: '月',
          value: '7'
        }, {
          label: '季度',
          value: '8'
        }, {
          label: '半年',
          value: '9'
        }, {
          label: '一年',
          value: '10'
        }, {
          label: '两年',
          value: '11'
        }
      ]
    }
  },
  created () {
    this.getStatistics()
  },
  methods: {
    handleClick (tab, event) {},
    udpateSalesChart (unit, period) {
      this.getStatistics()
    },
    processUnitChange (unit) {
      this.udpateSalesChart(unit, this.dateRange)
    },
    processDateRangeChange (range) {
      this.udpateSalesChart(this.salesUnit, range)
    },
    updatePageProducts (currentPage) {
      let start = (currentPage - 1) * this.pageSize
      let lastPageSize = this.products.length % this.pageSize
      let isLastPage = Math.ceil(this.products.length / this.pageSize) === currentPage
      let end = start + (isLastPage ? lastPageSize : this.pageSize)
      this.pageProducts = this.products.slice(start, end)
    },
    getStatistics () {
      let self = this
      let yesterday = moment().subtract(365, 'days')
      let format = 'YYYY-MM-DD'
      const params = {
        period: {
          start: yesterday.format(format),
          end: moment().format(format)
        },
        unit: this.salesUnit,
        productId: this.productId,
        shopId: this.shopId
      }

      api.post('/api/product/statistics', params).then(res => {
        if (res.status === 200 && res.data) {
          self.currentStatistics = res.data
          self.parseCategories(self.currentStatistics)
          // console.log(self.currentStatistics)

          api.post('/api/product/competition', params).then(res1 => {
            if (res1.status === 200 && res1.data) {
              self.competitionStatistics = res1.data
              self.parseRankingData(self.competitionStatistics)
              self.parseStatisticsTableData()
            }
          })
        }
      })
    },
    parseCategories (statistics) {
      let self = this
      if (Array.isArray(statistics) && statistics.length > 0) {
        statistics.map((dt, index) => {
          if (dt.name &&
            typeof dt.name === 'string') {
            self.legends.push(dt.name)
            if (dt.name.startsWith('category:') === true) {
              console.log(dt.name)
              self.categories.push(dt.name.substr(10))
            }
          }
        })
      }
    },
    parseRankingData (infos) {
      if (Array.isArray(infos) && infos.length > 0) {
        infos.map(info => {
          console.log(info.name, info.id)
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
        console.log(self.dynamicHeaders)

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
        console.log(self.productsData)
        return productsData
      }
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
          toolbox: {
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
          },
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
            let type = 'bar'
            let markPoint = {
              data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
              ]
            }
            let data = dt.info.map(i => parseFloat(i.rate.toFixed(4)))
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
