/* global hexo */

'use strict';

const spacing = require('./lib/filter');
const { pangu } = require('pangu');

hexo.extend.filter.register('after_post_render', data => {
  data.content = spacing(data.content);
  data.title = pangu.spacing(data.title);
}, 8);
