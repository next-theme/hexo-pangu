const { JSDOM } = require('jsdom');
const dom = new JSDOM();
const { window } = dom;
const { document, Node, DocumentFragment, XPathResult } = window;
global.document = document;
global.Node = Node;
global.DocumentFragment = DocumentFragment;
global.XPathResult = XPathResult;
const pangu = require('pangu/src/browser/pangu');

module.exports = function(content) {
  document.body.innerHTML = content;
  pangu.spacingPageBody();
  return document.body.innerHTML;
}
