# tiptap-table-vue
tiptap table extension

在Editor文件中引用
```
<template>
  <div>
   <button @click="insertTable(2,3,true)">插入表格</button>
</div>
  <div style="width: 100%;">
    <editor-content :editor="editor" />
  </div>
</template>
<script setup>
import CustomTable from './Table/CustomTable.js';
import CustomTableRow from './Table/CustomTableRow.js';
import CustomTableCell from './Table/CustomTableCell.js';
import CustomTableHeader from './Table/CustomTableHeader.js';


function insertTable(row, col, withHeaderRow) {
  editor.chain().focus().insertTable({ rows: row, cols: col, withHeaderRow: withHeaderRow }).run()
}

const editor = new Editor({
  content: editModel.value,
  extensions: [
    CustomTable, // 注意不能用 rsizable: true,
    CustomTableCell,
    CustomTableHeader,
    CustomTableRow,
  ],
  onUpdate: () => {
    editModel.value = editor.getHTML()
  }
})
</script>
```

是对这些节点的扩展，节点命令可直接使用
```
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table/cell'
import { TableHeader } from '@tiptap/extension-table/header'
import { TableRow } from '@tiptap/extension-table/row'
```
