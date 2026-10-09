import { expect, test } from 'claude-code/testing'

test('the pane draws the folder on the desktop', async ($, on) => {
  on('session.cwd', () => ({ value: 'C:/Users/example/projects/demo' }))
  on('fs.list', () => ({ value: [{ name: 'MAP.md', kind: 'file', size: 1, mtimeMs: 0, isLink: false }, { name: 'LOG', kind: 'dir', size: 0, mtimeMs: 0, isLink: false }] }))
  const ui = await $.ui.mount({
    plugin: 'pulse',
    surface: 'desktop',
    component: 'Pane',
    props: {},
    requestId: 'pulse',
  } as never)
  expect(await ui.find({ type: 'Button', text: /MAP.md/ } as never)).toBeDefined()
  await ui.unmount()
})
