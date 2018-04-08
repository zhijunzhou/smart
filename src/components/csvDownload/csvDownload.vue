<template>
    <a :download="downloadName" :href="downloadUrl" :disabled="this.data.length === 0">
        <slot>
            <i class="fa fa-file-excel-o" aria-hidden="true"></i>
        </slot>
    </a>
</template>

<script>
import json2csv from 'json2csv'
export default {
  props: {
    fields: undefined,
    data: undefined,
    downloadName: {
      default: 'export.csv'
    }
  },
  computed: {
    downloadUrl () {
      if (this.data.length > 0) {
        const fields = this.fields
        const result = json2csv.parse(this.data, { fields })
        const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + result
        return encodeURI(csvContent)
      }
      return 'javascript: void(0)'
    }
  }
}
</script>
