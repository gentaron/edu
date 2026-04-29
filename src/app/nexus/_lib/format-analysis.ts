/* ── マークダウン風フォーマット ── */

export function formatAnalysis(text: string): string {
  let result = text
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-edu-accent">$1</strong>')
    .replace(/\n/g, "<br/>")
  // Wrap consecutive <li> in <ul>
  result = result.replace(/((?:<li>.*?<\/li>(?:<br\/>)?)+)/g, "<ul>$1</ul>")
  return result
}
