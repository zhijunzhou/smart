<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="本产品" name="sales">
      <el-row>
        <!-- <el-col :span="24" style="padding-top: 0;">
            <chart 
              :options="line"
              :init-options="initOptions"
              auto-resize
            />
        </el-col> -->
        <el-col :span="24" style="padding-top: 0;">
          <chart 
            :options="line2"
            :init-options="initOptions"
            auto-resize
          />
      </el-col>
      </el-row>
      <el-row class="text-right">
        <el-col>
          <el-date-picker
            v-model="dateRange"
            @change="processDateRangeChange"
            type="daterange"
            size="small"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-radio-group v-model="salesUnit" @change="processUnitChange">
            <el-radio label="7">月销量</el-radio>
            <el-radio label="6">周销量</el-radio>
            <el-radio label="5">日销量</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-table
        border
        show-summary
        :data="replyData[0].info">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          label="日期"
          prop="label"          
          :sort-method="sortByDate"
          sortable>
        </el-table-column>
        <el-table-column
          label="销量"
          prop="value"
          sortable>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="比较" name="prices">...</el-tab-pane>
    <!-- <el-tab-pane label="session" name="session">...</el-tab-pane>
    <el-tab-pane label="转化率" name="conversionRate">...</el-tab-pane>
    <el-tab-pane label="类目" name="category">...</el-tab-pane>
    <el-tab-pane label="关键字" name="keyword">...</el-tab-pane>
    <el-tab-pane label="广告" name="ads">...</el-tab-pane> -->
  </el-tabs>
</template>

<script>
import moment from 'moment'
import getBar from '@/data/bar'
import api from '@/utils/api'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markArea'

export default {
  data () {
    return {
      activeName: 'sales',
      salesUnit: '7',
      products: ['B07232TL6Z'],
      line: {},
      line2: {},
      dateRange: [],
      replyData: [],
      tableData: [],
      initOptions: {
        renderer: 'svg'
      }
    }
  },
  created () {
    let currentDate = moment()
    let DateRange = []
    const LEGEND = [
      '订单数量', 'Session', '转化率', '价格', 'Page', 'Views', '类目1排名',
      '类目2排名', '类目3排名', 'Bluetooth receiver排名', 'bluetooth car adapter排名', 'Reviews', 'Rating', 'QA数量'
    ]

    for (let i = 0; i < 100; i++) {
      currentDate.subtract(1, 'days')
      DateRange.push(currentDate.format('L'))
    }

    for (let i = 0; i < 14; i++) {
      let sample = {
        id: '分类' + i,
        name: LEGEND[i],
        description: '商品描述' + LEGEND[i],
        info: []
      }
      DateRange.reverse().forEach((date, j) => {
        sample.info.push({
          label: date,
          value: Math.ceil(Math.random() * 45 + 55),
          rate: Math.random()
        })
      })
      this.replyData.push(sample)
    }
    this.line = getBar(this.replyData)
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
        let data = dt.info.map(i => i.rate)
        return {name, type, markPoint, data}
      })
    }
  },
  mounted () {
    console.log(this.replyData)
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    udpateSalesChart (unit, period) {
      console.log(unit, period)
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
    }
  }
}
</script>

<style scoped>
.br {
  margin-bottom: 15px;
  height: 15px;
  width: 100%;
}
</style>
