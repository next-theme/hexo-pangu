/* global hexo */

'use strict';

const { JSDOM } = require('jsdom');
const dom = new JSDOM();
const { window } = dom;
const { document, Node, DocumentFragment, XPathResult } = window;
global.document = document;
global.Node = Node;
global.DocumentFragment = DocumentFragment;
global.XPathResult = XPathResult;
const pangu = require('pangu/src/browser/pangu');

hexo.extend.filter.register('after_post_render', data => {
  document.body.innerHTML = data.content;
  pangu.spacingPageBody();
  data.content = document.body.innerHTML;
  data.title = pangu.spacing(data.title);
}, 8);
