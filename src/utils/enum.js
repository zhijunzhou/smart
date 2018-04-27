export const ROLE = {
  ADMIN: 9,
  DIRECTOR: 8,
  MANAGER: 7,
  EMPLOYEE: 1,
  GUEST: 0
}

export const PERIOD_OPTIONS = [
  {
    label: '最近3天',
    value: 3
  }, {
    label: '最近一周',
    value: 7
  }, {
    label: '最近一个月',
    value: 30
  }, {
    label: '最近一个季度',
    value: 120
  }, {
    label: '最近半年',
    value: 183
  // }, {
  //   label: '最近一年',
  //   value: 365
  // }, {
  //   label: '最近两年',
  //   value: 730
  },
  {
    label: '自定义',
    value: 0
  }
]
