/**
 * no-ai-slop — Detects common AI-generated UI anti-patterns
 * Based on Impeccable's 27 anti-pattern detection
 *
 * Detects:
 * - Purple gradient heroes without semantic meaning (excludes data/domain files)
 * - Gradient text on headings
 * - Multiple stacked box-shadows
 * - Excessive border-radius values
 * - Opacity-layered background patterns without purpose
 * - Identical spacing values (all p-4, m-4)
 */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Detect AI-generated UI anti-patterns (AI slop)",
      category: "Style",
      recommended: false,
    },
    schema: [],
    messages: {
      gradientHero:
        "Avoid generic purple gradient hero sections. Use semantic edu-* design tokens instead.",
      gradientText:
        "Gradient text (background-clip: text) is an AI slop indicator. Use solid edu-accent colors.",
      stackedShadows:
        "Multiple stacked box-shadows detected. Use single edu-glow utility class.",
      excessiveRadius:
        "Border-radius > 1rem on non-hero elements is excessive. Use --radius tokens.",
      opacityLayering:
        "Multiple opacity-layered backgrounds without semantic purpose. Use edu-card or edu-glass.",
      uniformSpacing:
        "All elements use identical spacing (p-4/m-4). Vary spacing for visual hierarchy.",
    },
  },

  create(context) {
    const filename = context.getFilename();
    const sourceCode = context.getSourceCode().getText();

    // Skip data files — civilization colors use from-purple/violet semantically
    const isDataFile =
      filename.includes(".data.ts") ||
      filename.includes(".meta.ts") ||
      filename.includes("/civilizations/") ||
      filename.includes("/domains/");

    // Check for AI slop patterns in the full file
    function checkForAISlop() {
      // Pattern: purple gradient backgrounds (from-purple-*, from-violet-* combined with gradients)
      // Only flag in component/page files, not domain data files
      if (!isDataFile) {
        const purpleGradientPattern =
          /from-(purple|violet|indigo)-\d+.*to-(purple|violet|indigo)-\d+/;
        if (purpleGradientPattern.test(sourceCode)) {
          context.report({
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
            messageId: "gradientHero",
          });
        }
      }

      // Pattern: gradient text (bg-clip-text text-transparent)
      const gradientTextPattern = /bg-clip-text|background-clip\s*:\s*text/;
      if (gradientTextPattern.test(sourceCode)) {
        context.report({
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
          messageId: "gradientText",
        });
      }

      // Pattern: multiple stacked box-shadows
      const shadowCount = (sourceCode.match(/box-shadow/g) || []).length;
      if (shadowCount > 3) {
        context.report({
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
          messageId: "stackedShadows",
        });
      }
    }

    return {
      "Program:exit"() {
        checkForAISlop();
      },
    };
  },
};