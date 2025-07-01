const { readFileSync } = require('fs');
const { dirname } = require('path');
const { runInThisContext } = require('vm');
const Module = require('module');
const { JSDOM } = require('jsdom');
const dom = new JSDOM();
const { window } = dom;
const { document } = window;

function loadPlugin(file) {
  const path = require.resolve(file);

  // Based on: https://github.com/joyent/node/blob/v0.10.33/src/node.js#L516
  const module = new Module(path);
  module.filename = path;
  module.paths = Module._nodeModulePaths(path);

  const script = `(function(exports, module, { document, Node, DocumentFragment, XPathResult, Text, Element }) {
    ${readFileSync(path)}
  });`;

  const fn = runInThisContext(script, path);
  fn(module.exports, module, window);

  return module.exports;
}

const pangu = loadPlugin('pangu/browser');

module.exports = function(content) {
  document.body.innerHTML = content;
  pangu.spacingPageBody();
  return document.body.innerHTML;
};
