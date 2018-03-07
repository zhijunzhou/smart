<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="本产品" name="sales">
      <el-row>
        <el-col :span="24" style="padding-top: 0;">
          <chart 
            :options="line2"
            :init-options="initOptions"
            auto-resize
          />
      </el-col>
      </el-row>
      <product-search :options="options" :latestUnit="latestUnit" :salesUnit="salesUnit" :dateRange="dateRange" :processUnitChange="processUnitChange" :processDateRangeChange="processDateRangeChange"></product-search>
      <el-row class="text-right">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          @current-change="updatePageProducts"
          :page-size="pageSize"
          :total="products.length">
        </el-pagination>
      </el-row>
      <el-table
        show-summary
        cell-class-name="cell-class-name"
        header-row-class-name="header-row-class-name"
        :data="pageProducts">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          label="日期"
          prop="label"          
          :sort-method="sortByDate">
        </el-table-column>
        <el-table-column
          prop="value"
          :label="LEGEND[0]">
        </el-table-column>
        <el-table-column
          prop="session"
          :label="LEGEND[1]">
        </el-table-column>
        <el-table-column
          prop="session"
          :label="LEGEND[2]">
        </el-table-column>
        <el-table-column
          prop="session"
          :label="LEGEND[3]">
        </el-table-column>
        <el-table-column  
          prop="session"
          :label="LEGEND[4]">
        </el-table-column>
        <el-table-column
          prop="session"
          :label="LEGEND[5]">
        </el-table-column>
        <el-table-column
          prop="session"
          :label="LEGEND[6]">
        </el-table-column>
        <el-table-column
          prop="session"
          :label="LEGEND[7]">
        </el-table-column>
        <el-table-column
          prop="session"
          :label="LEGEND[8]">
        </el-table-column>
        <el-table-column
          prop="session"
          :label="LEGEND[9]">
        </el-table-column>   
        <el-table-column
          prop="session"
          :label="LEGEND[10]">
        </el-table-column>     
        <el-table-column
          prop="session"
          :label="LEGEND[11]">
        </el-table-column>
        <el-table-column
          prop="session"
          :label="LEGEND[12]">
        </el-table-column>
        <el-table-column
          prop="session"
          :label="LEGEND[13]">
        </el-table-column>
      </el-table>
      <el-row class="text-right">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          @current-change="updatePageProducts"
          :page-size="pageSize"
          :total="products.length">
        </el-pagination>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="比较" name="prices">
      <el-row>
        <el-col :span="24" style="padding-top: 0;">
          <chart 
            :options="line"
            :init-options="initOptions"
            auto-resize
          />
        </el-col>
      </el-row>
      <product-search :options="options" :latestUnit="latestUnit" :salesUnit="salesUnit" :dateRange="dateRange" :processUnitChange="processUnitChange" :processDateRangeChange="processDateRangeChange"></product-search>
    </el-tab-pane>
  </el-tabs>
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
      line: {},
      line2: {},
      dateRange: [],
      replyData: [],
      tableData: [],
      initOptions: {
        renderer: 'svg'
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
    let currentDate = moment()
    let DateRange = []

    this.LEGEND = [
      '订单数量', 'Session', '转化率', '价格', 'Page', 'Views', '类目1排名',
      '类目2排名', '类目3排名', 'Bluetooth receiver排名', 'bluetooth car adapter排名', 'Reviews', 'Rating', 'QA数量'
    ]

    for (let i = 0; i < 50; i++) {
      currentDate.subtract(1, 'days')
      DateRange.push(currentDate.format('L'))
    }

    for (let i = 0; i < 14; i++) {
      let sample = {
        id: '分类' + i,
        name: this.LEGEND[i],
        description: '商品描述' + this.LEGEND[i],
        info: []
      }
      DateRange.reverse().forEach((date, j) => {
        sample.info.push({
          label: date,
          value: Math.ceil(Math.random() * 45 + 55),
          rate: Math.random(),
          session: Math.ceil(Math.random() * 1000 + 100)
        })
      })
      this.replyData.push(sample)
    }

    const lineLegend = {
      '类目1排名': true,
      '类目2排名': true,
      '类目3排名': true
    }

    this.line = {
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          let res = '' + params[0].name + '</br>'
          params.forEach(param => {
            res = res + param.seriesName + ':' + this.replyData[param.seriesIndex].info[param.dataIndex].value + '</br>'
          })
          return res
        }
      },
      legend: {
        data: this.replyData.map(dt => dt.name),
        selected: lineLegend
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
        data: this.replyData[0].info.map(dt => dt.label)
      },
      yAxis: {
        type: 'value'
      },
      series: this.replyData.map(dt => {
        let name = dt.name
        let type = 'line'
        let markPoint = {
          data: [
            {type: 'max', name: '最大值'},
            {type: 'min', name: '最小值'}
          ]
        }
        let data = dt.info.map(i => parseFloat(i.rate.toFixed(4)))
        if (lineLegend[name] === true) {
          return {name, type, markPoint, data}
        }
      })
    }

    this.line2 = {
      title: {
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          let res = '' + params[0].name + '</br>'
          params.forEach(param => {
            res = res + param.seriesName + ':' + this.replyData[param.seriesIndex].info[param.dataIndex].value + '</br>'
          })
          return res
        }
      },
      legend: {
        data: this.replyData.map(dt => dt.name),
        selected: {
          '价格': false,
          '订单数量': true,
          'Session': true,
          'Page': false,
          'Views': false,
          '转化率': true,
          '类目1排名': false,
          '类目2排名': false,
          '类目3排名': false,
          'Bluetooth': false,
          'bluetooth car adapter排名': false,
          'Bluetooth receiver排名': false,
          'Reviews': false,
          'Rating': false,
          'QA数量': false
        }
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
        data: this.replyData[0].info.map(dt => dt.label)
      },
      yAxis: {
        type: 'value'
      },
      series: this.replyData.map(dt => {
        let name = dt.name
        let type = 'line'
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
    this.products = this.replyData[0].info
    this.pageProducts = this.products.slice(0, this.pageSize)
  },
  mounted () {
    console.table(this.replyData)
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    udpateSalesChart (unit, period) {
      this.querySales()
    },
    processUnitChange (unit) {
      this.udpateSalesChart(unit, this.dateRange)
    },
    processDateRangeChange (range) {
      this.udpateSalesChart(this.salesUnit, range)
    },
    querySales () {
      const query = {
        period: {
          start: this.dateRange[0],
          end: this.dateRange[1]
        },
        unit: this.salesUnit,
        products: this.products
      }

      api.post('/stat/list', query).then(res => {
        console.log(res.data)
      })
    },
    sortByDate (a, b) {
      let originFormat = 'MM/DD/YYYY'
      let uiFormat = 'YYYY-MM-DD'
      return moment(a.label, originFormat).format(uiFormat) > moment(b.label, originFormat).format(uiFormat)
    },
    updatePageProducts (currentPage) {
      let start = (currentPage - 1) * this.pageSize
      let lastPageSize = this.products.length % this.pageSize
      let isLastPage = Math.ceil(this.products.length / this.pageSize) === currentPage
      let end = start + (isLastPage ? lastPageSize : this.pageSize)
      this.pageProducts = this.products.slice(start, end)
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
