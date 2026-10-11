# Pulse – file tree for Claude

A Claude Code mod that adds a file tree to the sidebar that enables you to: 
- See at a glance which files Claude is editing 
- clicking a file opens it in the default app, such as obsidian.
- navigate above project root
- drag and drop files to move inside tree

## What makes it different

### A pulsing mark shows what Claude is editing

When Claude edits a file, the Claude mark appears next to it in the tree. The mark on the file Claude edited most recently gently pulses, fading in and out, for about 3 seconds or until Claude's next edit, whichever comes first. Then it holds still, and earlier marks hold still too, so you can follow each edit as it lands and still see which files changed.

When Claude starts editing in the next turn, the old edit marks clear and the new turn's files get marked instead. 

If an edited file is inside a closed folder, the mark shows on the folder instead, so nothing is hidden. 

The mark appears for anything Claude changes with its Edit, Write, MultiEdit or NotebookEdit tools.

### Files open in their default app

Clicking a file doesn't open it inside Claude Code. It opens in whatever app Windows uses for that file type: a Markdown note in Obsidian, a spreadsheet in Excel, a PDF in your PDF reader, and so on. 

Each file shows an icon for its type from [Material Icon Theme](https://github.com/material-extensions/vscode-material-icon-theme),  so you can tell file types apart without reading the names.

### Drag and drop files to move inside tree

Hold the left mouse button on a file and drag it. Drop it on a folder to move the file there; resting on a closed folder for a moment opens it. While you drag, two drop targets appear at the top of the pane: **Delete** sends the file to the Recycle Bin, and **Add to prompt** puts the file's path into Claude's prompt box.
### Navigate above project root

A closed line for the parent folder sits above your project folder. Click it to open it and see the folders and files beside your project. Buttons sit in a row at the top of the pane:

- **⇲ Collapse** closes every folder, the project folder included. Climbed parent lines stay, closed.
- **↑ Up** adds the next parent folder above the top line, one level per press, until you reach the drive.
- **⌂ Root** folds the climbed lines back to the single parent line.
- **◎ Reveal** closes everything except the path to the last file you clicked in the tree, and flashes that file's row three times. It's greyed out until you've clicked a file this session.

## Using it

The tree opens in the sidebar when a session starts. If you close it, type `/files` to bring it back.

- Click a folder to open or close it.
- Click a file to open it in its default app.
- `.git`, `node_modules`, `.obsidian` and `__pycache__` folders are hidden.

## Install

In Claude Code, run these two commands one at a time. 

```
/plugin marketplace add its-coughfee/pulse-file-tree
```

```
/plugin install pulse@its-coughfee
```

## Updating

In Claude Code, run these two commands one at a time.

```
/plugin marketplace update its-coughfee
```

```
/plugin install pulse@its-coughfee
```

Pulse only updates when its version number goes up.

If you installed Pulse under the old name, `pulse@alex-plugins`, remove Pulse and the alex-plugins marketplace first, then install again with the commands above.

## Requirements

Windows only. Opening files relies on File Explorer.

Needs Claude Code 2.1.295 or newer.

## Credits

File and folder icons are from [Material Icon Theme](https://github.com/material-extensions/vscode-material-icon-theme) by Material Extensions, used under the MIT licence (see [icons/LICENSE](icons/LICENSE)).
