const path = require('path');
const { readFileSync } = require('fs');
const { runInNewContext } = require('vm');

function loadPlugin(file, window) {
  const scriptPath = require.resolve(file);

  // Based on: https://github.com/joyent/node/blob/v0.10.33/src/node.js#L516
  const script = `(function(globalThis, { document, DocumentFragment, NodeFilter, Element, HTMLElement, Text, Node, getComputedStyle }, requestIdleCallback) {
    ${readFileSync(scriptPath)}
  });`;

  const fn = runInNewContext(script);
  const requestIdleCallback = (callback) => callback({
    didTimeout: false,
    timeRemaining: () => 1e5
  });
  fn(window, window, requestIdleCallback);
  window.pangu.visibilityDetector.isElementVisuallyHidden = () => false;
  return window.pangu;
}

const panguPackageDir = path.dirname(require.resolve('pangu/package.json'));
const environment = import('happy-dom').then(({ Window }) => {
  const window = new Window();
  return {
    document: window.document,
    pangu: loadPlugin(path.join(panguPackageDir, 'dist/browser/pangu.umd.js'), window)
  };
});

module.exports = async function(content) {
  const { document, pangu } = await environment;
  document.body.innerHTML = content;
  pangu.spacingPage();
  return document.body.innerHTML;
};
