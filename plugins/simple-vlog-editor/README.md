# Simple Vlog Editor for Claude Code

> **Windows x64 only.** This plugin drives the **SimpleVlogEditor** desktop application,
> which must be installed separately from <https://simplevlogeditor.com/>.

Simple Vlog Editor lets Claude Code edit your videos in a real, visible editor: it listens to
and looks at every clip, removes mistakes, repetitions and dead air, and adds captions, cards,
tags, transitions, push-ins, placed images, video effects and music — while you watch the
timeline change. Everything runs on your own computer; your media is never uploaded.

## Requirements

- Windows 10 or 11, 64-bit (x64).
- **SimpleVlogEditor 1.1.3 or newer**, installed with its Windows installer from
  <https://simplevlogeditor.com/> in the default folder
  (`C:\Program Files\SimpleVlogEditor` or `%LOCALAPPDATA%\Programs\SimpleVlogEditor`).
- Node.js 18 or newer on the `PATH` (`node --version`).
- Claude Code.

## Install

1. Install SimpleVlogEditor from <https://simplevlogeditor.com/>, keeping the default folder.
2. Install this plugin from the Claude Code plugin marketplace.
3. Start a new Claude Code session so the plugin's tools and skills are loaded.

If the editor is not installed (or is too old), the plugin still starts and tells you so, with
the download link. Install it, tell Claude, and it connects in the same session through
`check_installation`.

## Use

Open Claude Code in the folder that holds your footage and ask, for example:

> Edit my vlog: cut the repeated takes and long pauses, speed up the timelapses, add a title
> card and the music in this folder, then export it.

> Add upper-case background captions to the talking parts and place the photos where I mention them.

The editor window opens on the first request and shows every action in its activity panel.
Two skills are included:

- **edit-video** — targeted edits: cuts, captions, tags, transitions, audio, noise removal,
  video effects, placed images, preview and export.
- **edit-vlog** — an autonomous end-to-end edit of a whole vlog.

The editor saves a recovery checkpoint while it works, so an interrupted edit can be resumed.
Pressing **Clear all** in the editor removes it.

## Files and folders it can reach

The plugin can only read and write inside the folders you allow: by default the folder Claude
Code was started in and your usual media folders; others can be allowed in the editor. System
folders are always refused. To pin the list yourself, set `SVE_MCP_ROOTS` (paths separated by `;`).

## Network access

The editing itself never uses the network. Once per session, at startup, the plugin makes one
anonymous `GET https://simplevlogeditor.com/currentversion` to find out whether a newer plugin or
editor has been released, and mentions it if so. Nothing about you or your files is sent; it
gives up after 5 seconds and is silent when offline. To turn it off, set
`SVE_SKIP_UPDATE_CHECK=1`.

The editor may download its speech-recognition and person-segmentation models the first time
those features are used; they are cached on your computer.

## Troubleshooting

- **Only `check_installation`, `health_check` and `get_editor_capabilities` are available** —
  SimpleVlogEditor was not found in its default folder. Install it from
  <https://simplevlogeditor.com/> and ask Claude to check the installation again.
- **Something else** — run `node scripts/doctor.mjs` in the plugin folder; it checks the
  installation and opens a test session. Logs are written to
  `%LOCALAPPDATA%\SimpleVlogEditor\logs\mcp-runtime.log`.

## License

The plugin is released under the [MIT License](LICENSE). The SimpleVlogEditor application is
distributed separately under its own terms.

Support: <https://simplevlogeditor.com/> · jrdutra.com.br@gmail.com
