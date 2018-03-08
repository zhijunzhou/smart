<template>
  <el-row>
    <el-popover
      ref="showHideColumns"
      trigger="hover">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="col in cols" :key="col" :label="col" style="width: 100%;"></el-checkbox>
      </el-checkbox-group>
    </el-popover>
    <el-form ref="form">
      <el-col :span="8">
        <el-form-item label="单位">
          <el-radio-group size="mini" v-model="su" @change="processUnitChange">
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
          <el-select size="mini" style="width: 150px;" v-model="lu">
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
            @change="processDateRangeChange"
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
export default {
  data () {
    return {
      lu: this.latestUnit,
      su: this.salesUnit,
      dr: this.dateRange,
      cols: [],
      checkList: []
    }
  },
  created () {
    for (let p in this.columns) {
      this.cols.push(p)
      if (this.columns[p]) {
        this.checkList.push(p)
      }
    }
    console.log(this.cols, this.checkList)
  },
  props: [
    'options',
    'columns',
    'latestUnit',
    'salesUnit',
    'dateRange',
    'processUnitChange',
    'processDateRangeChange'
  ]
}
</script>
<style scoped>
.el-checkbox+.el-checkbox {
  margin-left: 0;
}
</style>


