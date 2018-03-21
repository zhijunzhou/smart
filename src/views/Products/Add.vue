<template v-if="product">
  <el-form :label-position="labelPosition" label-width="80px" class="product-form">
    <el-form-item label="产品S/N">
      <el-input v-model="product.asin"></el-input>
    </el-form-item>
    <el-form-item label="图片">
      <el-upload
        class="avatar-uploader"
        action=""
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="product.imgUrl" :src="product.imgUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="描述">
      <el-input type="textarea" v-model="product.name"></el-input>
    </el-form-item>
    <el-form-item label="关键字">
      <div v-for="(kw, index) in keywords" :key="kw + '_' + index">
        {{kw.keyword}} <i class="el-icon-delete" @click="deleteKeyword(kw)"></i>
      </div>
      <div v-if="showAddKwButton === false">
        <el-input v-model="gKeyword.keyword" placeholder="关键字"></el-input>
      </div>
      <el-button size="mini" icon="el-icon-plus" v-if="showAddKwButton === true" @click="addKeyword" round>增加关键字</el-button>
      <el-button size="mini" v-if="showAddKwButton === false" @click="saveKeyword" round>保存关键字</el-button>
    </el-form-item>
    <el-form-item label="竞品">
      <div v-for="cp in competitors" :key="cp.competitorId">
        {{cp.competitorId}} <i class="el-icon-delete" @click="deleteCompetitor(cp.competitorId)"></i>
      </div>
      <div v-if="showAddCpButton === false">
        <el-input v-model="competitor.competitorId" placeholder="竞品S/N"></el-input>
      </div>
      <el-button size="mini" icon="el-icon-plus" v-if="showAddCpButton === true" @click="addCompetitor" round>增加竞品</el-button>
      <el-button size="mini" v-if="showAddCpButton === false" @click="saveCompetitor" round>保存竞品</el-button>
    </el-form-item>
    <el-form-item class="text-center">
      <el-button type="primary" round>立即保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import api from '@/utils/api'

export default {
  data () {
    return {
      product: {},
      competitors: [],
      keywords: [],
      labelPosition: 'right',
      showAddCpButton: true,
      showAddKwButton: true,
      competitor: {
        productId: '',
        competitorId: '',
        shopId: ''
      },
      gKeyword: {
        productId: '',
        keyword: '',
        shopId: ''
      }
    }
  },
  created () {
    let self = this
    if (self.$route.query && self.$route.query.name) {
      self.product = self.$route.query
      console.log(self.product)
      self.listCompetitor()
    }
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
    addCompetitor () {
      this.competitor.shopId = this.product.shopId
      this.competitor.productId = this.product.asin
      this.showAddCpButton = false
    },
    addKeyword () {
      this.gKeyword.shopId = this.product.shopId
      this.gKeyword.productId = this.product.asin
      this.showAddKwButton = false
    },
    assignKeywords (data) {
      let self = this
      self.keywords = data.map(kw => {
        return {
          keywordId: kw.keywordId,
          keyword: kw.keyword
        }
      })
      console.log(self.keywords)
    },
    clearCompetitor () {
      this.competitor.competitorId = undefined
      this.competitor = Object.assign({}, this.competitor)
      this.showAddCpButton = true
    },
    clearGKeywork () {
      this.gKeyword.keyword = undefined
      this.gKeyword = Object.assign({}, this.gKeyword)
      this.showAddCpButton = true
    },
    saveCompetitor () {
      let self = this
      api.post(`/api/product/competitor`, self.competitor).then(res => {
        self.listCompetitor()
      })
    },
    saveKeyword () {
      let self = this
      api.post(`/api/product/keyword`, self.gKeyword).then(res => {
        self.listKeywords()
      })
    },
    listCompetitor () {
      let self = this
      api.get(`/api/product/competitor/${self.product.shopId}/${self.product.asin}`).then(res => {
        self.competitors = res.data
        self.listKeywords()
        self.clearCompetitor()
      })
    },
    listKeywords () {
      let self = this
      api.get(`/api/product/keyword/${self.product.shopId}/${self.product.asin}`).then(res => {
        self.assignKeywords(res.data)
        self.clearGKeywork()
      })
    },
    deleteCompetitor (id) {
      if (confirm('Do you want to delete the competitor product?')) {
        let self = this
        api.delete(`/api/product/competitor/${self.product.shopId}/${self.product.asin}/${id}`).then(res => {
          self.listCompetitor()
        })
      }
    },
    deleteKeyword (kw) {
      if (confirm('Do you want to delete the keyword?')) {
        let self = this
        api.delete(`/api/product/keyword/${self.product.shopId}/${kw.keywordId}`).then(res => {
          self.listKeywords()
        })
      }
    }
  }
}
</script>
<style>
.product-form {
  width: 500px;
}
.products-keywords-select {
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


