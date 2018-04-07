<template>
  <div>
    <el-row>
      <el-form ref="form">
        <!-- <el-col :span="24">
          <el-form-item label="状态">
            <el-checkbox-group  v-model="checkList" @change="searchWorkflow">
              <el-checkbox v-for="(stage, index) in STAGES" :key="index" :label="stage.name"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col> -->
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
          <!-- <el-button size="mini" icon="el-icon-plus" @click="add">新增工作</el-button> -->
          <!-- </el-button> -->
          <vue-csv-downloader
            :data="allWorkflows"
            :fields="fields"
            >
            下载表格
          </vue-csv-downloader>
        </el-col>        
      </el-form>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-table
          ref="table"
          toggleRowExpansion
          clearSort
          @expand-change="getSugHistory"
          :data="workflows">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                  <br>
                  <el-form-item label="备注">                    
                    <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="添加注释..."
                      v-model="scope.row.comments">
                    </el-input>
                    <el-button icon="el-icon-edit" round size="mini" @click="addComment(scope.row.suggestionId, scope.row.comments)">保存注释</el-button>
                  </el-form-item>
                  <br>
                  <el-form-item label="历史">
                      <div v-if="scope.row.history" v-for="(his, index) in scope.row.history" :key="'his_' + index">
                        <span><i class="el-icon-time"></i>{{ his.date }}</span>
                        <span>{{ his.operator }}</span>
                        <i class="el-icon-arrow-right"></i>
                        <el-tag>{{ typeReverseMapping[his.operation] }}</el-tag>
                        <span>{{ his.message }}</span>   
                      </div>
                      <div v-else>
                        Loading...
                      </div>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="编号"
              width="60"
              prop="suggestionId">
            </el-table-column>
            <el-table-column
              label="提议时间"
              width="100"
              prop="createDate">
            </el-table-column>
            <el-table-column
              label="状态">
                <template slot-scope="scope">
                  <el-popover
                    ref="popoverStatus"              
                    trigger="hover">
                    <div class="text-center">
                      <el-steps :active="getActiveStep(scope.row.status)" align-center :space="100" finish-status="success">
                        <el-step v-for="(step, index) in getAllSteps(scope.row.status)" :key="'step_' + index" :title="typeReverseMapping[step]"></el-step>
                      </el-steps>
                    </div>
                    <div class="sug-description text-center" v-if="scope.row.status !== 'closed'">
                      <el-input size="mini" placeholder="输入描述文字" v-model="sugDescription"></el-input>
                    </div>
                    <div class="btn-sug-group text-center">
                      <el-button v-for="(oper,index) of getNextOpers(scope.row.status)" :key="'oper_' + index" size="mini" @click="processSuggest(scope.row, oper)" round>{{operMapping[oper]}}</el-button>                      
                    </div>
                  </el-popover>
                  <el-tag :type="getTagType(scope.row.status)" v-popover:popoverStatus>{{typeReverseMapping[scope.row.status]}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
            label="优化类型"
            width="100"
            prop="suggestType">
          </el-table-column> 
            <el-table-column
              label="ASIN"
              width="120"
              prop="productId">
            </el-table-column>
            <el-table-column
              label="产品名"
              width="140"
              prop="name">
            </el-table-column>
            <!-- <el-table-column
              width="140"
              label="建议主题"
              prop="title">
            </el-table-column> -->
            <el-table-column
              width="140"
              label="建议"
              prop="suggestion">
              <template slot-scope="scope">
                <div class="suggestion" :title="scope.row.suggestion">{{scope.row.suggestion}}</div>
              </template>
            </el-table-column>
            <!-- <el-table-column
              width="100"
              label="店铺名">
              <template slot-scope="scope">
                {{getShops[scope.row.shopId]}}
              </template>
            </el-table-column>            -->
            <el-table-column
              label="提出人"
              width="100"
              prop="proposer">
            </el-table-column>
            <el-table-column
              label="审批人"
              width="100"
              prop="auditor">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.row.status==='issued'||scope.row.status==='reissued'"  size="mini" @click="edit(scope.row)" round>编辑</el-button>
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
        <el-form-item label="ASIN" :label-width="formLabelWidth">
          &nbsp;&nbsp;&nbsp;&nbsp;{{form.productId}}
            <!-- <el-row>
                <el-col :span="10">
                  <el-input v-model="form.productId"></el-input>
                </el-col>
              </el-row> -->
        </el-form-item>
        <el-form-item label="产品名" :label-width="formLabelWidth">
          <el-row>
            <el-col :span="10">
              <el-input v-model="form.productName"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="优化类型" :label-width="formLabelWidth">
          <el-row>
            <el-col :span="10">
              <el-input v-model="form.optimizationType"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="所属店铺" :label-width="formLabelWidth">
          <el-select v-model="form.shopId" placeholder="选择店铺">
            <el-option
              v-for="shop in shopList"
              :key="shop.value"
              :label="shop.shopName"
              :value="shop.shopId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="建议主题" :label-width="formLabelWidth">
          <el-row>
            <el-col :span="10">
              <el-input v-model="form.title"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="建议" :label-width="formLabelWidth">
          <el-input type="textarea" autosize placeholder="请输入建议内容" v-model="form.suggestion"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>        
        <el-button type="primary" @click="saveWork" v-if="modalType === 'add'">保  存</el-button>
        <el-button type="primary" @click="updateWork" v-else>重新提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Message } from 'element-ui'
  import api from '../../utils/api'
  // import CsvExport from '../../utils/csv-export'
  import json2csv from 'json2csv'
  import VueCsvDownloader from 'vue-csv-downloader'

