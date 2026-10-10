# Pulse – file tree for Claude

A Claude Code mod that adds a file tree to the sidebar that enables you to: 
- See at a glance which files Claude is editing 
- clicking a file opens it in the default app, such as obsidian.

## What makes it different

### A pulsing mark shows what Claude is editing

When Claude edits a file, the Claude mark appears next to that file in the tree. While Claude is still working on the turn, the mark gently pulses, fading in and out, so you can watch edits land as they happen. When the turn ends, the pulse stops and the mark holds still, so you can still see which files changed.

When the next turn starts editing, the old marks clear and the new turn's files get marked instead. You only ever see the latest turn's changes, never a build-up from earlier ones.

If an edited file is inside a closed folder, the mark shows on the folder instead, so nothing is hidden. The mark sits in its own fixed space at the start of each row, so rows never shift when it appears or disappears.

The mark appears for anything Claude changes with its Edit, Write, MultiEdit or NotebookEdit tools.

### Files open in their default app

Clicking a file doesn't open it inside Claude Code. It opens in whatever app Windows uses for that file type: a Markdown note in Obsidian, a spreadsheet in Excel, a PDF in your PDF reader, and so on. 

Each file shows an icon for its type from [Material Icon Theme](https://github.com/material-extensions/vscode-material-icon-theme),  so you can tell file types apart without reading the names.


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
