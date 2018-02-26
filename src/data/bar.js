export default function getData () {
  let items = ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  return {
    title: {
      text: '异步数据加载示例'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['销量']
    },
    toolbox: {
      show: true
    },
    xAxis: {
      data: items
    },
    yAxis: {
      axisLabel: {show: true}
    },
    calculable: true,
    series: [{
      type: 'line',
      name: '销量',
      data: items.map(() => Math.floor(Math.random() * 40 + 10))
    }]
  }
}
