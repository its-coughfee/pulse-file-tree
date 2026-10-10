import type { ClientModule, ClientPointerEvent } from 'claude-code'

// Throwaway: shows the left-button pointer events this region receives, to find out
// whether a surface passes drags through to a mod. Removed once drag is built.

type Seen = { lines: string[]; counts: { down: number; move: number; up: number } }

const KEEP = 6

const MouseProbe: ClientModule<null, Seen> = (_props, surface) => {
  const { Box, Text } = surface.elements
  const seen: Seen = surface.state ?? { lines: [], counts: { down: 0, move: 0, up: 0 } }

  if (surface.state === undefined) {
    surface.setState(seen)
    surface.onPointer((event: ClientPointerEvent) => {
      if (event.type !== 'down' && event.type !== 'move' && event.type !== 'up') return
      // a hover move carries no button; only a held left button counts
      if (event.button !== 'left') return
      const now = surface.state ?? seen
      surface.setState({
        lines: [...now.lines, `${event.type} at ${event.x},${event.y}`].slice(-KEEP),
        counts: { ...now.counts, [event.type]: now.counts[event.type] + 1 },
      })
    })
  }

  const { down, move, up } = seen.counts

  return (
    <Box flexDirection="column" borderStyle="round" paddingX={1} height={KEEP + 4}>
      <Text bold>Mouse probe: press, drag and release in here</Text>
      <Text>{`down ${down} · move ${move} · up ${up}`}</Text>
      {seen.lines.length === 0 ? <Text dimColor>Nothing received yet.</Text> : seen.lines.map(line => <Text dimColor>{line}</Text>)}
    </Box>
  )
}

export default MouseProbe
