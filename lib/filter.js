const { readFileSync } = require('fs');
const { runInNewContext } = require('vm');
const { JSDOM } = require('jsdom');
const dom = new JSDOM();
const { window } = dom;
const { document } = window;

function loadPlugin(file) {
  const path = require.resolve(file);

  // Based on: https://github.com/joyent/node/blob/v0.10.33/src/node.js#L516
  const script = `(function(globalThis, { document, Node, DocumentFragment, XPathResult, Text, Element }) {
    ${readFileSync(path)}
  });`;

  const fn = runInNewContext(script);
  fn(window, window);
  return window.pangu;
}

const pangu = loadPlugin('pangu/browser');

module.exports = function(content) {
  document.body.innerHTML = content;
  pangu.spacingPageBody();
  return document.body.innerHTML;
};
