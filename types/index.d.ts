declare module 'claude-code' {
  interface PluginState {
    pulse: {
      // folders the person has expanded, normalised paths
      expanded: string[]
      // files Claude edited in the current (or, until it edits, the last) turn
      edited: string[]
      // the file Claude edited most recently, normalised: only its mark pulses
      lastEdited: string
      // true on the first edit of a turn: that edit replaces the old marks
      isFreshTurn: boolean
      // true from Claude's first edit until the turn ends: the mark pulses
      isWorking: boolean
      // true once a person closes the session's own folder, which starts open
      isRootClosed: boolean
      // how many parent folders are shown above the project, 1 at each session start
      climbed: number
      // the file last clicked open in the tree this session, full path, empty when none
      lastClicked: string
      // the file whose row is flashing after Reveal last opened, normalised, empty when none
      flashing: string
      // true while a flashing row is lit
      isFlashOn: boolean
      // the full path of the file being dragged, empty when none: the drop icons show
      dragging: string
    }
  }
}
