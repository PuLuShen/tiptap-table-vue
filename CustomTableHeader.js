import { TableHeader } from '@tiptap/extension-table/header'


const CustomTableHeader = TableHeader.extend({
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
          const bw = attributes.borderWidth
          const bs = attributes.borderStyle
          const bc = attributes.borderColor
          if (bw || bs || bc) {
            styles.push(`border: ${bw || '1px'} ${bs || 'solid'} ${bc || 'var(--gray-3)'}`)
          }
          return styles.length ? { style: styles.join('; ') } : {}
        },
      },
      borderColor: { default: null, parseHTML: (element) => element.style.borderColor || null, renderHTML: () => ({}) },
      borderStyle: { default: null, parseHTML: (element) => element.style.borderStyle || null, renderHTML: () => ({}) },
      borderWidth: { default: null, parseHTML: (element) => element.style.borderWidth || null, renderHTML: () => ({}) },
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

export default CustomTableHeader