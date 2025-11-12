<template>
    <NodeViewWrapper>
        <!-- {{ columnCount }} - {{ rowCount }} - {{ columnWidth }} - {{ rowHeight }} -->
        <div class="custom-table" @mouseenter="showIdentifiers = true" @mouseleave="showIdentifiers = false">
            <div class="identifiers-container" :class="{ 'show-identifiers': showIdentifiers }">
                <!-- 空白区域 -->
                <div class="corner-placeholder"></div>
                <!-- 横向标识块 -->
                <div class="horizontal-identifiers-container">
                    <div v-for="(col, index) in columnCount" :key="`col-${index}`" class="horizontal-identifier"
                        :style="{ width: columnWidth[index] - 2 + 'px' }" @click="selectColumn(index)">
                        {{ getColumnLetter(index) }}
                        <!-- 列宽调整手柄 -->
                        <div class="column-resize-handle" @mousedown="startColumnResize($event, index)"></div>
                        <!-- 列插入按钮 -->
                        <div class="column-insert-point" @mouseenter="hoveredColumnInsert = index"
                            @mouseleave="hoveredColumnInsert = -1" @click.stop="insertColumnAt(index)">
                            <div class="insert-icon" v-show="hoveredColumnInsert === index">+</div>
                        </div>
                    </div>
                    <!-- 最后一列右侧的插入按钮 -->
                    <div class="column-insert-point-last" @mouseenter="hoveredColumnInsert = columnCount"
                        @mouseleave="hoveredColumnInsert = -1" @click.stop="insertColumnAt(columnCount)">
                        <div class="insert-icon" v-show="hoveredColumnInsert === columnCount">+</div>
                    </div>
                </div>
                <div class="vertical-identifiers-container">
                    <!-- 纵向标识块 -->
                    <div v-for="(row, index) in rowCount" :key="`row-${index}`" class="vertical-identifier"
                        :style="{ height: rowHeight[index] - 2 + 'px' }" @click="selectRowOnClick(index)">
                        {{ index + 1 }}
                        <!-- 行高调整手柄 -->
                        <div class="row-resize-handle" @mousedown="startRowResize($event, index)"></div>
                        <!-- 行插入按钮 -->
                        <div class="row-insert-point" @mouseenter="hoveredRowInsert = index"
                            @mouseleave="hoveredRowInsert = -1" @click.stop="insertRowAt(index)">
                            <div class="insert-icon" v-show="hoveredRowInsert === index">+</div>
                        </div>
                    </div>
                    <!-- 最后一行下方的插入按钮 -->
                    <div class="row-insert-point-last" @mouseenter="hoveredRowInsert = rowCount"
                        @mouseleave="hoveredRowInsert = -1" @click.stop="insertRowAt(rowCount)">
                        <div class="insert-icon" v-show="hoveredRowInsert === rowCount">+</div>
                    </div>
                </div>
            </div>
            <div class="table-container">
                <table :style="{ width: tableWidth, height: tableHeight + 'px' }">
                    <colgroup>
                        <col v-for="(col, index) in columnCount" :key="`table-col-${index}`"
                            :style="{ width: columnWidth[index] + 'px' }" />
                    </colgroup>
                    <NodeViewContent as="tbody" style="position: relative;" />
                </table>
            </div>
        </div>
    </NodeViewWrapper>
</template>

<script setup>
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import { ref, onMounted, onUnmounted, computed } from 'vue'

// 定义列数、行数、列宽的响应式变量
const columnCount = ref(0)
const rowCount = ref(0)
const columnWidth = ref([])
const rowHeight = ref([])

// 标识块显示状态
const showIdentifiers = ref(false)
// 悬停的插入点位置
const hoveredColumnInsert = ref(-1)
const hoveredRowInsert = ref(-1)

// 表格高度
const tableHeight = computed(() => {
    return rowHeight.value.reduce((total, height) => Number(total) + Number(height), 0)
})
// 表格宽度
const tableWidth = computed(() => {
    return columnWidth.value.reduce((total, width) => Number(total) + Number(width), 0) + 'px'
})



// 拖动状态变量
const isResizingColumn = ref(false)
const isResizingRow = ref(false)
const currentResizeIndex = ref(-1)
const startX = ref(0)
const startY = ref(0)
const startWidth = ref(0)
const startHeight = ref(0)

const props = defineProps(nodeViewProps)


