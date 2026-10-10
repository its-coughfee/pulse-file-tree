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

const setPathOpen = async ($: Engine, isOpen: boolean) => {
  await $.state.set({ plugin: 'pulse', key: 'isPathOpen' } as const, isOpen)
}

// closes every folder the person opened; the project folder and the path down to it stay open
const collapseAll = async ($: Engine) => {
  await $.state.set({ plugin: 'pulse', key: 'expanded' } as const, [])
  await $.state.set({ plugin: 'pulse', key: 'isRootClosed' } as const, false)
}

// the folders from the drive down to the session's folder, each as a full path
const ancestorsOf = (root: string) => {
  const parts = root.replace(/[\\/]+$/, '').split(/[\\/]/)
  const drive = parts[0] === '' ? '/' : `${parts[0]}/`
  const chain = [drive]
  for (const part of parts.slice(1).filter(Boolean)) chain.push(join(chain[chain.length - 1]!, part))

  return chain
}

// the parent folder, shortened to the drive and its own name: C:\…\mods
const shortParent = (root: string) => {
  const parts = root.replace(/[\\/]+$/, '').split(/[\\/]/)
  const parents = parts.slice(0, -1)
  if (parents.length <= 1) return `${parents[0] ?? ''}\\`

  return parents.length === 2 ? parents.join('\\') : `${parents[0]}\\…\\${parents[parents.length - 1]}`
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

// The pane draws one line per row, so a pointer's line says what it is over. The lines
// above the tree are fixed: the buttons, then the drop icons, then the path line when shown
const DROP_LINE = 1
// the drop row reads "[ Delete ]  [ Add to prompt ]": columns before this are Delete
const DELETE_END = 11
const DROP_ICONS = '[ Delete ]  [ Add to prompt ]'
// how long a dragged file rests on a closed folder before it opens
const HOVER_OPEN_MS = 700

// a folder a dragged file can be dropped into, by the line it was last drawn on
type Target = { full: string; key: string; isOpen: boolean; isProject: boolean }
let targets: (Target | undefined)[] = []
let hovered = ''

type Dropped = { kind: 'drag' | 'drop' | 'open'; path: string; line: number; x: number }
const isDropped = (data: unknown): data is Dropped => {
  const one = data as Partial<Dropped> | null
  return (
    typeof one === 'object' && one !== null && typeof one.path === 'string' &&
    (one.kind === 'open' || ((one.kind === 'drag' || one.kind === 'drop') && typeof one.line === 'number' && typeof one.x === 'number'))
  )
}

const windows = (path: string) => path.replace(/\//g, '\\')
const nameOf = (path: string) => path.replace(/[\\/]+$/, '').split(/[\\/]/).pop() ?? path
const parentOf = (path: string) => path.replace(/[\\/]+$/, '').replace(/[\\/][^\\/]*$/, '')

// PowerShell does the moving and recycling; the paths go in as variables, never as code
const powershell = async ($: Engine, script: string, env: Record<string, string>, failed: string) => {
  try {
    const ran = await $.process.run(['powershell.exe', '-NoProfile', '-NonInteractive', '-Command', script], { env })
    if (ran.exitCode !== 0) $.ui.toast(`${failed}: ${ran.stderr.trim() || `exit ${ran.exitCode}`}`)
  } catch (error) {
    $.ui.toast(`${failed}: ${String(error)}`)
  }
}

const moveInto = async ($: Engine, file: string, folder: string) => {
  if (norm(parentOf(file)) === norm(folder)) return
  await powershell(
    $,
    'Move-Item -LiteralPath $env:PULSE_FROM -Destination $env:PULSE_TO -ErrorAction Stop',
    { PULSE_FROM: windows(file), PULSE_TO: windows(folder) },
    `Couldn't move ${nameOf(file)}`,
  )
}

// the Recycle Bin is the undo, so there is no confirmation
const recycle = async ($: Engine, file: string) => {
  await powershell(
    $,
    "Add-Type -AssemblyName Microsoft.VisualBasic; [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($env:PULSE_FROM, 'OnlyErrorDialogs', 'SendToRecycleBin')",
    { PULSE_FROM: windows(file) },
    `Couldn't delete ${nameOf(file)}`,
  )
}

const addToPrompt = async ($: Engine, file: string) => {
  await $.prompt.fill({ text: `${windows(file)} `, mode: 'insert' })
}

const setDragging = async ($: Engine, path: string) => {
  await $.state.set({ plugin: 'pulse', key: 'dragging' } as const, path)
}

// a dragged file resting on a closed folder opens it, unless the pointer has moved on
const hoverOpen = async ($: Engine, target: Target) => {
  if (hovered === target.key) return
  hovered = target.key
  await $.clock.sleep(HOVER_OPEN_MS)
  const { value: dragging = '' } = await $.state.get({ plugin: 'pulse', key: 'dragging' } as const)
  if (hovered !== target.key || dragging === '') return
  if (target.isProject) await $.state.set({ plugin: 'pulse', key: 'isRootClosed' } as const, false)
  else await update($, { plugin: 'pulse', key: 'expanded' } as const, (list = []) => (list.includes(target.key) ? list : [...list, target.key]))
}

const onDropped = async ($: Engine, data: Dropped) => {
  if (data.kind === 'open') {
    await openFile($, data.path)
    return
  }
  const target = targets[data.line]
  if (data.kind === 'drag') {
    const { value: dragging = '' } = await $.state.get({ plugin: 'pulse', key: 'dragging' } as const)
    if (dragging !== data.path) await setDragging($, data.path)
    if (target !== undefined && !target.isOpen) void hoverOpen($, target)
    else hovered = ''
    return
  }
  hovered = ''
  await setDragging($, '')
  if (data.line === DROP_LINE) await (data.x < DELETE_END ? recycle($, data.path) : addToPrompt($, data.path))
  else if (target !== undefined) await moveInto($, data.path, target.full)
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
    await $.state.set({ plugin: 'pulse', key: 'lastEdited' } as const, norm(path))
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
    else if (element === 'path') actOnce('focus', element, () => setPathOpen($, true))
    else if (element === 'return-root') actOnce('focus', element, () => setPathOpen($, false))
    else if (element === 'collapse-all') actOnce('focus', element, () => collapseAll($))
    else if (element.startsWith('dir:')) actOnce('focus', element, () => toggle($, element.slice(4)))
    else if (element.startsWith('file:')) actOnce('focus', element, () => openFile($, element.slice(5)))

    return result
  })

  // a file row's pointer region reports clicks, drags and drops
  on('ui.message', { requestId: PANE }, async ($, e, next) => {
    const result = await next(e)
    if (e.module.endsWith('file-row.tsx') && isDropped(e.data)) await onDropped($, e.data)

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

    const { value: lastEdited = '' } = await $.state.get({ plugin: 'pulse', key: 'lastEdited' } as const)
    // only the latest edit pulses, and only while the turn runs; a closed folder pulses for it
    const isLatestIn = (key: string) => lastEdited !== '' && (lastEdited === key || lastEdited.startsWith(`${key}/`))

    const mark = (isMarked: boolean, isLatest = false) => {
      if (!isMarked && !canDraw) return <Text>{'  '}</Text>
      // the mark sits in a slot of fixed width, there or not, so it never moves the row beside it
      if (canDraw) {
        return (
          <Box flexDirection="row" width={3} minWidth={3} flexShrink={0}>
            {isMarked ? <Svg source={markSvg(isWorking && isLatest)} alt="Edited by Claude" width={14} height={14} /> : <Text>{' '}</Text>}
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

    const { value: isRootClosed = false } = await $.state.get({ plugin: 'pulse', key: 'isRootClosed' } as const)
    const { value: isPathOpen = false } = await $.state.get({ plugin: 'pulse', key: 'isPathOpen' } as const)

    // the session's own folder heads its part of the tree, open until a person closes it
    const rootName = root.replace(/[\\/]+$/, '').split(/[\\/]/).pop() || root
    const rootEntry: FsEntry = { name: rootName, kind: 'dir', size: 0, mtimeMs: 0, isLink: false }

    const { value: dragging = '' } = await $.state.get({ plugin: 'pulse', key: 'dragging' } as const)
    // file rows hear the pointer only where surface modules run; elsewhere they stay buttons
    const Client = e.surface === 'terminal' || e.surface === 'desktop' ? $.ui.resolve({ ...e, surface: e.surface }).Client : undefined
    const ancestors = ancestorsOf(root)
    const isPathLineShown = !isPathOpen && ancestors.length > 1
    // the tree's first row sits under the buttons, the drop row and the path line
    const firstLine = DROP_LINE + 1 + (isPathLineShown ? 1 : 0)
    const markWidth = canDraw ? 3 : 2

    const rows: RenderChildren[] = []
    const lineTargets: (Target | undefined)[] = []
    const add = (row: RenderChildren, target?: Target) => {
      rows.push(row)
      lineTargets[firstLine + rows.length - 1] = target
    }
    const projectRow = async (depth: number) => {
      add(
        <Box flexDirection="row" paddingLeft={depth * 2}>
          {mark(isRootClosed && marks.some(one => one.startsWith(`${norm(root)}/`)), isRootClosed && isLatestIn(norm(root)))}
          <Button key="root" plain onPress={() => pressed('root', () => toggleRoot($))}>
            {`${isRootClosed ? '▸' : '▾'} ${rootName}`}
          </Button>
          {icon(rootEntry)}
        </Box>,
        { full: root, key: norm(root), isOpen: !isRootClosed, isProject: true },
      )
      if (isRootClosed) return
      const before = rows.length
      await walk(root, depth + 1)
      if (rows.length === before) add(<Text dimColor wrap="truncate-end">{`${' '.repeat(depth * 2)}    This folder is empty.`}</Text>)
    }

    // a folder on the path above the project: always open, holding the next one down
    const ancestorRow = (full: string, name: string, depth: number) => {
      add(
        <Box flexDirection="row" paddingLeft={depth * 2}>
          {mark(false)}
          <Text wrap="truncate-end">{`▾ ${name}`}</Text>
          {icon({ name, kind: 'dir', size: 0, mtimeMs: 0, isLink: false })}
        </Box>,
        { full, key: norm(full), isOpen: true, isProject: false },
      )
    }

    // `chain` is the rest of the path below `dir`, down to the project; where it is given,
    // the next folder on it is drawn open in its place among its siblings
    const walk = async (dir: string, depth: number, chain: string[] = []) => {
      let entries: FsEntry[] = []
      try {
        entries = await $.fs.list(dir)
      } catch (error) {
        // above the project a refusal is shown, not hidden, so a blocked listing can be seen
        if (chain.length > 0) add(<Text dimColor wrap="truncate-end">{`${' '.repeat(depth * 2)}  Couldn't list ${dir}: ${String(error)}`}</Text>)
        else return
      }
      const next = chain[0]
      const nextKey = next === undefined ? undefined : norm(next)
      let isNextDrawn = false
      const drawNext = async () => {
        isNextDrawn = true
        if (chain.length === 1) await projectRow(depth)
        else {
          ancestorRow(next!, nameOf(next!), depth)
          await walk(next!, depth + 1, chain.slice(1))
        }
      }
      for (const entry of entries.filter(one => !SKIP.has(one.name)).sort(byFoldersFirst)) {
        const full = join(dir, entry.name)
        const key = norm(full)
        if (key === nextKey) {
          await drawNext()
          continue
        }
        // the indent is padding and the name the only part allowed to give way, so a long
        // name gets cut short at the edge instead of squeezing its row out of line
        if (entry.kind === 'dir') {
          const isOpen = open.has(key)
          const hasEdits = !isOpen && marks.some(one => one.startsWith(`${key}/`))
          add(
            <Box flexDirection="row" paddingLeft={depth * 2}>
              {mark(hasEdits, hasEdits && isLatestIn(key))}
              <Box flexShrink={1} minWidth={0} overflow="hidden">
                <Button key={`dir:${key}`} plain onPress={() => pressed(`dir:${key}`, () => toggle($, key))}>
                  {`${isOpen ? '▾' : '▸'} ${entry.name}`}
                </Button>
              </Box>
              {icon(entry)}
            </Box>,
            { full, key, isOpen, isProject: false },
          )
          if (isOpen) await walk(full, depth + 1)
        } else {
          // the line this row lands on, for the pointer region to report against
          const line = firstLine + rows.length
          add(
            <Box flexDirection="row" paddingLeft={depth * 2}>
              {mark(marks.includes(key), key === lastEdited)}
              <Box flexShrink={1} minWidth={0} overflow="hidden">
                {Client !== undefined ? (
                  <Client
                    key={`file:${key}`}
                    module="./file-row.tsx"
                    props={{ path: full, label: entry.name, line, left: depth * 2 + markWidth }}
                  />
                ) : (
                  <Button key={`file:${key}`} plain dimColor onPress={() => pressed(`file:${key}`, () => openFile($, full))}>
                    {`  ${entry.name}`}
                  </Button>
                )}
              </Box>
              {icon(entry)}
            </Box>,
          )
        }
      }
      // a path folder the listing hid (a skipped name, an unreadable parent) still leads down
      if (next !== undefined && !isNextDrawn) await drawNext()
    }

    if (isPathOpen && ancestors.length > 1) {
      ancestorRow(ancestors[0]!, ancestors[0]!.replace(/\/$/, '') || '/', 0)
      await walk(ancestors[0]!, 1, ancestors.slice(1))
    } else {
      await projectRow(0)
    }
    targets = lineTargets

    // every line here is one row tall, so the pointer's line maps onto `targets`
    return (
      <Box flexDirection="column">
        <Box flexDirection="row" gap={2}>
          <Button key="return-root" plain onPress={() => pressed('return-root', () => setPathOpen($, false))}>
            [ Return to root ]
          </Button>
          <Button key="collapse-all" plain onPress={() => pressed('collapse-all', () => collapseAll($))}>
            [ Collapse all ]
          </Button>
        </Box>
        {/* the drop icons' line is always there, blank until a drag, so no row moves */}
        <Text bold={dragging !== ''} wrap="truncate-end">{dragging === '' ? ' ' : DROP_ICONS}</Text>
        {isPathLineShown && (
          <Box flexDirection="row">
            {mark(false)}
            <Button key="path" plain dimColor onPress={() => pressed('path', () => setPathOpen($, true))}>
              {`▸ ${shortParent(root)}`}
            </Button>
          </Box>
        )}
        {rows}
      </Box>
    )
  })
}
