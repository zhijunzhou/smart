<template>
  <div>
    <figure>
      <chart 
        :options="bar"
        :init-options="initOptions"
        ref="bar"
        theme="ovilia-green"
        auto-resize
      />
    </figure>
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
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import getBar from '@/data/bar'

export default {
  data () {
    return {
      bar: getBar(),
      initOptions: {
        renderer: 'canvas'
      }
    }
  }
}
</script>

