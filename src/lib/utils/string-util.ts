export function escapeHtml(text: string): string {
  return text.replace(/[<>&"'`]/g, (match) => {
    const escape: {[char: string]: string} = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      '\'': '&#39;',
      '`': '&#x60;',
    };
    return escape[match];
  });
}
