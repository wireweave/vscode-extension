<p align="center">
  <img src="icon.png" width="128" height="128" alt="Wireweave">
</p>

<h1 align="center">Wireweave for VS Code</h1>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=wireweave.wireweave-vscode">
    <img src="https://img.shields.io/visual-studio-marketplace/v/wireweave.wireweave-vscode" alt="Version">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=wireweave.wireweave-vscode">
    <img src="https://img.shields.io/visual-studio-marketplace/i/wireweave.wireweave-vscode" alt="Installs">
  </a>
  <a href="https://github.com/wireweave/vscode-extension/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/wireweave/vscode-extension" alt="License">
  </a>
</p>

<p align="center">
  Syntax highlighting and live preview for <a href="https://wireweave.org">Wireweave</a> - a text-based wireframe DSL for AI-assisted design.
</p>

---

## Features

- **Syntax Highlighting** - Full syntax highlighting for `.wf` and `.wireframe` files
- **Live Preview** - Real-time preview as you type
- **Markdown Integration** - Embed wireframes in Markdown with ` ```wireframe ` code blocks
- **Export Options** - Export wireframes as HTML
- **Theme Support** - Auto-detects VS Code theme (light/dark)

## Installation

### From VS Code Marketplace

1. Open **Extensions** sidebar (`Cmd+Shift+X` / `Ctrl+Shift+X`)
2. Search for **"Wireweave"**
3. Click **Install**

Or install via command line:

```bash
code --install-extension wireweave.wireweave-vscode
```

## Quick Start

### 1. Create a wireframe file

Create a new file with `.wf` extension:

```wireframe
page "Login" {
  main p=8 {
    row justify=center {
      col span=4 {
        card p=6 {
          title "Sign In" level=2
          input "Email" type=email required
          input "Password" type=password required
          button "Sign In" primary
        }
      }
    }
  }
}
```

### 2. Open the preview

- **Keyboard**: `Cmd+K V` (Mac) / `Ctrl+K V` (Windows/Linux)
- **Command Palette**: `Wireweave: Open Preview to Side`
- **Editor Title**: Click the preview icon

### 3. Export (optional)

- `Wireweave: Export as HTML`

## Markdown Preview

Embed wireframes in your Markdown documentation:

````markdown
# Login Page Design

```wireframe
page {
  card p=4 {
    title "Login"
    input "Email" type=email
    button "Sign In" primary
  }
}
```
````

Open Markdown preview (`Cmd+Shift+V`) to see the rendered wireframe.

## Commands

| Command | Keybinding | Description |
|---------|------------|-------------|
| `Wireweave: Open Preview` | - | Open preview in current panel |
| `Wireweave: Open Preview to Side` | `Cmd+K V` | Open preview in split view |
| `Wireweave: Export as HTML` | - | Export to HTML file |

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `wireframe.theme` | `auto` | Preview theme (`auto`, `light`, `dark`) |
| `wireframe.autoPreview` | `false` | Auto-open preview when opening wireframe files |
| `wireframe.previewWidth` | `1200` | Base width for preview (in pixels) |

## Supported File Extensions

- `.wf` (recommended)
- `.wireframe`

## Learn More

- [Wireweave Documentation](https://docs.wireweave.org)
- [DSL Reference](https://docs.wireweave.org/reference)
- [Examples](https://github.com/wireweave/examples)

## Feedback & Issues

- [GitHub Issues](https://github.com/wireweave/vscode-extension/issues)
- [Feature Requests](https://github.com/wireweave/vscode-extension/discussions)

## License

[MIT](LICENSE)
