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

export function toCamelCase(text: string) {
  text = text.charAt(0).toLowerCase() + text.slice(1);
  return text.replace(/[-_](.)/g, (match, group1) => {
    return group1.toUpperCase();
  });
}

export function toSnakeCase(text: string) {
  var camel = toCamelCase(text);
  return camel.replace(/[A-Z]/g, function(s) {
    return '_' + s.charAt(0).toLowerCase();
  });
}
