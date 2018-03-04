/* eslint-disable */
/*
import moment from 'moment'
var replyData = []

let currentDate = moment()
let DateRange = []
let colors = ['#fe9800', '#6498cb']

for (let i = 0; i < 100; i++) {
  currentDate.subtract(1, 'days')
  // console.log(currentDate.format('L'))
  DateRange.push(currentDate.format('L'))
}

for (let i = 0; i < 2; i++) {
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
*/

export default function getData(replyData) {
  let legendData = []
  let xAxisData = []
  let seriesData = []
  let colors = ['#fe9800', '#6498cb','#fe0800', '#0498cb','#f09800', 
    '#649999','#fe9899', '#6000cb','#fe1000', '#6466cb',
    '#640000','#f00000', '#6999cb','#fdd800'
  ]

  replyData.forEach((item, index) => {
    legendData.push(item.name)
    let serie = {
      name: item.name,
      type: 'line',
      stack: '总量',
      symbol: 'circle',
      symbolSize: 6,
      data: [],
      itemStyle: {
        normal: {
          color: colors[index % 14]
        }
      }
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
      data: legendData
    },
    padding: [20, 100, 20, 100],
    grid: {
      left: '5%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      show: true,
      orient: 'horizontal',
      itemGap: 10,
      itemSize: 15
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData
    },
    yAxis: {
      type: 'value'
    },
    series: seriesData
  }
}
