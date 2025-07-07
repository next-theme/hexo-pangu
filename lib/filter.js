const { readFileSync } = require('fs');
const { runInNewContext } = require('vm');
const { JSDOM } = require('jsdom');
const dom = new JSDOM();
const { window } = dom;
const { document } = window;

function loadPlugin(file) {
  const path = require.resolve(file);

  // Based on: https://github.com/joyent/node/blob/v0.10.33/src/node.js#L516
  const script = `(function(globalThis, { document, DocumentFragment, NodeFilter, Element, HTMLElement, Text, Node, getComputedStyle }, requestIdleCallback) {
    ${readFileSync(path)}
  });`;

  const fn = runInNewContext(script);
  const requestIdleCallback = (callback) => callback({
    didTimeout: false,
    timeRemaining: () => 1e5
  });
  fn(window, window, requestIdleCallback);
  return window.pangu;
}

const pangu = loadPlugin('pangu/browser');

module.exports = function(content) {
  document.body.innerHTML = content;
  pangu.spacingPage();
  return document.body.innerHTML;
};
