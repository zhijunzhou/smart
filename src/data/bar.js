/* eslint-disable */
import moment from 'moment'
var replyData = []

let currentDate = moment()
let DateRange = []

for (let i = 0; i < 30; i++) {
  currentDate.subtract(1, 'days')
  console.log(currentDate.format('L'))
  DateRange.push(currentDate.format('L'))
}

for (let i = 0; i < 5; i++) {
  let sample = {
    id: '竞品' + i,
    name: '竞品名称' + i,
    description: '商品描述' + i,
    info: []
  }
  DateRange.reverse().forEach((date, j) => {
    sample.info.push({
      label: date,
      value: Math.ceil(Math.random() * 45 + 55)
    })
  })
  replyData.push(sample)
}

export default function getData() {
  let legendData = []
  let xAxisData = []
  let seriesData = []

  replyData.forEach((item, index) => {
    legendData.push(item.name)
    let serie = {
      name: item.name,
      type: 'line',
      stack: '总量',
      data: []
    }

    item.info.forEach((v, i) => {
      serie.data.push(v.value)
    })
    seriesData.push(serie)
  })

  if (replyData.length > 0) {
    let _data = replyData[0]
    _data.info.forEach((v, i) => {
      xAxisData.push(v.label)
    })
  }

  return {
    title: {
      text: ''
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: legendData //['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData //['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: seriesData
    // series: [{
    //     name: '邮件营销',
    //     type: 'line',
    //     stack: '总量',
    //     data: [120, 132, 101, 134, 90, 230, 210]
    //   },
    //   {
    //     name: '联盟广告',
    //     type: 'line',
    //     stack: '总量',
    //     data: [220, 182, 191, 234, 290, 330, 310]
    //   },
    //   {
    //     name: '视频广告',
    //     type: 'line',
    //     stack: '总量',
    //     data: [150, 232, 201, 154, 190, 330, 410]
    //   },
    //   {
    //     name: '直接访问',
    //     type: 'line',
    //     stack: '总量',
    //     data: [320, 332, 301, 334, 390, 330, 320]
    //   },
    //   {
    //     name: '搜索引擎',
    //     type: 'line',
    //     stack: '总量',
    //     data: [820, 932, 901, 934, 1290, 1330, 1320]
    //   }
    // ]
  }
}
