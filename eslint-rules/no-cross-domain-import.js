/**
 * Custom ESLint rule: Prevent direct imports between domain directories.
 * Domains must communicate via platform/event-bus, not direct imports.
 *
 * Forbidden: domains/wiki/ importing from domains/battle/
 * Forbidden: domains/cards/ importing from domains/stories/
 * Allowed: Any domain importing from platform/, metal/, lib/, types/
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent direct imports between domain directories',
      category: 'Architecture',
      recommended: 'error',
    },
    schema: [],
    messages: {
      noCrossDomain: 'Cross-domain import detected: {{source}} → {{target}}. Use platform/event-bus for inter-domain communication.',
    },
  },
  create(context) {
    const domainDirs = ['wiki', 'battle', 'cards', 'stories', 'civilizations']

    function getDomain(filePath) {
      const match = filePath.match(/src\/domains\/([^/]+)/)
      return match ? match[1] : null
    }

    function isInSource(filePath) {
      return filePath.includes('/src/domains/') || filePath.includes('src\\domains\\')
    }

    return {
      ImportDeclaration(node) {
        const sourcePath = node.source.value
        const filePath = context.getFilename()

        if (!isInSource(filePath)) return

        const sourceDomain = getDomain(filePath)
        if (!sourceDomain) return

        // Check if import is from a different domain
        if (sourcePath.startsWith('@/domains/')) {
          const match = sourcePath.match(/^@\/domains\/([^/]+)/)
          const targetDomain = match ? match[1] : null
          if (targetDomain && domainDirs.includes(targetDomain) && targetDomain !== sourceDomain) {
            context.report({
              node,
              messageId: 'noCrossDomain',
              data: {
                source: sourceDomain,
                target: targetDomain,
              },
            })
          }
        }
      },
    }
  },
}
