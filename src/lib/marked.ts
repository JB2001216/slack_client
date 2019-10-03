/* eslint-disable no-useless-escape */
import marked from 'marked';

for (const ruleName of ['normal', 'gfm', 'breaks', 'pedantic']) {
  marked.InlineLexer.rules[ruleName] = Object.assign(marked.InlineLexer.rules[ruleName], {
    strong: /^\*([^\s*<\[])\*(?!\*)|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)|^\*([^\s<"][\s\S]*?[^\s\*])\*(?!\*|[^\spunctuation])/,
    em: /^_([^\s_])_(?!_)|^_([^\s<][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_<][\s\S]*?[^\s])_(?!_|[^\spunctuation])/,
  });
}

export default marked;