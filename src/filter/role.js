import { ROLE } from '../utils/enum'
export const role = (code) => {
  let name = ''
  switch (code) {
    case ROLE.ADMIN:
      name = '管理员'
      break
    case ROLE.DIRECTOR:
      name = '总监'
      break
    case ROLE.MANAGER:
      name = '主管'
      break
    case ROLE.EMPLOYEE:
      name = '员工'
      break
    default:
      name = '客人'
      break
  }
  return name
}
