const { readFileSync } = require('fs');
const { runInThisContext } = require('vm');
const { JSDOM } = require('jsdom');
const dom = new JSDOM();
const { window } = dom;
const { document } = window;

function loadPlugin(file) {
  const path = require.resolve(file);

  // Based on: https://github.com/joyent/node/blob/v0.10.33/src/node.js#L516
  const fakeGlobal = {};

  const script = `(function(globalThis, { document, Node, DocumentFragment, XPathResult, Text, Element }) {
    ${readFileSync(path)}
  });`;

  const fn = runInThisContext(script, path);
  fn(fakeGlobal, window);
  return fakeGlobal.pangu;
}

const pangu = loadPlugin('pangu/browser');

module.exports = function(content) {
  document.body.innerHTML = content;
  pangu.spacingPageBody();
  return document.body.innerHTML;
};
