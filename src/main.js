// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import ElementUI from 'element-ui'
import {
  Container,
  Header,
  Footer,
  Main,
  Aside,
  Row,
  Col,
  Button,
  Dialog,
  Tabs,
  TabPane,
  Radio,
  RadioGroup,
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu,
  DatePicker,
  Table,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  Select,
  Option,
  Input,
  Checkbox,
  CheckboxGroup,
  Tag,
  Tooltip,
  Popover,
  Upload,
  Dropdown,
  DropdownItem,
  Message,
  DropdownMenu
} from 'element-ui'
import ECharts from 'vue-echarts/components/ECharts'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import { role } from './filter/role'

Vue.config.productionTip = false

// Vue.use(ElementUI)
Vue.component(Message.name, Message)
Vue.component(Container.name, Container)
Vue.component(Header.name, Header)
Vue.component(Footer.name, Footer)
Vue.component(Main.name, Main)
Vue.component(Aside.name, Aside)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)
Vue.component(Dialog.name, Dialog)
Vue.component(Tabs.name, Tabs)
Vue.component(TabPane.name, TabPane)
Vue.component(Radio.name, Radio)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(Menu.name, Menu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(MenuItemGroup.name, MenuItemGroup)
Vue.component(Submenu.name, Submenu)
Vue.component(DatePicker.name, DatePicker)
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Pagination.name, Pagination)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Select.name, Select)
Vue.component(Option.name, Option)
Vue.component(Input.name, Input)
Vue.component(Checkbox.name, Checkbox)
Vue.component(CheckboxGroup.name, CheckboxGroup)
Vue.component(Popover.name, Popover)
Vue.component(Tag.name, Tag)
Vue.component(Upload.name, Upload)
Vue.component(Tooltip.name, Tooltip)
Vue.component(Dropdown.name, Dropdown)
Vue.component(DropdownItem.name, DropdownItem)
Vue.component(DropdownMenu.name, DropdownMenu)

Vue.component('chart', ECharts)

Vue.filter('role', role)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
