import { Table, TableView } from '@tiptap/extension-table';
import ExtendTable from './ExtendTable.vue';
import { VueNodeViewRenderer } from '@tiptap/vue-3';


const CustomTable = Table.extend({

    addNodeView() {
        return VueNodeViewRenderer(ExtendTable)
    }
})

export default CustomTable