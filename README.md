# tiptap-table-vue
tiptap table extension

在Editor文件中引用
```
import CustomTable from './Table/CustomTable.js';
import CustomTableRow from './Table/CustomTableRow.js';
import CustomTableCell from './Table/CustomTableCell.js';
import CustomTableHeader from './Table/CustomTableHeader.js';

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
```

是对这些节点的扩展，节点命令可直接使用
```
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table/cell'
import { TableHeader } from '@tiptap/extension-table/header'
import { TableRow } from '@tiptap/extension-table/row'
```
