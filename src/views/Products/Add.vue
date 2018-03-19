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
      <el-select
        v-model="product.classRanks"
        multiple
        filterable
        allow-create
        default-first-option
        placeholder="请选择关键字"
        class="products-keywords-select">
        <el-option
          v-for="item in product.classRanks"
          :key="item.class + '_' + item.rank"
          :label="item.class"
          :value="item.class">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="竞品">
      <div v-for="cp in competitors" :key="cp.competitorId">
        {{cp.competitorId}} <i class="el-icon-delete" @click="deleteCompetitor(cp.competitorId)"></i>
      </div>
      <el-button size="mini" icon="el-icon-plus" v-if="showAddButton" @click="addCompetitor" round>增加竞品</el-button>
      <el-button size="mini" v-if="!showAddButton" @click="saveCompetitor" round>保存竞品</el-button>
    </el-form-item>
    <div v-if="!showAddButton">
      <el-form-item label="竞品S/N">
        <el-input v-model="competitor.competitorAsin"></el-input>
      </el-form-item>
    </div>
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
      labelPosition: 'right',
      showAddButton: true,
      competitor: {
        productId: '',
        competitorAsin: '',
        shopId: ''
      }
    }
  },
  created () {
    let self = this
    if (self.$route.query && self.$route.query.name) {
      self.product = self.$route.query
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
      let self = this
      self.competitor.shopId = self.product.shopId
      self.competitor.productId = self.product.asin
      self.showAddButton = false
    },
    saveCompetitor () {
      let self = this
      api.post(`/api/product/competitor`, self.competitor).then(res => {
        self.listCompetitor()
      })
    },
    listCompetitor () {
      let self = this
      api.get(`/api/product/competitor/${self.product.shopId}/${self.product.asin}`).then(res => {
        self.competitors = res.data
      })
    },
    deleteCompetitor (id) {
      if (confirm('Do you want to delete the competitor product?')) {
        let self = this
        api.delete(`/api/product/competitor/${self.product.shopId}/${self.product.asin}/${id}`).then(res => {
          self.listCompetitor()
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


