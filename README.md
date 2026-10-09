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

Each file shows its app's own icon, so you can tell file types apart without reading the names. Where Windows has no icon, a Material Design icon in the file type's colour shows instead: code brackets for code files, a lined page for text and Markdown, curly braces for JSON, a picture for images and a grid for CSV.

## Using it

The tree opens in the sidebar when a session starts. If you close it, type `/files` to bring it back.

- Click a folder to open or close it.
- Click a file to open it in its default app.
- `.git`, `node_modules`, `.obsidian` and `__pycache__` folders are hidden.

## Install

In Claude Code, run:

```
/plugin marketplace add its-coughfee/pulse-file-tree
/plugin install file-tree@alex-plugins
```

## Requirements

Windows only. Opening files and fetching their icons both rely on Windows (File Explorer and PowerShell).
