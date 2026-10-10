declare module 'claude-code' {
  interface PluginState {
    pulse: {
      // folders the person has expanded, normalised paths
      expanded: string[]
      // files Claude edited in the current (or, until it edits, the last) turn
      edited: string[]
      // true on the first edit of a turn: that edit replaces the old marks
      isFreshTurn: boolean
      // true from Claude's first edit until the turn ends: the mark pulses
      isWorking: boolean
      // true once a person closes the session's own folder, which starts open
      isRootClosed: boolean
    }
  }
}
