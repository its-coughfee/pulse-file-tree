declare module 'claude-code' {
  interface PluginState {
    'file-tree': {
      // folders the person has expanded, normalised paths
      expanded: string[]
      // files Claude edited in the current (or, until it edits, the last) turn
      edited: string[]
      // true on the first edit of a turn: that edit replaces the old marks
      isFreshTurn: boolean
      // true from Claude's first edit until the turn ends: the mark pulses
      isWorking: boolean
      // bumped when a file type's app icon arrives from Windows, to redraw the pane
      iconTick: number
    }
  }
}

export {}
