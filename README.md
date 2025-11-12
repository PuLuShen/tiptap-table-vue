# tiptap-table-vue
tiptap table extension

<img width="1286" height="682" alt="image" src="https://github.com/user-attachments/assets/72ce2824-f099-4167-9d81-9d9b5e8593bc" />


在Editor文件中引用
```
<template>
  <div>
   <button @click.prevent="insertTable(2,3,false)">插入表格</button>
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

基于这些扩展开发,使用前安装这些扩展,在Tiptap官网中可以看到它们的使用方式,命令也可以直接使用：
```
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table/cell'
import { TableHeader } from '@tiptap/extension-table/header'
import { TableRow } from '@tiptap/extension-table/row'
```
