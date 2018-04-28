<template>
  <div>
    <el-form ref="form" class="search-bar">
      <el-row class="first-search">
        <el-col :span="6" style="padding-right: 5px;">
          <el-form-item label="店铺">
            <el-select clearable v-model="shopId" placeholder="选择店铺" class="shop-select">
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
            <el-select clearable v-model="nationId" placeholder="选择国家" class="nation-select">
              <el-option
                v-for="nation in nationList"
                :key="nation.value"
                :label="nation"
                :value="nation">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
            <el-form-item label="选择时间">
              <el-select class="time-select" v-model="periodSelect" @change="updateLu">
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
            <el-form-item v-if="periodSelect===0">
              <el-date-picker
                v-model="dr"
                @change="updateDateRangeValue"
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
      <el-row>
        <el-col :span="6" >
            <el-form-item label="ASIN">
                <el-input
                  placeholder="请输入产品ASIN"
                  clearable
                  @clear="searchWorkflow"
                  class="shop-select"
                  v-model="searchField.productId">
                </el-input>
              </el-form-item>
        </el-col>    
        <el-col :span="4" :offset="0">
          <el-form-item label="建议人">
              <el-input
                placeholder="输入建议人"
                clearable
                @clear="searchWorkflow"
                class="nation-select"
                v-model="searchField.proposer">
              </el-input>
            </el-form-item>
        </el-col>    
        <el-col :span="5" :offset="1">
          <el-form-item label="审批人">
            <el-input
              placeholder="输入审批人"
              clearable
              class="time-select"
              @clear="searchWorkflow"
              v-model="searchField.auditor">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" :offset="2">
            <el-button type="primary" round icon="el-icon-search" @click="searchWorkflow">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
  <el-row>
    <el-popover
      ref="showHideColumns"
      trigger="hover">
      <el-checkbox-group v-model="checkedList" @change="updateVisibleColumns">
        <el-checkbox v-for="(header, index) of headers" :key="index" :label="header" style="width: 100%;"></el-checkbox>
      </el-checkbox-group>
    </el-popover>
    <el-col :span="8">
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="currentPage"
        :page-sizes="[20, 50, 100]"
        :page-size="pageSize"
        layout="sizes, total, prev, pager, next"
        :total="total">
      </el-pagination>
    </el-col>
    <el-col :span="16" class="text-right">
      <el-button size="mini" v-popover:showHideColumns>显示/隐藏列</el-button>
      <vue-csv-download
        :data="download"
        :fields="fieldsCn"
        class="download"
        >
        <el-button size="mini" icon="el-icon-document">下载</el-button>
      </vue-csv-download>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-table
          ref="table"
          toggleRowExpansion
          clearSort
          @expand-change="getSugHistory"
          :data="gridData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="right">
                  <el-row>
                    <el-col  :md="16" :lg="12">
                      <el-form-item label="备注" :label-width="formLabelWidth">                    
                        <el-input
                          type="textarea"
                          :maxlength="maxlength"
                          :autosize="{ minRows: 3, maxRows: 5}"
                          :placeholder="'添加注释..., 最大字数' + maxlength"
                          v-model="scope.row.comments">
                        </el-input>
                        <el-button icon="el-icon-edit" round size="mini" @click="addComment(scope.row.suggestionId, scope.row.comments, scope.row.sn)">保存注释</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="附件" :label-width="formLabelWidth">
                    <el-upload
                      name="attachement"
                      :file-list="scope.row.attachment"
                      :on-preview="downloadFile"
                      :before-remove="beforeRemove"
                      :on-remove="removeFile"
                      :on-change="handlerUploader"
                      :headers="getAuthHeaders()"
                      :action="getUploadUrl(scope.row.suggestionId)">
                      <i class="el-icon-upload"></i>
                      点击上传
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="历史" :label-width="formLabelWidth">
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
              width="70"
              sortable
              prop="suggestionId">
            </el-table-column>
            <el-table-column
              label="提议时间"
              width="100"
              sortable
              prop="createDate">
            </el-table-column>
            <el-table-column
              width="80"
              label="状态">
                <template slot-scope="scope">                  
                  <el-tag :type="getTagType(scope.row.status)">{{typeReverseMapping[scope.row.status]}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
              label="优化类型"
              width="100"
              prop="suggestType">
            </el-table-column>
            <el-table-column
              label="店铺"
              width="100">
              <template slot-scope="scope">                  
                {{ getShopName(scope.row.shopId)}}
              </template>
            </el-table-column> 
            <el-table-column
              label="国家"
              width="60"
              prop="nationId">
            </el-table-column>
            <el-table-column
              label="ASIN"
              width="120">
              <template slot-scope="scope">
                <router-link :to="{path: '/main/products', query: {shopId: scope.row.shopId, productId: scope.row.productId}}">
                  {{scope.row.productId}}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              label="产品名称"
              width="100"
              prop="name">
            </el-table-column>
            <el-table-column
              label="优化类型"
              width="100"
              prop="suggestType">
            </el-table-column> 
            <el-table-column
              width="100"
              label="建议主题"
              prop="title">
              <template slot-scope="scope">
                <div class="suggestion" :title="scope.row.title">{{scope.row.title}}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="提出人"
              sortable
              width="100"
              prop="proposer">
            </el-table-column>
            <el-table-column
              label="审批人"
              width="100"
              prop="auditor">
            </el-table-column>
            <el-table-column
              label="执行时间"
              width="100"
              prop="finishDate">
            </el-table-column>
            <el-table-column
              width="200"
              label="操作">
              <template slot-scope="scope">
                <router-link :to="{path: '/main/analysis', query: {shopId: scope.row.shopId, productId: scope.row.productId}}">
                  <el-button size="mini" round>
                    分析
                  </el-button>
                </router-link>
                <el-button v-if="scope.row.status === 'issued' || scope.row.status === 'reissued'" size="mini" @click="edit(scope.row)" round>编辑</el-button>
                <el-button v-if="scope.row.status !== 'closed'" size="mini" icon="el-icon-edit" @click="doWorkflowUpdate(scope.row)" round>工作流</el-button>
                <!-- <el-button v-if="scope.row.status !== 'closed'" size="mini" @click="analysis(scope.row)" round>分析</el-button> -->
              </template>
            </el-table-column>
          </el-table>
      </el-col>
      <el-col :span="24" class="text-left">
        <el-pagination
          @size-change="sizeChange"
          @current-change="updatePageWorkflow"
          :current-page="currentPage"
          :page-sizes="[20, 50, 100]"
          :page-size="pageSize"
          layout="sizes, total, prev, pager, next"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog title="工作流" :visible.sync="dialogWorkflowVisible">
      <el-card shadow="never">
        <div slot="header" class="text-center">
          <el-steps direction="vertical" :active="getActiveStep(wf.status)" align-center :space="120" finish-status="success">
            <el-step v-for="(step, index) in getAllSteps(wf.status)" :key="'wf_step_' + index" :description="getDescription(wf, step)" :title="typeReverseMapping[step]"></el-step>
          </el-steps>
          <el-form size="mini" :model="wf" style="margin-top: 15px;" v-if="wf.status !== 'summed' && wf.status !== 'closed'">
            <el-form-item label="意见" :label-width="formLabelWidth">
              <el-row>
                <el-col :span="10" v-if="wf.status !== 'closed'">
                  <el-input type="textarea" :maxlength="maxlength" :autosize="{ minRows: 3, maxRows: 5}" :placeholder="'输入描述文字, 最大字数' +  maxlength" v-model="sugDescription" ></el-input>
                </el-col>
                <el-col :span="10">
                  <el-button v-for="(oper,index) of getNextOpers(wf.status)" :key="'oper_' + index" size="mini" @click="processSuggest(wf, oper)" round>{{operMapping[oper]}}</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
        <el-form size="mini" :model="wf" style="margin-top: 15px;">        
          <el-form-item label="ASIN" :label-width="formLabelWidth">
            <small>{{wf.productId}}</small>
          </el-form-item>
          <el-form-item label="产品名称" :label-width="formLabelWidth">
            <small>{{wf.productName}}</small>
          </el-form-item>
          <el-form-item label="优化类型" :label-width="formLabelWidth">
            <small>{{wf.optimizationType}}</small>
          </el-form-item>
          <el-form-item label="所属店铺" :label-width="formLabelWidth">
            <el-select v-model="wf.shopId" disabled placeholder="选择店铺">
              <el-option
                v-for="shop in shopList"
                :key="shop.value"
                :label="shop.shopName"
                :value="shop.shopId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="建议主题" :label-width="formLabelWidth">
            <small>{{wf.title}}</small>
          </el-form-item>
          <el-form-item label="建议" :label-width="formLabelWidth">
            <small>{{wf.suggestion}}</small>
          </el-form-item>
        </el-form>
      </el-card>      
    </el-dialog>
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
        <el-form-item label="产品名称" :label-width="formLabelWidth">
            &nbsp;&nbsp;&nbsp;&nbsp;{{form.productName}}
        </el-form-item>
        <el-form-item label="优化类型" :label-width="formLabelWidth">
          <el-select v-model="form.optimizationType" placeholder="选择优化类型">
            <el-option
              v-for="option in optimizationTypes"
              :key="option.typeId"
              :label="option.typeName"
              :value="option.typeName">
            </el-option>
          </el-select>
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
          <el-input type="textarea" :maxlength="maxlength" :autosize="{ minRows: 3, maxRows: 5}" :placeholder="'请输入建议内容, 最大字数' + maxlength" v-model="form.suggestion"></el-input>
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
  import json2csv from 'json2csv'
  import VueCsvDownload from '@/components/csvDownload/csvDownload'
  import moment from 'moment'
  import { PERIOD_OPTIONS } from '../../utils/enum'

  export default {
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'getPageWorkflows'
    },
    components: {
      VueCsvDownload
    },
    data () {
      return {
        dr: null,
        maxlength: 200,
        nationId: '',
        gridData: [],
        gridDataBackup: [],
        pageSize: 20,
        currentPage: 1,
        total: 0,
        periodSelect: null,
        searchField: {
          productId: '',
          auditor: '',
          proposer: ''
        },
        sugComment: undefined,
        sugDescription: undefined,
        formLabelWidth: '120px',
        showLiked: false,
        dialogFormVisible: false,
        dialogWorkflowVisible: false,
        options: [],
        productType: '',
        shopList: [],
        headers: ['suggestionId', 'status', 'createDate', 'name', 'productId', 'proposer', 'suggestType',
          'suggestion', 'auditor', 'reply', 'auditDate', 'finishDate', 'sumup', 'sumupDate', 'comments'],
        checkedList: ['suggestionId', 'status', 'createDate', 'name', 'productId', 'proposer', 'suggestType',
          'suggestion', 'auditor', 'reply', 'auditDate', 'finishDate', 'sumup', 'sumupDate', 'comments'],
        download: [],
        shopId: undefined,
        currentSugId: undefined,
        modalType: undefined,
        dictCn: {
          suggestionId: '提议编号',
          status: '提议状态',
          createDate: '提议时间',
          name: '产品名称',
          productId: 'ASIN',
          proposer: '提议人',
          suggestType: '优化类型',
          suggestion: '提议内容',
          auditor: '审批人',
          reply: '审批建议',
          auditDate: '审批时间',
          finishDate: '完成时间',
          sumup: '总结内容',
          sumupDate: '总结时间',
          comments: '备注'
        },
        fields: [
          'suggestionId', 'status', 'createDate', 'name', 'productId', 'proposer', 'suggestType',
          'suggestion', 'auditor', 'reply', 'auditDate', 'finishDate', 'sumup', 'sumupDate', 'comments'
        ],
        fieldsCn: [
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
          'comments': '备注',
          'attach_upload': '附件上传',
          'reissued': '重新提交'
        },
        operMapping: {
          'issued': '提议',
          'permitted': '审批',
          'finished': '完成',
          'summed': '完结',
          'rejected': '拒绝',
          'closed': '关闭工作',
          'reissued': '重新提交'
        },
        optimizationTypes: [
        ],
        periodOptions: PERIOD_OPTIONS,
        chains: {
          issued: {
            permitted: {
              manager: true
            },
            rejected: {
              manager: true
            },
            closed: {
              sales: false
            }
          },
          permitted: {
            finished: {
              manager: true
            },
            closed: {
              manager: false
            }
          },
          finished: {
            summed: {
              manager: true
            },
            closed: {
              manager: false
            }
          },
          summed: {
            closed: {
              manager: false
            }
          },
          rejected: {
            reissued: {
              manager: true
            },
            closed: {
              manager: false
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
              manager: false
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
        },
        wf: {
          suggestionId: 0,
          productId: '',
          shopId: undefined,
          productName: '',
          optimizationType: '',
          suggestion: '',
          title: '',
          status: undefined,
          history: [],
          sn: 1
        }
      }
    },
    created () {
      this.getShopList()
      this.getPageWorkflows()
      this.getAllWorkflows()
      this.listSuggestTypes()
      this.fieldsCn = this.fields.map(f => this.dictCn[f])
    },
    mounted () {
    },
    computed: {
      ...mapGetters(['userInfo']),
      getStatus () {
        if (this.$route.query.status) {
          return this.$route.query.status.split('_')
        }
        return []
        //  this.checkedList.map(ck => {
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
      updateVisibleColumns () {
        this.gridData = this.gridDataBackup.map(bk => {
          const newData = {}
          this.checkedList.forEach(c => {
            newData[c] = bk[c]
          })
          newData.history = bk.history
          newData.attachment = bk.attachment
          return newData
        })
      // this.headers = this.checkedList
      },
      getShopName (shopId) {
        const finder = this.shopList.find(s => s.shopId === shopId)
        return finder ? finder.shopName : ''
      },
      beforeRemove (file, fileList) {
        if (this.userInfo.roles.findIndex(r => r.roleId === 6) >= 0) {
          return this.$confirm(`确定移除 ${file.name}？`)
        } else {
          this.$alert('无权限删除附件', '注意', {confirmButtonText: '确定'})
          return false
        }
      },
      removeFile (suggestionId, file, fileList) {
        console.log(suggestionId, file, fileList)
        // api.delete('/suggestion/attachement/' + suggestionId)
      },
      analysis (row) {
  
      },
      downloadFile (file) {
        let eleLink = document.createElement('a')
        eleLink.download = file.name
        eleLink.style.display = 'none'
        eleLink.href = file.url
        // 触发点击
        document.body.appendChild(eleLink)
        eleLink.click()
        // 然后移除
        document.body.removeChild(eleLink)
      },
      updateDateRangeValue () {
        console.log(this.dr)
      },
      sizeChange (pageSize) {
        this.pageSize = pageSize
        this.getPageWorkflows()
      },
      updateLu () {
        let format = 'YYYY-MM-DD'
        let start = moment().subtract(this.periodSelect, 'days').format(format)
        let end = moment().format(format)
        const status = this.getStatus
  
        console.log('updateLu', status, start, end)
        // this.searchField.period = {
        //   dateType: status.join(','),
        //   start: start,
        //   end: end
        // }
        // this.getPageWorkflows()
      },
      listSuggestTypes () {
        api.get(`/api/suggest_type`).then(res => {
          this.optimizationTypes = res.data
        })
      },
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
        // console.log(json2csv)
        // const rows = data.map(t => this.GetRow(t, columns))
        const fields = this.fieldsCn
        console.log('fields', fields)
        // const fieldNames = columns.map(t => t.label)

        try {
          const result = json2csv.parse(this.download, { fields })
          console.log(result)
          const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + result
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
        // this.ExportCsv(this.gridData, columns, filename)
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
      doWorkflowUpdate (row) {
        this.wf.suggestionId = row.suggestionId
        this.wf.productId = row.productId
        this.wf.shopId = row.shopId
        this.wf.productName = row.name
        this.wf.optimizationType = row.suggestType
        this.wf.suggestion = row.suggestion
        this.wf.sn = row.sn
        this.wf.title = row.title
        this.wf.status = row.status
        this.wf.history = row.history

        this.dialogWorkflowVisible = true
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
              status: this.getStatus,
              ...this.searchField
            }
          }
        }
        console.log('params', params, this.getStatus)
        this.$store.dispatch('setLoadingState', !hideWorkingDialog && true)
        api.post(`/api/suggestion/pagination`, params).then(res => {
          if (res.status === 200 && res.data) {
            this.gridData = res.data.grid
            this.gridData.forEach(w => {
              api.get(`/api/suggestion/${w.suggestionId}/history`).then(res => {
                w.history = res.data
              })
              api.get(`/api/suggestion/attachement/${w.suggestionId}`).then(attachment => {
                console.log(attachment)
                w.attachment = attachment.data.map(a => {
                  return {
                    name: '<' + this.typeReverseMapping[a.status] + '>' + a.fileName,
                    url: api.baseURL + a.fileUrl
                  }
                })
              })
            })
            this.gridDataBackup = this.gridData
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
              shopId: this.shopId,
              status: this.getStatus,
              ...this.searchField
            }
          }
        }
        console.log(this.getStatus)
        this.$store.dispatch('setLoadingState', !hideWorkingDialog && true)
        api.post(`/api/suggestion/pagination`, params).then(res => {
          if (res.status === 200 && res.data) {
            this.download = res.data.grid.map(dt => {
              let reformat = {}
              for (let key in dt) {
                if (key === 'status') {
                  reformat[this.dictCn[key]] = this.typeReverseMapping[dt[key]]
                } else {
                  reformat[this.dictCn[key]] = dt[key]
                }
              }
              return reformat
            })
            console.log('this.download', this.download)
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
        //   let copied = self.gridData
        //   self.gridData.map((wf, index) => {
        //     if (wf.suggestionId === eRow.suggestionId) {
        //       currentIndex = index
        //     }
        //   })
        //   if (currentIndex !== undefined) {
        //     (function (activeRow, activeIndex) {
        //       api.get(`/api/suggestion/${activeRow.suggestionId}/history`).then(res => {
        //         copied[activeIndex].history = res.data
        //         self.$nextTick(() => {
        //           self.gridData = copied
        //         })
        //       })
        //     })(eRow, currentIndex)
        //   }
        // })
      },
      getDescription (row, step) {
        let description = ''
        row.history.forEach(h => {
          if (step === h.operation) {
            description += ('(' + h.date + ') ' + h.operator + ': ' + h.message)
          }
        })
        return description === '' ? '(流程中)' : description
      },
      processSuggest (row, nextStatus) {
        this.dialogWorkflowVisible = false
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
      addComment (id, message, sn) {
        const params = {
          suggestionId: id,
          message: message,
          sn: sn
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
      getAuthHeaders () {
        let headers = {}
        headers[api.tokenKey] = api.getToken()
        return headers
      },
      getUploadUrl (suggestionId) {
        return api.baseURL + '/api/suggestion/attachement/' + suggestionId
      },
      handlerUploader (file, fileList) {
        console.log(api, file, fileList)
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

<style scoped lang="scss">
.first-search {
  margin-bottom: 0px;
}
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

.download {
  color: #FF6600;
  font-size: 24px;
}
.search-bar {
  margin-bottom: 20px;  
  .el-form-item {
    margin-bottom: 0px!important;
  }
}
.nation-select {
  width: 110px!important;
}
.el-icon-star-on {
  color:#FF6600
}

.asin-input {
  width: 150px!important;
}
.rate-select {
  width: 110px!important;
}

.time-select {
  width: 150px!important;
}

.shop-select {
  width: 160px!important;
}
</style>

 
  