export default {
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'getPageWorkflows'
    },
    components: {
      VueCsvDownloader
    },
    data () {
      return {
        workflows: [],
        pageSize: 15,
        currentPage: 1,
        total: 0,
        search_val: undefined,
        sugComment: undefined,
        sugDescription: undefined,
        formLabelWidth: '120px',
        showLiked: false,
        dialogFormVisible: false,
        options: [],
        productType: '',
        shopList: [],
        checkList: [],
        allWorkflows: [],
        shopId: undefined,
        currentSugId: undefined,
        modalType: undefined,
        fields: [
          'suggestionId', 'status', 'createDate', 'name', 'productId', 'proposer', 'suggestType',
          'suggestion', 'auditor', 'reply', 'auditDate', 'finishDate', 'sumup', 'sumupDate', 'comments'
        ],
        STAGES: [
          {value: 'issued', name: '待审核'},
          {value: 'permitted', name: '待执行'},
          {value: 'finished', name: '待总结'},
          {value: 'summed', name: '完结'},
          {value: 'rejected', name: '被拒绝'},
          {value: 'closed', name: '已关闭'}
        ],
        typeMapping: {
          '待审核': 'issued',
          '待执行': 'permitted',
          '待总结': 'finished',
          '完结': 'summed',
          '被拒绝': 'rejected',
          '已关闭': 'closed',
          '重新提交': 'reissued'
        },
        typeReverseMapping: {
          'issued': '待审核',
          'permitted': '待执行',
          'finished': '待总结',
          'summed': '完结',
          'rejected': '被拒绝',
          'closed': '已关闭',
          'reissued': '重新提交'
        },
        operMapping: {
          'permitted': '审批',
          'finished': '完成',
          'summed': '完结',
          'rejected': '拒绝',
          'closed': '关闭工作',
          'reissued': '重新提交'
        },
        chains: {
          issued: {
            permitted: {
              manager: true
            },
            rejected: {
              manager: true
            },
            closed: {
              sales: true
            }
          },
          permitted: {
            finished: {
              manager: true
            },
            closed: {
              manager: true
            }
          },
          finished: {
            summed: {
              manager: true
            },
            closed: {
              manager: true
            }
          },
          summed: {
            closed: {
              manager: true
            }
          },
          rejected: {
            reissued: {
              manager: true
            },
            closed: {
              manager: true
            }
          },
          reissued: {
            permitted: {
              manager: true
            },
            rejected: {
              manager: true
            },
            closed: {
              manager: true
            }
          },
          closed: {}
        },
        form: {
          productId: '',
          shopId: undefined,
          productName: '',
          optimizationType: '',
          suggestion: '',
          title: '',
          sn: 1
        }
      }
    },
    created () {
      this.getShopList()
      this.getPageWorkflows()
      this.getAllWorkflows()
    },
    mounted () {
      console.log(this.$route.query.status)
    },
    computed: {
      ...mapGetters(['userInfo']),
      getStatus () {
        return this.$route.query.status.split('_')
        //  this.checkList.map(ck => {
        //   if (ck && this.typeMapping[ck]) {
        //     return this.typeMapping[ck]
        //   }
        // })
      },
      getShops () {
        if (Array.isArray(this.shopList) && this.shopList.length > 0) {
          return this.shopList.reduce((res, cur) => {
            if (!res[cur.shopId]) {
              res[cur.shopId] = cur.shopName
            }
            return res
          }, {})
        }
        return {}
      }
    },
    methods: {
      GetRow (row, columns) {
        let obj = {}

        columns.forEach(col => {
          let val = row[col.prop]

          if (col.formatter) {
            val = col.formatter(row, col, val)
          }

          obj[col.prop] = val
        })

        return obj
      },
      ExportCsv (data, columns, fileName) {
        console.log(json2csv)
        const rows = data.map(t => this.GetRow(t, columns))
        const fields = columns.map(t => t.prop)
        const fieldNames = columns.map(t => t.label)

        try {
          const result = json2csv({ data: rows, fields, fieldNames })
          const csvContent = 'data:text/csv;charset=GBK,\uFEFF' + result
          const link = document.createElement('a')
          link.href = encodeURI(csvContent)
          link.download = `${fileName}.csv`
          document.body.appendChild(link) // Required for FF
          link.click() // This will download the data file named 'my_data.csv'.
          document.body.removeChild(link) // Required for FF
        } catch (err) {
          // Errors are thrown for bad options, or if the data is empty and no fields are provided.
          // Be sure to provide fields if it is possible that your data array will be empty.
          console.error(err)
        }
      },
      exportCsv (filename = '列表') {
        // const columns = this.$refs.table.$children.filter(t => t.prop != null)
        // this.ExportCsv(this.workflows, columns, filename)
      },
      add () {
        this.modalType = 'add'
        this.dialogFormVisible = true
        this.form.productId = undefined
        this.form.shopId = undefined
        this.form.productName = undefined
        this.form.optimizationType = undefined
        this.form.suggestion = undefined
        this.form.title = undefined
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
        this.form.sn = row.sn
        this.form.title = row.title
      },
      saveWork () {
        this.form.sn = undefined
        api.post(`/api/suggestion`, this.form).then(res => {
          Message({
            showClose: true,
            message: '更新成功!',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.getPageWorkflows(true)
        }).catch(err => {
          this.errorHandler(err, {code: 404, message: '产品未找到'})
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
          this.errorHandler(err)
        })
      },
      updatePageWorkflow (currentPage) {
        this.currentPage = currentPage
        this.getPageWorkflows()
      },
      searchWorkflow () {
        this.getPageWorkflows()
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
        console.log(this.getStatus)
        this.$store.dispatch('setLoadingState', !hideWorkingDialog && true)
        api.post(`/api/suggestion/pagination`, params).then(res => {
          if (res.status === 200 && res.data) {
            this.workflows = res.data.grid
            this.workflows.forEach(w => {
              api.get(`/api/suggestion/${w.suggestionId}/history`).then(res => {
                w.history = res.data
              })
            })
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
      getAllWorkflows (hideWorkingDialog) {
        const params = {
          pagination: {
            pageSize: 999999,
            currentPage: 1,
            filter: {
              shopId: this.shopId
            }
          }
        }
        console.log(this.getStatus)
        this.$store.dispatch('setLoadingState', !hideWorkingDialog && true)
        api.post(`/api/suggestion/pagination`, params).then(res => {
          if (res.status === 200 && res.data) {
            this.allWorkflows = res.data.grid
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
          case 'closed': return 6
        }
        return 1
      },
      getTagType (name) {
        switch (name) {
          case 'permitted': return 'info'
          case 'finished': return 'primary'
          case 'summed': return 'success'
          case 'rejected': return 'danger'
          case 'close': return 'default'
        }
        return 'warning'
      },
      getAllSteps (name) {
        switch (name) {
          case 'rejected': return ['issued', 'rejected']
          case 'closed': return ['closed']
        }
        return ['issued', 'permitted', 'finished', 'summed']
      },
      getNextOpers (name) {
        let userName
        if (this.userInfo.roles.findIndex(r => r.roleId === 6) >= 0) {
          userName = 'manager'
        } else if (this.userInfo.roles.findIndex(r => r.roleId === 5) >= 0) {
          userName = 'sales'
        }
        // const userName = this.userInfo.userName
        let currentNode = this.chains[name]
        let opers = []
        for (let c in currentNode) {
          if (currentNode[c][userName] === true) {
            opers.push(c)
          }
        }
        return opers
      },
      getSugHistory (row, expandedRows) {
        // const self = this
        // expandedRows.map((eRow) => {
        //   console.log(eRow)
        //   let currentIndex
        //   let copied = self.workflows
        //   self.workflows.map((wf, index) => {
        //     if (wf.suggestionId === eRow.suggestionId) {
        //       currentIndex = index
        //     }
        //   })
        //   if (currentIndex !== undefined) {
        //     (function (activeRow, activeIndex) {
        //       api.get(`/api/suggestion/${activeRow.suggestionId}/history`).then(res => {
        //         copied[activeIndex].history = res.data
        //         self.$nextTick(() => {
        //           self.workflows = copied
        //         })
        //       })
        //     })(eRow, currentIndex)
        //   }
        // })
      },
      processSuggest (row, nextStatus) {
        const params = {
          suggestionId: row.suggestionId,
          status: nextStatus,
          sn: row.sn,
          message: this.sugDescription || nextStatus
        }
        api.post(`/api/suggestion/status`, params).then(res => {
          Message({
            showClose: true,
            message: '操作成功!',
            type: 'success'
          })
          this.getPageWorkflows()
          this.sugDescription = undefined
        }).catch(err => {
          this.errorHandler(err)
        })
      },
      addComment (id, message) {
        const params = {
          suggestionId: id,
          message: message
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
          this.errorHandler(err)
        })
      },
      errorHandler (err, specialCase) {
        if (specialCase && err.request.status === specialCase.code) {
          Message({
            showClose: true,
            message: specialCase.message,
            type: 'error'
          })
        } else if (err.request.status === 403) {
          Message({
            showClose: true,
            message: '当前用户权限不足',
            type: 'error'
          })
        } else if (err.request.status === 431) {
          Message({
            showClose: true,
            message: '数据提交冲突',
            type: 'error'
          })
          if (confirm('系统检测到其他人正在修改此记录，点击确定重新加载数据')) {
            this.getPageWorkflows()
          }
        } else {
          Message({
            showClose: true,
            message: err.response.statusText,
            type: 'error'
          })
        }
      }
    }
  }
</script>

<style scoped>
.btn-sug-group {
  margin-top: 20px;
}
.suggestion {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.sug-description {
  padding: 15px 10px 2px 10px;
}
</style>

 
  