<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="销量" name="sales">
      <el-row>
        <el-col :span="4">
          <el-row>
            <el-col :span="24">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                size="small"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-radio-group v-model="sales">
                <el-radio label="9">年销量</el-radio><p class="br"></p>
                <el-radio label="8">季度销量</el-radio><p class="br"></p>
                <el-radio label="7">月销量</el-radio><p class="br"></p>
                <el-radio label="6">周销量</el-radio><p class="br"></p>
                <el-radio label="5">日销量</el-radio><p class="br"></p>
              </el-radio-group>
            </el-col>
          </el-row>        
        </el-col>
        <el-col :span="20" style="padding-top: 50px;">
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
import getBar from '@/data/bar'

export default {
  data () {
    return {
      activeName: 'sales',
      sales: '9',
      bar: getBar(),
      dateRange: [],
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
