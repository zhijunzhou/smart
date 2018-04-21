<template>
  <el-row>
    <el-popover
      ref="showHideColumns"
      trigger="hover">
      <el-checkbox-group v-model="checkedList" @change="updateVisibleColumns">
        <el-checkbox v-for="(header, index) of headers" :key="index" :label="header" style="width: 100%;"></el-checkbox>
      </el-checkbox-group>
    </el-popover>
    <el-form ref="form">
      <el-col :span="6">
        <el-form-item label="单位">
          <el-radio-group size="mini" v-model="su" @change="updateUnitChange">
            <el-radio label="7">月</el-radio>
            <el-radio label="6">周</el-radio>
            <el-radio label="5">日</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item>
          <el-button size="mini" v-popover:showHideColumns>显示/隐藏列</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="最近">
          <el-select size="mini" style="width: 150px;" v-model="lu" @change="updateLu">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item>
          <el-date-picker
            v-model="dr"
            @change="updateDateRangeValue"
            type="daterange"
            size="small"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-form>
  </el-row>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      lu: this.latestUnit,
      su: this.salesUnit,
      dr: this.dateRange,
      checkedList: [],
      options: [
        {
          label: '周',
          value: 7
        }, {
          label: '月',
          value: 30
        }, {
          label: '季度',
          value: 120
        }, {
          label: '半年',
          value: 183
        }, {
          label: '一年',
          value: 365
        }, {
          label: '两年',
          value: 730
        }
      ]
    }
  },
  props: [
    'columns',
    'latestUnit',
    'salesUnit',
    'dateRange'
  ],
  methods: {
    updateLu () {
      let format = 'YYYY-MM-DD'
      let start = moment().subtract(this.lu, 'days')
      let end = moment()
      this.updateDateRange([start.format(format), end.format(format)])
    },
    updateDateRangeValue () {
      this.updateDateRange(this.dr)
    },
    updateVisibleColumns () {
      this.$emit('showHideColumns', this.checkedList)
    },
    updateUnitChange () {
      this.$emit('processUnitChange', this.su)
    },
    updateDateRange (dateRange) {
      this.$emit('processDateRangeChange', dateRange)
    }
  },
  created () {
    for (var p in this.columns) {
      this.checkedList.push(p)
    }
  },
  computed: {
    headers () {
      let hds = []
      for (var p in this.columns) {
        hds.push(p)
      }
      return hds
    }
  }
}
</script>
<style scoped>
.el-checkbox+.el-checkbox {
  margin-left: 0;
}
</style>


