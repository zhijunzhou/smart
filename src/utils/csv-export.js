// // import {json2csv} from 'json2csv'
// const json2csv = require('json2csv')

// function GetRow (row, columns) {
//   let obj = {}

//   columns.forEach(col => {
//     let val = row[col.prop]

//     if (col.formatter) {
//       val = col.formatter(row, col, val)
//     }

//     obj[col.prop] = val
//   })

//   return obj
// }

// export default function ExportCsv (data, columns, fileName) {
//   const rows = data.map(t => GetRow(t, columns))
//   const fields = columns.map(t => t.prop)
//   const fieldNames = columns.map(t => t.label)

//   try {
//     const result = json2csv({ data: rows, fields, fieldNames })
//     const csvContent = 'data:text/csv;charset=GBK,\uFEFF' + result
//     const link = document.createElement('a')
//     link.href = encodeURI(csvContent)
//     link.download = `${fileName}.csv`
//     document.body.appendChild(link) // Required for FF
//     link.click() // This will download the data file named 'my_data.csv'.
//     document.body.removeChild(link) // Required for FF
//   } catch (err) {
//     // Errors are thrown for bad options, or if the data is empty and no fields are provided.
//     // Be sure to provide fields if it is possible that your data array will be empty.
//     console.error(err)
//   }
// }
