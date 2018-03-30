<template>
  <div>
    <el-row>
      <el-form ref="form">
        <el-col :span="24">
          <el-form-item label="状态">
            <el-checkbox-group  v-model="checkList" @change="searchWorkflow">
              <el-checkbox v-for="(stage, index) in STAGES" :key="index" :label="stage.name"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="店铺">
            <el-select v-model="shopId" placeholder="选择店铺">
              <el-option
                v-for="shop in shopList"
                :key="shop.value"
                :label="shop.shopName"
                :value="shop.shopId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-input
              placeholder="产品名"
              prefix-icon="el-icon-search"
              v-model="search_val">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" style="padding-left: 5px;">
          <el-button type="primary" icon="el-icon-search" @click="searchWorkflow">搜索</el-button>
        </el-col>
        <el-col :span="11" class="text-right">
          <el-button size="mini" icon="el-icon-plus" @click="add">新增工作</el-button>
        </el-col>        
      </el-form>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-table
          :data="workflows">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <br>
                  <el-form-item label="备注">
                    <p v-for="(cmt, index) in props.row.comments" :key="index">{{ cmt.author }} {{ cmt.authorImg }} {{ cmt.text }} {{ cmt.time }}</p>
                    <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="添加注释..."
                      v-model="sugComment">
                    </el-input>
                    <el-button icon="el-icon-edit" round size="mini" @click="addComment(props.row.suggestionId)">添加注释</el-button>
                  </el-form-item>
                  <br>
                  <el-form-item label="历史">
                      <div v-for="(stage, index) in props.row.stages" :key="index">
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
              width="80"
              prop="suggestionId">
            </el-table-column>
            <el-table-column
              label="商品S/N"
              width="180"
              prop="productId">
            </el-table-column>
            <el-table-column
              width="200"
              label="商品名称"
              prop="name">
            </el-table-column>
            <el-table-column
              width="100"
              label="店铺名"
              prop="shopId">
            </el-table-column>
            <el-table-column
              label="建议类型"
              width="100"
              prop="suggestType">
            </el-table-column>
            <el-table-column
              label="状态">
                <template slot-scope="scope">
                  <el-popover
                    ref="popoverStatus"                    
                    trigger="hover">
                    <el-steps :active="getActiveStep(scope.row.status)" align-center :space="100" finish-status="success">
                      <el-step title="建议"></el-step>
                      <el-step title="待执行"></el-step>
                      <el-step title="已执行"></el-step>                      
                      <el-step title="已总结" v-if="scope.row.status !== 'rejected'"></el-step>
                      <el-step title="被拒绝" v-else></el-step>
                    </el-steps>
                    <div class="btn-sug-group text-center">
                      <el-button type="primary" size="mini" @click="processSuggest(scope.row.suggestionId, 'permitted')" v-if="scope.row.status === 'issued'" round>批准</el-button>
                      <el-button type="primary" size="mini" @click="processSuggest(scope.row.suggestionId, 'finished')" v-else-if="scope.row.status === 'permitted'" round>完成</el-button>
                      <el-button type="primary" size="mini" @click="processSuggest(scope.row.suggestionId, 'summed')" v-else-if="scope.row.status === 'finished'" round>总结</el-button>
                      <el-button type="danger" size="mini" @click="processSuggest(scope.row.suggestionId, 'rejected')" v-if="scope.row.status !== 'rejected' && scope.row.status !== 'summed'" round>拒绝</el-button>
                    </div>
                  </el-popover>
                  <el-tag :type="getTagType(scope.row.status)" v-popover:popoverStatus>{{typeReverseMapping[scope.row.status]}}</el-tag>
                </template>              
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="edit(scope.row)" round>编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-col>
      <el-col :span="24" class="text-right">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          @current-change="updatePageWorkflow"
          :page-size="pageSize"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog :title="modalType === 'add' ? '工作流' : '工作流: ' + currentSugId" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="产品" :label-width="formLabelWidth">
          <el-input v-model="form.productId"></el-input>
        </el-form-item>
        <el-form-item label="所属店铺" :label-width="formLabelWidth">
          <el-input type="number" v-model="form.shopId"></el-input>
        </el-form-item>
        <el-form-item label="产品名" :label-width="formLabelWidth">
          <el-input v-model="form.productName"></el-input>
        </el-form-item>
        <el-form-item label="优化类型" :label-width="formLabelWidth">
          <el-input v-model="form.optimizationType"></el-input>
        </el-form-item>
        <el-form-item label="建议" :label-width="formLabelWidth">
          <el-input v-model="form.suggestion"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>        
        <el-button type="primary" @click="saveWork" v-if="modalType === 'add'">保  存</el-button>
        <el-button type="primary" @click="updateWork" v-else>更  新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { Message } from 'element-ui'
  import api from '../../utils/api'

  export default {
    data () {
      return {
        workflows: [],
        pageSize: 15,
        currentPage: 1,
        total: 0,
        search_val: undefined,
        sugComment: undefined,
        formLabelWidth: '120px',
        showLiked: false,
        dialogFormVisible: false,
        options: [],
        productType: '',
        shopList: [],
        checkList: [],
        shopId: undefined,
        currentSugId: undefined,
        modalType: undefined,
        STAGES: [
          {value: 'issued', name: '建议'},
          {value: 'permitted', name: '待执行'},
          {value: 'finished', name: '已执行'},
          {value: 'summed', name: '已总结'},
          {value: 'rejected', name: '被拒绝'}
        ],
        typeMapping: {
          '建议': 'issued',
          '待执行': 'permitted',
          '已执行': 'finished',
          '已总结': 'summed',
          '被拒绝': 'rejected'
        },
        typeReverseMapping: {
          'issued': '建议',
          'permitted': '待执行',
          'finished': '已执行',
          'summed': '已总结',
          'rejected': '被拒绝'
        },
        form: {
          productId: '',
          shopId: undefined,
          productName: '',
          optimizationType: '',
          suggestion: ''
        }
      }
    },
    created () {
      this.getShopList()
      this.getPageWorkflows()
    },
    mounted () {
    },
    computed: {
      getStatus () {
        return this.checkList.map(ck => {
          if (ck && this.typeMapping[ck]) {
            return this.typeMapping[ck]
          }
        })
      }
    },
    methods: {
      add () {
        this.modalType = 'add'
        this.dialogFormVisible = true
        this.form.productId = undefined
        this.form.shopId = undefined
        this.form.productName = undefined
        this.form.optimizationType = undefined
        this.form.suggestion = undefined
      },
      edit (row) {
        this.modalType = 'edit'
        this.dialogFormVisible = true
        this.currentSugId = row.suggestionId

        this.form.productId = row.productId
        this.form.shopId = row.shopId
        this.form.productName = row.name
        this.form.optimizationType = row.suggestType
        this.form.suggestion = row.suggestion
      },
      saveWork () {
        api.post(`/api/suggestion`, this.form).then(res => {
          Message({
            showClose: true,
            message: '更新成功!',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.getPageWorkflows(true)
        }).catch(err => {
          if (err.request.status === 403) {
            Message({
              showClose: true,
              message: '当前用户权限不足',
              type: 'error'
            })
          } else {
            Message({
              showClose: true,
              message: err.response.statusText,
              type: 'error'
            })
          }
        })
      },
      updateWork () {
        api.put(`/api/suggestion/${this.currentSugId}`, this.form).then(res => {
          Message({
            showClose: true,
            message: '更新成功!',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.getPageWorkflows(true)
        }).catch(err => {
          if (err.request.status === 403) {
            Message({
              showClose: true,
              message: '当前用户权限不足',
              type: 'error'
            })
          } else {
            Message({
              showClose: true,
              message: err.response.statusText,
              type: 'error'
            })
          }
        })
      },
      updatePageWorkflow (currentPage) {
        this.currentPage = currentPage
        this.getPageWorkflows()
      },
      searchWorkflow () {
        this.getPageWorkflows()
      },
      getShopName (shopId) {
        const scope = this.getShops().find(s => s.shopId === shopId)
        return scope ? scope.shopName : ''
      },
      getShopList () {
        api.get('/api/shop').then(res => {
          this.shopList = res.data
        })
      },
      getPageWorkflows (hideWorkingDialog) {
        const params = {
          pagination: {
            pageSize: this.pageSize,
            currentPage: this.currentPage,
            filter: {
              shopId: this.shopId,
              productId: this.search_val,
              status: this.getStatus
            }
          }
        }

        this.$store.dispatch('setLoadingState', !hideWorkingDialog && true)
        api.post(`/api/suggestion/pagination`, params).then(res => {
          if (res.status === 200 && res.data) {
            this.workflows = res.data.grid
            this.total = res.data.pagination.total
          }
          this.$store.dispatch('setLoadingState', false)
        }).catch(err => {
          this.$store.dispatch('setLoadingState', false)
          Message({
            showClose: true,
            message: err.response.statusText,
            type: 'error'
          })
        })
      },
      getActiveStep (name) {
        switch (name) {
          case 'issued': return 1
          case 'permitted': return 2
          case 'finished': return 3
          case 'summed': return 4
          case 'rejected': return 5
        }
        return 1
      },
      getTagType (name) {
        switch (name) {
          case 'permitted': return 'info'
          case 'finished': return 'primary'
          case 'summed': return 'success'
          case 'rejected': return 'danger'
        }
        return 'warning'
      },
      processSuggest (id, nextStatus) {
        const params = {
          suggestionId: id,
          status: nextStatus,
          message: nextStatus
        }
        api.post(`/api/suggestion/status`, params).then(res => {
          Message({
            showClose: true,
            message: '操作成功!',
            type: 'success'
          })
          this.getPageWorkflows()
        }).catch(err => {
          Message({
            showClose: true,
            message: err.response.statusText,
            type: 'error'
          })
        })
      },
      addComment (id) {
        const params = {
          suggestionId: id,
          message: this.sugComment
        }

        api.post(`/api/suggestion/comments`, params).then(res => {
          Message({
            showClose: true,
            message: '操作成功!',
            type: 'success'
          })
          this.sugComment = ''
        }).catch(err => {
          this.sugComment = ''
          Message({
            showClose: true,
            message: err.response.statusText,
            type: 'error'
          })
        })
      }
    }
  }
</script>

<style scoped>
.btn-sug-group {
  margin-top: 20px;
}
</style>

 
  