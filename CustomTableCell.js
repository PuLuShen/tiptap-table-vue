import { TableCell } from '@tiptap/extension-table/cell'


const CustomTableCell = TableCell.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            backgroundColor: {
                default: null,
                parseHTML: (element) => element.style.backgroundColor,
                renderHTML: (attributes) => {
                    const styles = []
                    if (attributes.backgroundColor) {
                        styles.push(`background-color: ${attributes.backgroundColor}`)
                    }
                    // 通用边框（当没有指定单边时使用）
                    const bw = attributes.borderWidth
                    const bs = attributes.borderStyle
                    const bc = attributes.borderColor
                    if (bw || bs || bc) {
                        styles.push(`border: ${bw || '1px'} ${bs || 'solid'} ${bc || 'var(--gray-3)'}`)
                    }
                    // 单边边框（优先覆盖通用边框）
                    const sides = ['Top', 'Right', 'Bottom', 'Left']
                    sides.forEach(s => {
                        const sw = attributes[`border${s}Width`]
                        const ss = attributes[`border${s}Style`]
                        const sc = attributes[`border${s}Color`]
                        if (sw || ss || sc) {
                            styles.push(`border-${s.toLowerCase()}: ${sw || '1px'} ${ss || 'solid'} ${sc || 'var(--gray-3)'}`)
                        }
                    })
                    return styles.length ? { style: styles.join('; ') } : {}
                },
            },
            borderColor: { default: null, parseHTML: (el) => el.style.borderColor || null, renderHTML: () => ({}) },
            borderStyle: { default: null, parseHTML: (el) => el.style.borderStyle || null, renderHTML: () => ({}) },
            borderWidth: { default: null, parseHTML: (el) => el.style.borderWidth || null, renderHTML: () => ({}) },
            borderTopColor: { default: null, parseHTML: (el) => el.style.borderTopColor || null, renderHTML: () => ({}) },
            borderTopStyle: { default: null, parseHTML: (el) => el.style.borderTopStyle || null, renderHTML: () => ({}) },
            borderTopWidth: { default: null, parseHTML: (el) => el.style.borderTopWidth || null, renderHTML: () => ({}) },
            borderRightColor: { default: null, parseHTML: (el) => el.style.borderRightColor || null, renderHTML: () => ({}) },
            borderRightStyle: { default: null, parseHTML: (el) => el.style.borderRightStyle || null, renderHTML: () => ({}) },
            borderRightWidth: { default: null, parseHTML: (el) => el.style.borderRightWidth || null, renderHTML: () => ({}) },
            borderBottomColor: { default: null, parseHTML: (el) => el.style.borderBottomColor || null, renderHTML: () => ({}) },
            borderBottomStyle: { default: null, parseHTML: (el) => el.style.borderBottomStyle || null, renderHTML: () => ({}) },
            borderBottomWidth: { default: null, parseHTML: (el) => el.style.borderBottomWidth || null, renderHTML: () => ({}) },
            borderLeftColor: { default: null, parseHTML: (el) => el.style.borderLeftColor || null, renderHTML: () => ({}) },
            borderLeftStyle: { default: null, parseHTML: (el) => el.style.borderLeftStyle || null, renderHTML: () => ({}) },
            borderLeftWidth: { default: null, parseHTML: (el) => el.style.borderLeftWidth || null, renderHTML: () => ({}) },
        };
    },
});

export default CustomTableCell