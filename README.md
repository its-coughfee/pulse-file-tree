# Pulse – file tree for Claude

A Claude Code mod that adds a file tree to the sidebar, built around two ideas: you can see at a glance which files Claude is editing, and clicking a file opens it in the app you'd normally use for it.
## What makes it different

### A pulsing mark shows what Claude is editing

When Claude edits a file, the Claude mark appears next to that file in the tree. While Claude is still working on the turn, the mark gently pulses, fading in and out, so you can watch edits land as they happen. When the turn ends, the pulse stops and the mark holds still, so you can still see which files changed.

When the next turn starts editing, the old marks clear and the new turn's files get marked instead. You only ever see the latest turn's changes, never a build-up from earlier ones.

If an edited file is inside a closed folder, the mark shows on the folder instead, so nothing is hidden. The mark sits in its own fixed space at the start of each row, so rows never shift when it appears or disappears.

The mark appears for anything Claude changes with its Edit, Write, MultiEdit or NotebookEdit tools.

### Files open in their default app

Clicking a file doesn't open it inside Claude Code. It opens in whatever app Windows uses for that file type: a Markdown note in Obsidian, a spreadsheet in Excel, a PDF in your PDF reader, an image in your photo viewer. It's the same as double-clicking the file in File Explorer. If the file can't be opened, a short message says so.

Each file shows an icon for its type from [Material Icon Theme](https://github.com/material-extensions/vscode-material-icon-theme), the same icons many people know from VS Code, so you can tell file types apart without reading the names. Around 45 common types have their own icon, from HTML, JavaScript and Python to Word, PDF, spreadsheets, images, audio and video. Any other type gets a plain page icon.

## Using it

The tree opens in the sidebar when a session starts. If you close it, type `/files` to bring it back.

- Click a folder to open or close it.
- Click a file to open it in its default app.
- `.git`, `node_modules`, `.obsidian` and `__pycache__` folders are hidden.

## Install

In Claude Code, run:

```
/plugin marketplace add its-coughfee/pulse-file-tree
/plugin install pulse@alex-plugins
```

## Requirements

Windows only. Opening files relies on File Explorer.

## Credits

File and folder icons are from [Material Icon Theme](https://github.com/material-extensions/vscode-material-icon-theme) by Material Extensions, used under the MIT licence (see [icons/LICENSE](icons/LICENSE)).
