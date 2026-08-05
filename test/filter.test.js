const assert = require('node:assert/strict');
const test = require('node:test');
const spacing = require('../lib/filter');

test('spaces rendered HTML while preserving ignored content', async () => {
  const cases = new Map([
    [
      '<p>中文<strong>English</strong>测试</p>',
      '<p>中文<strong> English</strong> 测试</p>'
    ],
    [
      '<p>中文<a href="#">English</a>测试</p>',
      '<p>中文 <a href="#">English</a> 测试</p>'
    ],
    [
      '<p>中文<code>English测试</code>English</p>',
      '<p>中文<code>English测试</code> English</p>'
    ],
    [
      '<pre>中文English</pre><p>中文English</p>',
      '<pre>中文English</pre><p>中文 English</p>'
    ],
    [
      '<p class="no-pangu-spacing">中文English</p>',
      '<p class="no-pangu-spacing">中文English</p>'
    ],
    [
      '<p>中文<!-- comment -->English</p>',
      '<p>中文<!-- comment --> English</p>'
    ]
  ]);

  for (const [input, expected] of cases) {
    assert.equal(await spacing(input), expected);
  }
});

test('keeps concurrent filter calls independent', async () => {
  const [first, second] = await Promise.all([
    spacing('<p>中文English</p>'),
    spacing('<p>测试123</p>')
  ]);

  assert.equal(first, '<p>中文 English</p>');
  assert.equal(second, '<p>测试 123</p>');
});

test('registers an asynchronous Hexo filter', async () => {
  let filter;
  global.hexo = {
    extend: {
      filter: {
        register(type, callback, priority) {
          assert.equal(type, 'after_post_render');
          assert.equal(priority, 8);
          filter = callback;
        }
      }
    }
  };

  try {
    require('../index');
    const data = {
      content: '<p>中文English</p>',
      title: '中文Title123'
    };

    await filter(data);
    assert.equal(data.content, '<p>中文 English</p>');
    assert.equal(data.title, '中文 Title123');
  } finally {
    delete global.hexo;
  }
});
