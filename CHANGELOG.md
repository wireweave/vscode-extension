# Changelog

All notable changes to the Wireweave VS Code extension will be documented in this file.

## [1.0.1] - 2026-01-17

### Fixed
- Fix broken links in README (examples, discussions removed)
- Add Documentation and Playground links

## [1.0.0] - 2026-01-17

### Added
- Syntax highlighting for `.wf` and `.wireframe` files
- Live preview panel with real-time updates
- Theme support (auto-detects VS Code light/dark theme)
- Theme-aware outline border for preview panel
- Transparent background support for preview
- Markdown integration with `wireframe` code blocks
- Export to HTML
- Auto-completion for components and attributes
- Hover documentation

### Commands
- `Wireweave: Open Preview` - Open preview in current panel
- `Wireweave: Open Preview to Side` - Open preview in split view
- `Wireweave: Export as HTML` - Export wireframe as HTML

### Settings
- `wireframe.theme` - Preview theme (auto/light/dark)
- `wireframe.autoPreview` - Auto-open preview on file open
- `wireframe.previewWidth` - Base width for preview
