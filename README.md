# Pulse – file tree for Claude

A Claude Code mod that adds a file tree to the sidebar that enables you to: 
- See at a glance which files Claude is editing 
- clicking a file opens it in the default app, such as obsidian.
- navigate above project root
- drag and drop files to move inside tree

## What makes it different

### A pulsing mark shows what Claude is editing

When Claude edits a file, the Claude mark appears next to it in the tree. While Claude is still working on the turn, the mark gently pulses, fading in and out, so you can watch edits land as they happen. When the turn ends, the pulse stops and the mark holds still, so you can still see which files changed.

When the next turn starts editing, the old marks clear and the new turn's files get marked instead. You only ever see the latest turn's changes.

If an edited file is inside a closed folder, the mark shows on the folder instead, so nothing is hidden. 

The mark appears for anything Claude changes with its Edit, Write, MultiEdit or NotebookEdit tools.

### Files open in their default app

Clicking a file doesn't open it inside Claude Code. It opens in whatever app Windows uses for that file type: a Markdown note in Obsidian, a spreadsheet in Excel, a PDF in your PDF reader, and so on. 

Each file shows an icon for its type from [Material Icon Theme](https://github.com/material-extensions/vscode-material-icon-theme),  so you can tell file types apart without reading the names.

### Drag and drop files to move inside tree

Hold the left mouse button on a file and drag it. Drop it on a folder to move the file there; resting on a closed folder for a moment opens it. While you drag, two drop targets appear at the top of the pane: **Delete** sends the file to the Recycle Bin, and **Add to prompt** puts the file's path into Claude's prompt box.
### Navigate above project root

A dimmed line above the project folder shows its parent folder, shortened (for example `C:\…\mods`). Click it to unfold every folder from the drive down to your project, so you can open nearby folders and files without leaving the tree. Two buttons sit at the top of the pane: **Return to root** folds the path back to that single line, and **Collapse all** closes every open folder except the project folder and the path down to it.

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

Needs Claude Code 2.1.295 or newer.

## Credits

File and folder icons are from [Material Icon Theme](https://github.com/material-extensions/vscode-material-icon-theme) by Material Extensions, used under the MIT licence (see [icons/LICENSE](icons/LICENSE)).