function selectColumn(columnIndex) {
    let currentIndex = 0
    let posList = []
    const tablePos = props.getPos()
    props.node.descendants((node, pos) => {

        if (node.type.name === 'tableRow') {
            currentIndex = 0
        }
        if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {

            if (currentIndex == columnIndex) {
                posList.push(pos + 1)
            }
            currentIndex++
            return false
        }
    })

    props.editor.commands.setCellSelection({ anchorCell: tablePos + Math.min(...posList), headCell: tablePos + Math.max(...posList) })
}

onMounted(() => {
    // 初始化数据
    initTableData()

    // 添加全局事件监听器
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
    // 移除全局事件监听器
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
})

// 初始化表格数据
function initTableData() {
    try {

        // 安全检查
        if (!props.node) {
            console.warn('Node is not available')
            return
        }

        const rows = props.node.children
        rowCount.value = rows ? rows.length : 0

        if (rows && rows.length > 0 && rows[0].children) {
            const columns = rows[0].children
            columnCount.value = columns ? columns.length : 0

            // 初始化列宽
            columnWidth.value = columns.map((column) => {
                return column.attrs?.colwidth ? column.attrs.colwidth : 200
            })
        }

        // 初始化行高
        if (rows) {
            rowHeight.value = rows.map((row) => {
                return row.attrs?.height ? row.attrs.height : 40
            })
        }
    } catch (error) {
        console.error('Error initializing table data:', error)
    }
}

function setSelectRow(index) {
    const tablePos = props.getPos()

    let currentIndex = 0
    let rowPos = null

    props.node.descendants((node, pos) => {
        if (rowPos !== null) {
            return false
        }
        else if (node.type.name === 'tableRow') {
            if (currentIndex === index) {
                rowPos = tablePos + pos + 1
                return false
            }
            currentIndex++
        }
    })

    props.editor.commands.setNodeSelection(rowPos)
}

function setTableRowHeight(index, height) {
    setSelectRow(index)
    props.editor.commands.updateAttributes('tableRow', {
        height: height
    })
}

// 将数字索引转换为Excel风格的列字母标识 (A, B, C, ..., Z, AA, AB, ...)
function getColumnLetter(index) {
    let letter = ''
    let num = index

    while (num >= 0) {
        letter = String.fromCharCode(65 + (num % 26)) + letter
        num = Math.floor(num / 26) - 1
    }

    return letter
}

// 在指定列后插入新列
function insertColumnAt(index) {
    if (index === columnCount.value) {
        selectColumn(index - 1)
        props.editor.commands.addColumnAfter()
        selectColumn(index)
        initTableData()
    } else {
        selectColumn(index)
        props.editor.commands.addColumnBefore()
        selectColumn(index)
        initTableData()
    }
}

// 在指定位置插入新行
function insertRowAt(index) {
    if (index === rowCount.value) {
        setSelectRow(index - 1)
        props.editor.commands.addRowAfter()
        setSelectRow(index)
        initTableData()
    } else {
        setSelectRow(index)
        props.editor.commands.addRowBefore()
        setSelectRow(index)
        initTableData()
    }

    // 这里应该调用editor的命令来插入行
    // 实际实现需要根据编辑器的API来编写
    // props.editor.commands.insertRowAt(index) 或类似方法
}

// 点击纵向标识块时选中对应行
function selectRowOnClick(index) {
    setSelectRow(index)
}

// 开始调整列宽
function startColumnResize(event, index) {
    event.preventDefault()
    isResizingColumn.value = true
    currentResizeIndex.value = index
    startX.value = event.clientX
    startWidth.value = columnWidth.value[index]

    // 更改鼠标样式
    document.body.style.cursor = 'col-resize'
}

// 开始调整行高
function startRowResize(event, index) {
    event.preventDefault()
    isResizingRow.value = true
    currentResizeIndex.value = index
    startY.value = event.clientY
    startHeight.value = rowHeight.value[index]

    // 更改鼠标样式
    document.body.style.cursor = 'row-resize'
}

// 处理鼠标移动
function handleMouseMove(event) {
    if (isResizingColumn.value) {
        const deltaX = event.clientX - startX.value
        const newWidth = Math.max(30, startWidth.value + deltaX) // 最小宽度30px
        columnWidth.value[currentResizeIndex.value] = newWidth
    }

    if (isResizingRow.value) {
        const deltaY = event.clientY - startY.value
        const newHeight = Math.max(10, Number(startHeight.value) + Number(deltaY)) // 最小高度20px
        rowHeight.value[currentResizeIndex.value] = newHeight

        setTableRowHeight(currentResizeIndex.value, newHeight)

    }
}

