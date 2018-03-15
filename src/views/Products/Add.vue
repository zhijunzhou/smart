<template v-if="product">
  <el-form :label-position="labelPosition" label-width="80px" class="product-form">
    <el-form-item label="产品S/N">
      <el-input v-model="product.sn"></el-input>
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
      <el-input type="textarea" v-model="product.description"></el-input>
    </el-form-item>
    <el-form-item label="关键字">
      <el-select
        v-model="product.keywords"
        multiple
        filterable
        allow-create
        default-first-option
        placeholder="请选择关键字"
        class="products-keywords-select">
        <el-option
          v-for="item in product.keywords"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="竞品" class="text-center">
      <el-button size="mini" icon="el-icon-plus" round>增加竞品</el-button>
    </el-form-item>
    <el-form-item label="竞品S/N">
      <el-input v-model="product.sn"></el-input>
    </el-form-item>
    <el-form-item label="竞品图片">
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
    <el-form-item label="竞品描述">
      <el-input type="textarea" v-model="product.description"></el-input>
    </el-form-item>
    <el-form-item class="text-center">
      <el-button type="primary" round>立即保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      product: {},
      labelPosition: 'right'
    }
  },
  created () {
    if (this.$route.query && this.$route.query.name) {
      this.product = this.$route.query
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


