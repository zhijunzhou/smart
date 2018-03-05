<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-table
            :data="pageProducts">
            <el-table-column
              type="selection">
            </el-table-column>
            <el-table-column
              label="日期"
              prop="label"
              sortable>
            </el-table-column>
            <el-table-column
              label="商品"
              prop="name"
              sortable>
            </el-table-column>
            <el-table-column
              label="销量"
              prop="sales"
              sortable>
            </el-table-column>
            <el-table-column
              label="S/N码"
              prop="sn">
            </el-table-column>
            <el-table-column
              label="类目"
              prop="category">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button size="mini" round>编辑</el-button>
                <el-button size="mini" round>
                  <router-link :to="{path: '/main/analysis'}">分析</router-link>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-col>
      <el-col :span="24" class="text-right">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          @current-change="updatePageProducts"
          :page-size="pageSize"
          :total="products.length">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      products: [],
      pageSize: 15,
      pageProducts: []
    }
  },
  created () {
    for (let i = 1; i <= 100; i++) {
      this.products.push({
        index: i,
        label: '2018-01-01',
        name: '测试数据' + i,
        sales: Math.round(Math.random() * 45 + 55),
        sn: 'SN码' + i,
        category: '类目一',
        shop: '所属店铺',
        description: '描述文字' + i
      })
    }
    this.pageProducts = this.products.slice(0, this.pageSize)
  },
  methods: {
    updatePageProducts (currentPage) {
      let start = (currentPage - 1) * this.pageSize
      let lastPageSize = this.products.length % this.pageSize
      let isLastPage = Math.ceil(this.products.length / this.pageSize) === currentPage
      let end = start + (isLastPage ? lastPageSize : this.pageSize)
      this.pageProducts = this.products.slice(start, end)
    }
  }
}
</script>

