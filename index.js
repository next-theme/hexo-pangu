/* global hexo */

'use strict';

const spacing = require('./lib/filter');
const { NodePangu } = require('pangu');

const pangu = new NodePangu();

hexo.extend.filter.register('after_post_render', async data => {
  data.content = await spacing(data.content);
  data.title = pangu.spacingText(data.title);
}, 8);
