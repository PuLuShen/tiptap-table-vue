import { TableRow } from '@tiptap/extension-table/row'

const CustomTableRow = TableRow.extend({
    addAttributes() {
        return {
            ...this.parent?.addAttributes(),
            'height': {
                default: 100,
                parseHTML: (element) => element.getAttribute('height') || element.style.height?.replace('px', ''),
                renderHTML: (attributes) => ({
                    style: attributes.height ? `height: ${attributes.height}px` : null
                })
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'tr',
                getAttrs: (node) => {
                    const height = node.getAttribute('height') || node.style.height?.replace('px', '')
                    return {
                        'height': height ? parseInt(height) : null,
                    }
                },
            },
        ]
    },
    renderHTML({ node, HTMLAttributes }) {
        // 合并自定义样式与HTML属性
        const style = {
            ...(HTMLAttributes.style ? { style: HTMLAttributes.style } : {}),
            height: `${node.attrs.height}px`,
            padding: '0px',
            margin: '0px',
            overflow: 'hidden'
        }
        
        // 移除原始的style属性
        delete HTMLAttributes.style
        
        return ['tr', { ...HTMLAttributes, style: Object.entries(style).map(([key, value]) => `${key}: ${value}`).join('; ') }, 0]
    }
})

export default CustomTableRow