<template v-if="product">
    <el-form :label-position="labelPosition" label-width="80px" class="product-form">
      <el-form-item label="优化类型">
        <div v-for="(kw, index) in suggestTypes" :key="kw + '_' + index">
          {{kw.typeName}} <i class="el-icon-delete" @click="deleteSuggestType(kw)"></i>
        </div>
        <div v-if="showAddKwButton === false">
          <el-input v-model="gSuggestType.typeName" placeholder="优化类型"></el-input>
        </div>
        <el-button size="mini" icon="el-icon-plus" v-if="showAddKwButton === true" @click="addSuggestType" round>增加优化类型</el-button>
        <el-button size="mini" v-if="showAddKwButton === false" @click="saveSuggestType" round>保存优化类型</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script>
  import api from '@/utils/api'
  import { MessageBox, Message } from 'element-ui'
  
  export default {
    data () {
      return {
        product: {},
        competitors: [],
        suggestTypes: [],
        closable: false,
        labelPosition: 'right',
        showAddCpButton: true,
        showAddKwButton: true,
        competitor: {
          productId: '',
          competitorId: '',
          shopId: ''
        },
        gSuggestType: {
          productId: '',
          suggestType: '',
          shopId: ''
        }
      }
    },
    created () {
      this.listSuggestTypes()
    },
    methods: {
      handleAvatarSuccess (res, file) {
        this.product.imgUrl = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
  
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      addSuggestType () {
        this.gSuggestType.shopId = this.product.shopId
        this.gSuggestType.productId = this.product.asin
        this.showAddKwButton = false
      },
      clearCompetitor () {
        this.competitor.competitorId = undefined
        this.competitor = Object.assign({}, this.competitor)
        this.showAddCpButton = true
      },
      clearGKeywork () {
        this.gSuggestType.typeName = undefined
        this.gSuggestType = Object.assign({}, this.gSuggestType)
        this.showAddCpButton = true
      },
      saveSuggestType () {
        let self = this
        api.post(`/api/suggest_type`, self.gSuggestType).then(res => {
          self.listSuggestTypes()
        })
      },
      listCompetitor () {
        let self = this
        api.get(`/api/product/competitor/${self.product.shopId}/${self.product.asin}`).then(res => {
          self.competitors = res.data
          self.listSuggestTypes()
          self.clearCompetitor()
        })
      },
      listSuggestTypes () {
        let self = this
        api.get(`/api/suggest_type`).then(res => {
          self.suggestTypes = res.data
          self.clearGKeywork()
        })
      },
      deleteSuggestType (kw) {
        let self = this
        MessageBox.confirm('确定删除优化类型?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.delete(`/api/suggest_type/${kw.typeId}`).then(res => {
            self.listSuggestTypes()
            Message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          })
        })
        // if (confirm('Do you want to delete the suggestType?')) {
        //   let self = this
        //   api.delete(`/api/product/suggestType/${self.product.shopId}/${kw.suggestTypeId}`).then(res => {
        //     self.listSuggestTypes()
        //   })
        // }
      }
    }
  }
  </script>
  <style>
  .product-form {
    width: 500px;
  }
  .products-suggestTypes-select {
    width: 100%;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 108px;
    height: 108px;
    line-height: 108px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  </style>
  
  
  