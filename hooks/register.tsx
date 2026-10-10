import { update } from 'claude-code'
import type { FsEntry, Hook, Register, RenderChildren } from 'claude-code'
import { BY_EXTENSION, BY_NAME, ICONS } from './icons'

// the engine interface every hook receives as $
type Engine = Parameters<Hook<'ui.focus'>>[0]

const PANE = 'pulse'
const MARK = '✻'
// the real Claude starburst, near-white on transparent, 48px, embedded as base64
const MARK_PNG =
  'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAmVSURBVGhD1Zl/bJ5VFce7OSyggwDq2ILAnBLZxDBB45hKwqYQJ3ERQbJMjDEkoiZzzswfUydGjeIfOBUEJwamGCGGDScaB6xzuOiWAWF2TjrG2qXd73br+rtdWz+fu3PfvO/abm33MrNvcvI8z73nnvM9555zn+dtK0aLvr6+yrg9s3Dw4MHzDh8+/PfW1ta6zs7ODfv37/9oTA0LLS0t747b04/+/v5xBPAY134C8NLf1NTUSkAXhsqQaG5uvgi9tT09Pf0EfV8Mn14cOnToPd3d3ZLuJ5D+AwcOpCC4LgqVIQHppeoSSFrD+o/E1OkDRCfhuEMSBqB0dHSY0R1wGhdqA8DcGNb+h5JLa0xCY2PjTTF9egGRDb29vYUAFBra6ydDZQCYO491jUeOHOmnjNyxnj179kyO6dMLM2cd5zJSoq7/GSoDgO6lkO6SvL2Dbv2JTjHmb2W37Jd13F8fw+XDvn37fm8dQyoFQFD9lgfXmaFSAvSvlrxBd3V1uW5DTA3A3r17P3/06NG0qwKbO+vr6y+K6fKArEyEUIslkXdBh4w/ESolgPCsCDDp8fxQTJUA8vPtD+2aHEVgd2GoDA/btm0bj6OZNOsVMTQAGP+6xnViAJxQOu6F5LRQKYCx28yqerHmizFVALt0U1tbWx/viYJNAzYgnmeF2slBZi+EzHM6ol57IfXQrl27zonpAmpqaipxsiOfLDoVZOuPoVIAc19wTkLt7e2W0gdiKoHMX4WvVucyea+WG/bqWXp2qJ4cLLg9OzOrgiBe2L1799RQKQAncy0JdXWqvk3KdXqoJKD3fe14/HLfygn0lpiywc9H/xUPgkxesWc8orkf2fuCBe/XWCalUbcfYs0E96lQK4CxZz1W1VOixlfHdALPjzguIe63xHACPlYbnGv1l0VQVotDbfjAUSWkqjSQj0qNU5/puCQzPw7VBHSnR9aTrmsic+8LFQNY41qDYPzRGLbu0864Lou+BAl8PNRGDgy/ke1ebuYlrlEllxSEn965c+floW4Nr3BcHUm4IwT2t5g2gH8bVOh8zTFK8hPaz4Fn8gbK2MtySItPBWT7dsg2RuYK4jPj+7m/RT0cTyLgjnysWn7R3GkXmN/jLkVpziDgCZw2zTk52a4nENJpU7uuLCATUyC21uxJUIeKJ0aU1L2hV3KsxufGKoI9h7Fm9Xk+zM5MJIj1uW8yeYMWNPjnkuNygwx/ley05+8gneeSYnydpxT1v9WsOu8pwrWFsQ96Nbtc9yHr4m2c9BTvBcGtCHevDcjSNHbh2SCdHCsR1B7u6zwqM7G4/y3SaoYNOL83isWACPTlhoaGc8PVawuIfZmabsm9YRAGJGHvMzFJ574YSjy1fNtSOjeE+QHATyWHwGR8fBgfC/B9H8m4hTyeFSojB0TfCbln3I3cG4MRNIjBxrN4EtG0vwmziSxE3wXR+QR3L7IGG7VItztVDMa+EstGDxwtwmFH7o2RSOxQH9fFPC8hq6sla6lpT3hQeII55m65y44J1hz7DcLNJUR3K0o3kMlraMC3Q2oC9+PRe11SOgHY/sshsiZOmhGJO2fji3jjJ6IGJ2nnHBfRK81wW8+p9z2GxlVUV1e/HiOvquDLJuq4F+MtyF7ud3B9AalCVmH4EcQa/C7XO9GfA/mptbW1kxl7crAmHY5I2FK0H0S8M3ogvJ2EPoF8C7nRxEbejgHdsRj4RVo1CtjIkflOjsFms1dM7EQiaQPWhsljbRNJWA/RewhmLtcpuDhpBaQgWHgni36K0V+T9cdx8BTX53jexHUrz69wrUcOcN+IHOG2g2u3RHKdMjYo2ePFQNHvRP5KVhdRKtfCY0xQKj/MhL8LcHw+mbnAT2KIXMLzZcilvrF5XmkJFBMdSgwa6UFe5Hk18juCX478intlOXP3Iz/gfiFyB35uxv7Murq6C4JWeeBvVrL4E3aw2V2QHA5PKOpAtp115KYUlpRSDE8lk6Ow2/UkcMCn/YiBkTdAegkkmnTCzqSahtjRwUgXiyXH2hreAbO43kV2VxJ8epOL3FsmJK8xaEUfnkz4+XhQGTlwdAfEt+sMAsmZ2cHoz2jmp302IAkwVkI+i/qsfSZMWqZnE9h01t3FukeR/0KYWI7tho2uPe0K7I78NwMGZkH8HzlDZC4Zw3Et99fTC5/GUZelgYMOpFGngwVgYIIgnuf3xcXhogCmxjJ3pcnCxoMQf5FrN2NtyDJ7L1RPDhxOZdFjbp9ntM699+UC2eWbN28+l164zjH0UnZZs5Dd2Gowlky8YwrkHVesb67b+aK9MtwNCZIzhSAKP6aGBSL/Bg46zZY1aEYFYzU8z1GHzF/M8yF3RUD8AXpksqSjLx6GeJ2EDcCA0NnI+A7rOT4Z9mPnuuS0HDAjZDP9Ps7ZM7NR38v8+5F6S5cuHUsg/zKTkmXuVXbkLPRvdsxyg/RsnudrKweAzWrGriGoTY67lvF2Gnv0zZmBk8/ycmmRgMRz4+BgC88ln75k8ufOqcOaPgjMiPFvO26ZGYBjXLf5rE3B9WGGx5Cop3w2OQo78Rn1RwUITLBMzIjZcnvJUh8Z+2FVVVXJH5nQnWeQuZlxXPhTCGvTj317AqLvdYz5Gy0Z9S3HWJN+W+PzAZ89baKHvuT4iAFZ37LJuoZ43oizlNViQP4q5joQVSX5l5hKwMbzcV73FDcehP8Q+ulrk507RJBvco7AvmnC9GtisLEkLRopIDyNrZ7Hds6wxmO4AJyPx3GNjswYu0PL7H5zTFdICOctzqHbWPz6V4+ADkreIATltiqmLb3bKNVjWwqwU/K3qLIAo6s0nkuNE+f4vviQ5K1ndP0PTslXpaXnessolxLBzItpP0+uYGc3pAmAje/E1KkjNydGk3FK4u6YKgCdBc5Fw26M4RKg8yd13AV3g11swlbhhcbOjyNBy9TB19oYPjWQ6TmSMvOC7D0ZUyXA4QqPz+iBP8dwCQhgIqQb3aWiUlrJpaRk6YuPWdLxOHpQu5dBvEmHAsNV/pk9pksAoZcsLYPAeeFH+/GglObmU8ljmHV9yKSYLi/IajrmBJnblF9kx8NjGN02dJIu9z+KqUFB1n+pnsdtfKZcG1PlBYYX46AHYi81NDSkY28wQHi2ZZabk+cFMTUo2KVKdnYDTe9xu8XSiqnyA+PvqK6uPuFfjgn07iCeeoA1J/3xgfpY5G1+gsTQ/w8Qvr84AHckps4McBReTT2nv0xREs2c6W+NqTMHNPJs2uUejt1TP/6GREXF/wAN+aB6OCBrzAAAAABJRU5ErkJggg=='
