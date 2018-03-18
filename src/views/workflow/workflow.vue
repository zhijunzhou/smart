<template>
    <div>
      <el-row>
          <el-col :span="20">
            <el-checkbox-group  v-model="checkList">
              <el-checkbox v-for="stage in STAGES" :label="stage.NAME"></el-checkbox>
          <!-- <el-checkbox label="复选框 B"></el-checkbox>
          <el-checkbox label="复选框 C"></el-checkbox>
          <el-checkbox label="禁用" disabled></el-checkbox>
          <el-checkbox label="选中且禁用" disabled></el-checkbox> -->
            </el-checkbox-group>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-plus">新增</el-button>
          </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-table
            :data="workflow">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <br>
                    <el-form-item label="备注">
                      <p v-for="cmt in props.row.comments">{{ cmt.author }} {{ cmt.authorImg }} {{ cmt.text }} {{ cmt.time }}</p>
                    </el-form-item>
                    <br>
                    <el-form-item label="历史">
                        <div v-for="stage in props.row.stages">
                          <img :src="stage.authorImg" class="privateImage" v-if="stage.authorImg">
                          <p>{{ stage.text }}</p>
                          <span>{{ stage.author }}</span>
                          <span>{{ stage.time }}</span>
                        </div> 
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column
                label="工作编号"
                prop="id">
              </el-table-column>
              <el-table-column
                label="商品S/N"
                prop="productId">
              </el-table-column>
              <el-table-column
                label="商品名称"
                prop="name">
              </el-table-column>
              <el-table-column
                label="店铺名"
                prop="shopName">
              </el-table-column>
              <el-table-column
                label="建议类型"
                prop="adviceType">
              </el-table-column>
              <el-table-column
                label="状态" prop="stages">
                  <template slot-scope="scope">
                    <img :src="scope.row.stages[scope.row.stages.length-1].authorImg" class="privateImage" v-if="scope.row.stages[scope.row.stages.length-1].authorImg">
                    {{scope.row.stages[scope.row.stages.length-1].author}} 
                    
                  <!-- <span v-for="stage in scope.row.stages">
                    <img :src="stage.authorImg" class="privateImage" v-if="stage.authorImg">
                    {{ stage.author }}
                  </span>
                  <span v-for="stage in scope.row.stages">
                    <img :src="stage.authorImg" class="privateImage" v-if="stage.authorImg">
                    {{ stage.author }}
                  </span> -->
                </template>              
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" round>编辑</el-button>
                  <el-button size="mini" round>
                    <router-link :to="{path: '/main/analysis'}">删除</router-link>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-col>
        <el-col :span="24" class="text-right">
          <el-pagination
            layout="total, prev, pager, next, jumper"
            @current-change="updatePageUsers"
            :page-size="pageSize"
            :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
</template>
<script>
  // import { ROLE } from '../../../static/enum.js'
  // import api from '../../utils/api'
  export default {
    data () {
      return {
        workflow: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        search_val: '',
        showLiked: false,
        options: [],
        productType: '',
        checkList: [],
        STAGES: [
          {CODE: 0, NAME: '建议'},
          {CODE: 10, NAME: '待执行'},
          {CODE: 20, NAME: '已执行'},
          {CODE: 30, NAME: '已总结'},
          {CODE: 99, NAME: '被拒绝'}
        ]
      }
    },
    created () {
      this.getUserData()
    },
    mounted () {
    },
    methods: {
      getUserData () {
        // const pagination = {
        //   pageSize: this.pageSize,
        //   currentPage: this.currentPage
        // }
        // api.post('/api/user/pagination', {pagination}).then(res => {
        //   this.workflow = res.data.grid
        //   this.total = res.data.pagination.total
        // })
        this.workflow = [
          {
            id: '建议id',
            productId: '商品SN',
            name: '商品名称',
            description: '商品描述',
            img: '商品图片url',
            price: 66.50,
            sales: 1300, /* 销量 */
            shopId: '店铺id',
            shopName: '店铺名称',
            adviceType: '建议类型',
            adviceTime: '2018-01-01 08:00:59',
            execPeriod: {
              start: '2018-02-01 08:00:59',
              end: ''
            },
            comments: [
              {author: '备注人', authorImg: '备注人头像', text: '备注内容', time: '2018-01-01 08:00:59'},
              {author: '备注人2', authorImg: '备注人头像', text: '备注2内容', time: '2018-01-01 18:00:59'}
            ],
            lastStageCode: 99,
            stages: [
              {code: 0, author: '建议人', authorImg: '建议人头像', text: '建议内容', time: '2018-01-01 08:00:59'},
              {code: 10, author: '审批人', authorImg: '审批人头像', text: '建议内容', time: '2018-01-02 08:00:59'},
              {code: 20, author: '执行人', authorImg: '执行人头像', text: '执行内容', time: '2018-01-04 08:00:59'},
              {code: 30, author: '总结人', authorImg: '总结人头像', text: '总结内容', time: '2018-01-05 08:00:59'},
              {code: 99, author: '拒绝人', authorImg: '拒绝人头像', text: '拒绝内容', time: '2018-01-06 08:00:59'}
            ]
  
          }
        ]
      },
      updatePageUsers (currentPage) {
        this.currentPage = currentPage
        this.getUserData()
      },
      getShopName (shopId) {
        const scope = this.getShops().find(s => s.shopId === shopId)
        return scope ? scope.shopName : ''
      },
      getShops () {
        return [
          { shopId: '1', shopName: '店铺A' },
          { shopId: '2', shopName: '店铺B' },
          { shopId: '3', shopName: '店铺C' }
        ]
      }
    }
  }
</script>
<style>
    .privateImage{
	display:inline-block;
	border-radius:50%;
	height: 40px;
	vertical-align:middle;
}
.role-txt {
  margin: 5px;
}
</style>
  
  