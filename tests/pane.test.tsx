import { expect, test } from 'claude-code/testing'

// what each setting holds before anything is saved; the pane can't draw without them
const DEFAULTS: Record<string, unknown> = {
  expanded: [], edited: [], lastEdited: '', isWorking: false, isRootClosed: false, climbed: 1,
  lastClicked: '', revealed: '', hasSaved: false, savedExpanded: [], savedRootClosed: false, dragging: '', isFreshTurn: false,
}

// the stubs a test sets up outlive it, so each test resets what this one object holds;
// saving writes into it, so a press changes what the next drawing reads
const values: Record<string, unknown> = {}

const mountPane = async ($: any, on: any) => {
  for (const key of Object.keys(values)) delete values[key]
  Object.assign(values, DEFAULTS)
  on('session.cwd', () => ({ value: 'C:/Users/example/projects/demo' }))
  on('fs.list', () => ({ value: [{ name: 'MAP.md', kind: 'file', size: 1, mtimeMs: 0, isLink: false }, { name: 'LOG', kind: 'dir', size: 0, mtimeMs: 0, isLink: false }] }))
  on('fs.exists', () => ({ value: true }))
  on('state.get', (_$: unknown, call: any) => ({ value: values[call?.key] }))
  on('state.set', (_$: unknown, call: any) => {
    values[call?.key] = call?.value
    return { value: { isSet: true } }
  })

  return $.ui.mount({ plugin: 'pulse', surface: 'desktop', component: 'Pane', props: {}, requestId: 'pulse' } as never)
}

const button = (ui: any, text: RegExp) => ui.find({ type: 'Button', text } as never)

// a press starts its work and returns at once, so wait for the saving to finish, then redraw
const settle = async (ui: any) => {
  await new Promise(resolve => setTimeout(resolve, 50))
  await ui.redraw()
}

test('the pane draws the folder on the desktop', async ($, on) => {
  const ui = await mountPane($, on)
  expect(await button(ui, /LOG/)).toBeDefined()
  await ui.unmount()
})

test('one closed parent line sits above the project, with the up button', async ($, on) => {
  const ui = await mountPane($, on)
  expect(await button(ui, /▸ projects/)).toBeDefined()
  expect(await button(ui, /▾ demo/)).toBeDefined()
  expect(await button(ui, /↑ Up/)).toBeDefined()
  expect(await button(ui, /◎ Reveal/)).toBeDefined()
  await ui.unmount()
})

// the closed parent line shows only the project, joined by └─; the project's one folder, LOG,
// is joined by └─ under a blank column. The mark slot sits ahead of both
test('guide ticks run right into each folder arrow', async ($, on) => {
  const ui = await mountPane($, on)
  expect((await ui.find({ text: /▸ projects/ } as never))?.text).toMatch(/▸ projects\s+└─▾ demo\s+└─▸ LOG/)
  await ui.unmount()
})

test('Collapse all closes the project folder', async ($, on) => {
  const ui = await mountPane($, on)
  await ui.press({ key: 'collapse-all' } as never)
  await ui.redraw()
  expect(values.isRootClosed).toBe(true)
  expect(values.expanded).toEqual([])
  await ui.unmount()
})

// The test kit holds its own copy of settings between presses, so a second press reads a
// stale copy; Expand restoring the folders is checked in the live pane instead
test('Collapse saves what was open so Expand can restore it', async ($, on) => {
  const ui = await mountPane($, on)
  await ui.press({ key: 'collapse-all' } as never)
  await settle(ui)
  expect(values.hasSaved).toBe(true)
  expect(values.savedRootClosed).toBe(false)
  expect(values.isRootClosed).toBe(true)
  await ui.unmount()
})

test('Up adds a parent line, and Return to root folds back to one', async ($, on) => {
  const ui = await mountPane($, on)
  await ui.press({ key: 'up' } as never)
  expect(values.climbed).toBe(2)
  await ui.press({ key: 'return-root' } as never)
  expect(values.climbed).toBe(1)
  await ui.unmount()
})
