/**
 * Custom ESLint rule: Require JSDoc on exported functions in domains/ and metal/.
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require JSDoc comments on exported functions in domain and metal layers',
      category: 'Documentation',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      missingJSDoc: 'Exported function "{{name}}" is missing a JSDoc comment.',
    },
  },
  create(context) {
    const filePath = context.getFilename()
    const shouldCheck =
      filePath.includes('/domains/') ||
      filePath.includes('/metal/') ||
      filePath.includes('\\domains\\') ||
      filePath.includes('\\metal\\')

    function hasJSDoc(node) {
      // JSDoc is typically attached to the parent ExportNamedDeclaration,
      // not to the inner FunctionDeclaration. Check both.
      const src = context.getSourceCode()
      const comments = [
        ...src.getCommentsBefore(node),
        ...(node.parent ? src.getCommentsBefore(node.parent) : []),
      ]
      return comments.some((c) => c.type === 'Block' && /^\s*\*/.test(c.value))
    }

    return shouldCheck
      ? {
          'ExportNamedDeclaration > FunctionDeclaration'(node) {
            if (!hasJSDoc(node)) {
              context.report({
                node,
                messageId: 'missingJSDoc',
                data: { name: node.id?.name || 'anonymous' },
              })
            }
          },
          'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression'(node) {
            const parent = node.parent.parent
            if (parent && !hasJSDoc(parent.parent)) {
              const name = parent.id?.name || 'anonymous'
              context.report({
                node,
                messageId: 'missingJSDoc',
                data: { name },
              })
            }
          },
        }
      : {}
  },
}