// 处理鼠标松开
function handleMouseUp() {
    if (isResizingColumn.value || isResizingRow.value) {
        isResizingColumn.value = false
        isResizingRow.value = false
        currentResizeIndex.value = -1
        document.body.style.cursor = '' // 恢复鼠标样式

        // 这里可以添加保存调整后尺寸的逻辑
        // console.log('调整后的列宽:', columnWidth.value)
        // console.log('调整后的行高:', rowHeight.value)
    }
}


</script>

<style scoped>
.custom-table {
    position: relative;
    height: v-bind(tableHeight + 30 + 'px');
}

.identifiers-container {
    position: absolute;
    height: 100%;
    width: 100%;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
}

.identifiers-container.show-identifiers {
    opacity: 1;
    pointer-events: auto;
}

.corner-placeholder {
    position: absolute;
    top: 5px;
    left: 5px;
    background-color: rgb(255, 255, 255);
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    border-bottom: none;
    border-right: none;
    border-radius: 5px 8px 0 8px;
}

.horizontal-identifiers-container {
    position: absolute;
    left: 25px;
    top: 5px;
    height: 20px;
    display: flex;
    z-index: 5;
}

.horizontal-identifier {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-bottom: none;
    height: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    position: relative;
    cursor: pointer;
    border-radius: 10px 10px 0 0;
}

.vertical-identifiers-container {
    position: absolute;
    top: 25px;
    left: 5px;
    width: 20px;
    display: flex;
    flex-direction: column;
    z-index: 5;
}

.vertical-identifier {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-right: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    width: 19px;
    position: relative;
    cursor: pointer;
    border-radius: 10px 0px 0 10px;
}

.table-container {
    position: absolute;
    top: 25px;
    left: 25px;
}

/* 列宽调整手柄 */
.column-resize-handle {
    position: absolute;
    right: 0;
    top: 0;
    width: 4px;
    height: 100%;
    cursor: col-resize;
    background-color: transparent;
}

.column-resize-handle:hover {
    background-color: #007bff;
}

/* 行高调整手柄 */
.row-resize-handle {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    cursor: row-resize;
    background-color: transparent;
}

.row-resize-handle:hover {
    background-color: #007bff;
}

/* 拖动时的全局样式 */
:global(.resizing-column) {
    cursor: col-resize !important;
}

:global(.resizing-row) {
    cursor: row-resize !important;
}

/* 最后一个元素的手柄微调 */
.horizontal-identifiers-container>div:last-child .column-resize-handle {
    right: -2px;
}

.vertical-identifiers-container>div:last-child .row-resize-handle {
    bottom: -2px;
}

/* 列插入点样式 */
.column-insert-point {
    position: absolute;
    left: -3.5px;
    top: -5px;
    width: 5px;
    height: 5px;
    background-color: #bfb3b3;
    border-radius: 50%;
    cursor: pointer;
}

.column-insert-point-last {
    position: relative;
    right: 2px;
    top: -2px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #bfb3b3;
}


/* 行插入点样式 */
.row-insert-point {
    position: absolute;
    right: 18px;
    top: -3.5px;
    width: 5px;
    height: 5px;
    background-color: #bfb3b3;
    border-radius: 50%;
    cursor: pointer;
}

.row-insert-point-last {
    position: relative;
    right: 2px;
    top: -2px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #bfb3b3;
}

/* 插入图标样式 */
.insert-icon {
    position: absolute;
    left: -8px;
    top: -8px;
    width: 16px;
    height: 16px;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #666;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

.insert-icon:hover {
    border-color: #1890ff;
    color: #1890ff;
}

/* 调整插入图标位置 */
.column-insert-point .insert-icon {
    right: -4px;
    top: -4px;
}

.row-insert-point .insert-icon {
    left: -4px;
    top: -4px;
}
</style>

<style>
.tiptap table {
    border-collapse: collapse;
    margin: 0;
    overflow: auto;
    table-layout: fixed;
}

.tiptap table td,
.tiptap table th {
    border: 1px solid var(--gray-3);
    min-width: 1em;
    padding: 6px 8px;
    position: relative;
    vertical-align: top;
    min-height: 5px;
    line-height: 5px;
}

.tiptap table td>*,
.tiptap table th>* {
    margin-bottom: 0;
}

.tiptap table th {
    background-color: var(--gray-1);
    font-weight: bold;
    text-align: left;
}

.tiptap table .selectedCell:after {
    background: var(--gray-2);
    content: '';
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    position: absolute;
    z-index: 2;
}

.tiptap table .column-resize-handle {
    background-color: var(--purple);
    bottom: -2px;
    pointer-events: none;
    position: absolute;
    right: -2px;
    top: 0;
    width: 4px;
}

.tiptap .tableWrapper {
    overflow-x: auto;
}

.tiptap.resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
}
</style>