const SKIP = new Set(['.git', 'node_modules', '.obsidian', '__pycache__'])
const EDIT_TOOLS = ['Edit', 'Write', 'MultiEdit', 'NotebookEdit']

// Windows paths compare case-blind and with either slash
const norm = (path: string) => path.replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase()
const join = (dir: string, name: string) => `${dir.replace(/[\\/]+$/, '')}/${name}`

const byFoldersFirst = (a: FsEntry, b: FsEntry) =>
  a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === 'dir' ? -1 : 1

// the Claude mark as a drawing; while a turn runs it fades in and out smoothly
const markSvg = (isPulsing: boolean) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="14" height="14" viewBox="0 0 48 48">
  <g>${
    isPulsing
      ? '<animate attributeName="opacity" values="1;0.25;1" dur="1.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>'
      : ''
  }
    <image width="48" height="48" href="data:image/png;base64,${MARK_PNG}" xlink:href="data:image/png;base64,${MARK_PNG}"/>
  </g>
</svg>`

// each file type's Material Icon Theme icon (drawings in icons.ts), a plain page for any other
const iconSvg = (entry: FsEntry) => {
  const name = entry.name.toLowerCase()
  const ext = name.includes('.') ? name.split('.').pop()! : ''
  const kind = entry.kind === 'dir' ? 'folder' : (BY_NAME[name] ?? BY_EXTENSION[ext] ?? 'file')

  return ICONS[kind] ?? ICONS['file']!
}

// one click can arrive as both a focus and a press, in either order; the row acts on
// whichever comes first and skips the other, so the two don't cancel each other out.
// Two presses in a row both act, however quick
const DEDUPE_MS = 300
type Via = 'focus' | 'press'
let lastAct = { element: '', at: 0, via: 'press' as Via }
const actOnce = (via: Via, element: string, act: () => Promise<void>) => {
  const isTwin = lastAct.element === element && lastAct.via !== via && Date.now() - lastAct.at < DEDUPE_MS
  // a skipped twin clears the record, so the next signal always acts
  lastAct = isTwin ? { element: '', at: 0, via } : { element, at: Date.now(), via }
  if (!isTwin) void act()
}

// flips the folder against what is stored now, not what a drawing saw
const toggle = async ($: Engine, key: string) => {
  await update($, { plugin: 'pulse', key: 'expanded' } as const, (list = []) =>
    list.includes(key) ? list.filter(one => one !== key) : [...list, key],
  )
}

// the session's own folder starts open, so its stored flag is the other way round
const toggleRoot = async ($: Engine) => {
  await update($, { plugin: 'pulse', key: 'isRootClosed' } as const, (isClosed = false) => !isClosed)
}

// Explorer opens a file in its default app; says so when it can't instead of doing nothing
// (explorer's exit code is 1 even on success, so only a failure to start counts)
const openFile = async ($: Engine, full: string) => {
  const path = full.replace(/\//g, '\\')
  try {
    await $.process.run(['explorer.exe', path])
  } catch (error) {
    $.ui.toast(`Couldn't open ${path}: ${String(error)}`)
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'files', description: 'Show the file tree in the sidebar' })
    void $.ui.open({ id: PANE, title: 'File tree' })

    return next(e)
  })

  on('command.run', { command: 'files' }, async $ => {
    await $.ui.open({ id: PANE, title: 'File tree' })

    return { text: 'File tree opened.' }
  })

  on('turn.start', async ($, e, next) => {
    await $.state.set({ plugin: 'pulse', key: 'isFreshTurn' } as const, true)

    return next(e)
  })

  // the pulse runs from the first edit until the turn ends, then the mark holds still
  on('turn.complete', async ($, e, next) => {
    await $.state.set({ plugin: 'pulse', key: 'isWorking' } as const, false)

    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    const ran = await next(e)
    if (!EDIT_TOOLS.includes(e.tool) || ran.deny !== undefined) return ran
    const input = e as { file_path?: string; notebook_path?: string }
    const path = input.file_path ?? input.notebook_path
    if (path === undefined) return ran
    const { value: isFirst = false } = await $.state.get({ plugin: 'pulse', key: 'isFreshTurn' } as const)
    const { value: marks = [] } = await $.state.get({ plugin: 'pulse', key: 'edited' } as const)
    await $.state.set({ plugin: 'pulse', key: 'isFreshTurn' } as const, false)
    await $.state.set({ plugin: 'pulse', key: 'isWorking' } as const, true)
    await $.state.set({ plugin: 'pulse', key: 'edited' } as const, [
      ...new Set([...(isFirst ? [] : marks), norm(path)]),
    ])

    return ran
  })

  // A click on the pane while it isn't active only focuses the row and raises no press,
  // so a person's focus landing on a row acts as the click; the press that may follow is skipped
  on('ui.focus', { requestId: PANE }, async ($, e, next) => {
    const result = await next(e)
    const element = e.element
    if (e.origin.kind !== 'person' || element === undefined) return result
    if (element === 'root') actOnce('focus', element, () => toggleRoot($))
    else if (element.startsWith('dir:')) actOnce('focus', element, () => toggle($, element.slice(4)))
    else if (element.startsWith('file:')) actOnce('focus', element, () => openFile($, element.slice(5)))

    return result
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    // only the desktop, editor and phone draw pictures; the terminal keeps the text mark
    const Svg = e.surface === 'terminal' ? undefined : $.ui.resolve({ ...e, surface: 'desktop' }).Svg
    const canDraw = Svg !== undefined
    const root = await $.session.cwd()
    const { value: openList = [] } = await $.state.get({ plugin: 'pulse', key: 'expanded' } as const)
    const { value: marks = [] } = await $.state.get({ plugin: 'pulse', key: 'edited' } as const)
    const { value: isWorking = false } = await $.state.get({ plugin: 'pulse', key: 'isWorking' } as const)
    const open = new Set(openList)

    const pressed = (element: string, act: () => Promise<void>) => actOnce('press', element, act)

    const mark = (isMarked: boolean) => {
      if (!isMarked && !canDraw) return <Text>{'  '}</Text>
      // the mark sits in a slot of fixed width, there or not, so it never moves the row beside it
      if (canDraw) {
        return (
          <Box flexDirection="row" width={3} minWidth={3} flexShrink={0}>
            {isMarked ? <Svg source={markSvg(isWorking)} alt="Edited by Claude" width={14} height={14} /> : <Text>{' '}</Text>}
          </Box>
        )
      }

      return <Text color="claude">{MARK} </Text>
    }

    const icon = (entry: FsEntry) =>
      canDraw ? (
        <Box flexDirection="row" flexShrink={0}>
          <Text> </Text>
          <Svg source={iconSvg(entry)} alt={entry.kind === 'dir' ? 'Folder' : 'File'} width={16} height={16} />
        </Box>
      ) : null

    const rows: RenderChildren[] = []
    const walk = async (dir: string, depth: number) => {
      let entries: FsEntry[] = []
      try {
        entries = await $.fs.list(dir)
      } catch {
        return
      }
      for (const entry of entries.filter(one => !SKIP.has(one.name)).sort(byFoldersFirst)) {
        const full = join(dir, entry.name)
        const key = norm(full)
        // the indent is padding and the name the only part allowed to give way, so a long
        // name gets cut short at the edge instead of squeezing its row out of line
        if (entry.kind === 'dir') {
          const isOpen = open.has(key)
          const hasEdits = !isOpen && marks.some(one => one.startsWith(`${key}/`))
          rows.push(
            <Box flexDirection="row" paddingLeft={depth * 2}>
              {mark(hasEdits)}
              <Box flexShrink={1} minWidth={0} overflow="hidden">
                <Button key={`dir:${key}`} plain onPress={() => pressed(`dir:${key}`, () => toggle($, key))}>
                  {`${isOpen ? '▾' : '▸'} ${entry.name}`}
                </Button>
              </Box>
              {icon(entry)}
            </Box>,
          )
          if (isOpen) await walk(full, depth + 1)
        } else {
          rows.push(
            <Box flexDirection="row" paddingLeft={depth * 2}>
              {mark(marks.includes(key))}
              <Box flexShrink={1} minWidth={0} overflow="hidden">
                <Button key={`file:${key}`} plain dimColor onPress={() => pressed(`file:${key}`, () => openFile($, full))}>
                  {`  ${entry.name}`}
                </Button>
              </Box>
              {icon(entry)}
            </Box>,
          )
        }
      }
    }
    const { value: isRootClosed = false } = await $.state.get({ plugin: 'pulse', key: 'isRootClosed' } as const)
    if (!isRootClosed) await walk(root, 1)

    // the session's own folder heads the tree, open until a person closes it
    const rootName = root.replace(/[\\/]+$/, '').split(/[\\/]/).pop() || root
    const rootEntry: FsEntry = { name: rootName, kind: 'dir', size: 0, mtimeMs: 0, isLink: false }

    // throwaway mouse probe, only on the surfaces that run surface modules; drag replaces it
    const Client = e.surface === 'terminal' || e.surface === 'desktop' ? $.ui.resolve({ ...e, surface: e.surface }).Client : undefined

    return (
      <Box flexDirection="column">
        {Client !== undefined && <Client key="mouse-probe" module="./mouse-probe.tsx" />}
        <Box flexDirection="row">
          {mark(isRootClosed && marks.some(one => one.startsWith(`${norm(root)}/`)))}
          <Button key="root" plain onPress={() => pressed('root', () => toggleRoot($))}>
            {`${isRootClosed ? '▸' : '▾'} ${rootName}`}
          </Button>
          {icon(rootEntry)}
        </Box>
        {!isRootClosed && rows.length === 0 && <Text dimColor>{'    This folder is empty.'}</Text>}
        {rows}
      </Box>
    )
  })
}
