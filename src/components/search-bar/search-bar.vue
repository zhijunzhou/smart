<template>
  <el-row class="first-search">
    <el-col :span="6" style="padding-right: 5px;">
      <el-form-item label="店铺">
        <el-select clearable v-model="shopIdIn" placeholder="选择店铺" class="shop-select" @change="updateShop">
          <el-option
            v-for="shop in shopList"
            :key="shop.value"
            :label="shop.shopName"
            :value="shop.shopId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="4" style="padding-right: 5px;">
      <el-form-item label="国家">
        <el-select clearable v-model="nationIdIn" placeholder="选择国家" class="nation-select" @change="updateNation">
          <el-option
            v-for="nation in nationList"
            :key="nation.countryCode"
            :label="nation.countryCode"
            :value="nation.countryCode">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="5" :offset="1">
        <el-form-item label="选择时间">
          <el-select class="period-select" v-model="periodSelectIn" @change="updatePerid">
            <el-option
            v-for="item in periodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item v-if="periodSelectIn===0">
          <el-date-picker
            v-model="periodCustomize"
            @change="updatePeriodCustomize"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-else>&nbsp;</el-form-item>
      </el-col>   
  </el-row>
</template>

<script>
import { PERIOD_OPTIONS } from '../../utils/enum'
import moment from 'moment'
export default {
  props: [
    'shopList',
    'nationList',
    'shopId',
    'nationId',
    'periodSelect'
  ],
  data () {
    return {
      filter: {
        shopId: null,
        nationId: null,
        period: {}
      },
      periodCustomize: [],
      shopIdIn: this.shopId,
      nationIdIn: this.nationId,
      periodSelectIn: 0,
      // shopId: null,
      // shopList: [],
      // nationId: null,
      // nationList: [],
      // periodSelect: 7,
      periodOptions: PERIOD_OPTIONS
    }
  },
  mounted () {
    this.periodSelectIn = this.periodSelect
    this.updatePerid()
  },
  methods: {
    updateShop () {
      this.filter.shopId = this.shopIdIn
      this.$emit('onChange', this.filter)
      console.log('shopChange', this.filter)
    },
    updateNation () {
      this.filter.nationId = this.nationIdIn
      this.$emit('onChange', this.filter)
      console.log('nationChange', this.filter)
    },
    updatePerid () {
      if (this.periodSelectIn === 0) {
        return
      }
      let format = 'YYYY-MM-DD'
      this.filter.period.start = moment().subtract(this.periodSelectIn, 'days').format(format)
      this.filter.period.end = moment().format(format)
      this.$emit('onChange', this.filter)
      console.log('onChange', this.filter)
    },
    updatePeriodCustomize () {
      this.filter.period.start = this.periodCustomize[0]
      this.filter.period.end = this.periodCustomize[1]
      this.$emit('onChange', this.filter)
      console.log('onChange', this.filter)
    }
  }
}
</script>

<style lang="scss" scoped>
.first-search {
  margin-bottom: 0px;
}

.period-select {
  width: 150px!important;
}

.shop-select {
  width: 160px!important;
}

.nation-select {
  width: 110px!important;
}
</style>


