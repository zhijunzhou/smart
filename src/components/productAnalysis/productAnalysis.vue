<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="销量" name="sales">
      <el-row>
        <el-col :span="4">
          <el-radio-group v-model="sales">
            <el-radio label="byYear">年销量</el-radio><p class="br"></p>
            <el-radio label="bySeason">季度销量</el-radio><p class="br"></p>
            <el-radio label="byMonth">月销量</el-radio><p class="br"></p>
            <el-radio label="byWeek">周销量</el-radio><p class="br"></p>
            <el-radio label="byDay">日销量</el-radio><p class="br"></p>
          </el-radio-group>
        </el-col>
        <el-col :span="20">
            <chart 
              :options="bar"
              :init-options="initOptions"
              ref="bar"
              theme="ovilia-green"
              auto-resize
            />
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="价格" name="prices">...</el-tab-pane>
    <el-tab-pane label="session" name="session">...</el-tab-pane>
    <el-tab-pane label="转化率" name="conversionRate">...</el-tab-pane>
    <el-tab-pane label="类目" name="category">...</el-tab-pane>
    <el-tab-pane label="关键字" name="keyword">...</el-tab-pane>
    <el-tab-pane label="广告" name="ads">...</el-tab-pane>
  </el-tabs>
</template>

<script>

import 'echarts/lib/chart/line'
import getBar from '@/data/bar'

export default {
  data () {
    return {
      activeName: 'sales',
      sales: 'byYear',
      bar: getBar(),
      initOptions: {
        renderer: 'svg'
      }
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
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
