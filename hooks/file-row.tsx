import type { ClientModule, ClientPointerEvent } from 'claude-code'

// One file's name in the tree, as a region that hears the pointer. A press and release
// in place opens the file; a press that moves becomes a drag. Each report names the
// pane line under the pointer (this row's line plus how far the pointer went) and the
// pane column, so the hooks module can tell which row or drop icon it is over.

type Props = { path: string; label: string; line: number; left: number }
type Held = { x: number; y: number; isDragging: boolean }
// one box for the instance's life: the listener is set once and reads the latest through it
type Live = { latest: Props; held: Held | undefined }
type Local = { live: Live }

const FileRow: ClientModule<Props, Local> = (props, surface) => {
  const { Box, Text } = surface.elements
  const live = surface.state?.live ?? { latest: props, held: undefined }
  live.latest = props
  const redraw = () => surface.setState({ live })

  if (surface.state === undefined) {
    redraw()
    surface.onPointer((event: ClientPointerEvent) => {
      if (event.button !== 'left') return
      const { path, line, left } = live.latest
      const where = { path, line: line + event.y, x: left + event.x }
      if (event.type === 'down') {
        live.held = { x: event.x, y: event.y, isDragging: false }
      } else if (event.type === 'move' && live.held !== undefined) {
        // a wobble inside the row is still a click; leaving the row or sliding two cells is a drag
        const hasLeft = event.y !== live.held.y || Math.abs(event.x - live.held.x) >= 2
        if (!live.held.isDragging && !hasLeft) return
        if (!live.held.isDragging) {
          live.held.isDragging = true
          redraw()
        }
        surface.post({ kind: 'drag', ...where })
      } else if (event.type === 'up' && live.held !== undefined) {
        surface.post(live.held.isDragging ? { kind: 'drop', ...where } : { kind: 'open', path })
        live.held = undefined
        redraw()
      }
    })
  }

  const isDragging = live.held?.isDragging === true

  return (
    <Box flexDirection="row" overflow="hidden">
      <Text dimColor={!isDragging} inverse={isDragging} wrap="truncate-end">
        {`  ${props.label}`}
      </Text>
    </Box>
  )
}

export default FileRow
