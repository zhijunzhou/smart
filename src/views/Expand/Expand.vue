<template>
  <div>    
    <el-row>
      <el-col :span="24">
        <el-button type="success" round>
          <router-link :to="{path: '/main/analysis'}" class="text-white">
            分析统计示例
          </router-link>
          </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

export default {
  data () {
    return {}
  }
}
</script>

