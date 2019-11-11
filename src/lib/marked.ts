/* eslint-disable no-useless-escape */
import marked from 'marked';

for (const ruleName of ['normal', 'gfm', 'breaks', 'pedantic']) {
  marked.InlineLexer.rules[ruleName] = Object.assign(marked.InlineLexer.rules[ruleName], {
    strong: /^\*(?!\*)((?:[^\*\n]*?[^\*])?)\*(?!(\*|[^\s?!.]))|^(?!(\*|[^\s?!.]))\*(?!\*)((?:[^\*\n]*?[^\*])?)\*(?!(\*|[^\s?!.]))/,
    em: /^_(?!_)((?:[^_\n]*?[^_])?)_(?!(_|[^\s?!.]))|^(?!(_|[^\s?!.]))_(?!_)((?:[^_\n]*?[^_])?)_(?!(_|[^\s?!.]))/,
  });
}

// Open link in a os browser
const originalLinkRederer = marked.Renderer.prototype.link;
marked.Renderer.prototype.link = function(href, title, text) {
  const out = originalLinkRederer.call(this, href, title, text);
  if (out && !!out.match(/^<a href=".*<\/a>$/)) {
    return out.replace(/^<a href="/, '<a target="_blank" href="');
  }
  return out;
};

export default marked;
