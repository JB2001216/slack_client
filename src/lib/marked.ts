/* eslint-disable no-useless-escape */
import marked from 'marked';

for (const ruleName of ['normal', 'gfm', 'breaks', 'pedantic']) {
  marked.InlineLexer.rules[ruleName] = Object.assign(marked.InlineLexer.rules[ruleName], {
    strong: /^\*(?!\*)((?:[^\*\n]*?[^\*])?)\*(?!(\*|[^\s?!.]))|^(?!(\*|[^\s?!.]))\*(?!\*)((?:[^\*\n]*?[^\*])?)\*(?!(\*|[^\s?!.]))/,
    em: /^_(?!_)((?:[^_\n]*?[^_])?)_(?!(_|[^\s?!.]))|^(?!(_|[^\s?!.]))_(?!_)((?:[^_\n]*?[^_])?)_(?!(_|[^\s?!.]))/,
  });
}

export default marked;
