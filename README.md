# Wireframe Lang for VS Code

Visual Studio Code extension for wireweave DSL with syntax highlighting and live preview.

## Features

- **Syntax Highlighting**: Full syntax highlighting for `.wf` and `.wireframe` files
- **Live Preview**: Real-time preview as you type (Cmd/Ctrl+K V)
- **Markdown Preview**: Embed wireframes in Markdown files with `\`\`\`wireframe` code blocks
- **Export Options**: Export wireframes as SVG or HTML
- **Theme Support**: Auto-detects VS Code theme (light/dark)
- **Scale Mode**: Fixed layout with uniform scaling to fit preview width
- **Error Highlighting**: Instant feedback on syntax errors

## Installation

### From VSIX (Local Development)

1. Build the extension:
   ```bash
   cd packages/vscode-extension
   pnpm build
   pnpm package
   ```

2. Install in VS Code:
   - Open VS Code
   - Press `Cmd/Ctrl+Shift+P`
   - Type "Install from VSIX"
   - Select the generated `.vsix` file

### Development Mode (F5)

1. Open the `packages/vscode-extension` folder in VS Code
2. Press `F5` to launch Extension Development Host
3. A new VS Code window will open with the extension loaded
4. Create or open a `.wf` file to test

## Usage

### Creating a Wireframe

Create a file with `.wf` or `.wireframe` extension:

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

### Opening Preview

- **Keyboard**: `Cmd+K V` (Mac) or `Ctrl+K V` (Windows/Linux)
- **Command Palette**: `Wireframe: Open Preview to Side`
- **Editor Title**: Click the preview icon in the editor title bar

### Exporting

- **SVG Export**: Command Palette > `Wireframe: Export as SVG`
- **HTML Export**: Command Palette > `Wireframe: Export as HTML`

### Markdown Preview

Embed wireframes directly in Markdown files using fenced code blocks:

````markdown
# My Documentation

Here's a login form wireframe:

```wireframe
page {
  card p=4 {
    title "Login"
    input "Email" type=email
    input "Password" type=password
    button "Sign In" primary
  }
}
```
````

Open the Markdown preview (`Cmd+Shift+V` or `Ctrl+Shift+V`) to see the rendered wireframe.

You can also use `wf` as a short alias:

````markdown
```wf
page { button "Click me" primary }
```
````

## Commands

| Command | Keybinding | Description |
|---------|------------|-------------|
| `Wireframe: Open Preview` | - | Open preview in current panel |
| `Wireframe: Open Preview to Side` | `Cmd+K V` | Open preview in split view |
| `Wireframe: Export as SVG` | - | Export current wireframe to SVG |
| `Wireframe: Export as HTML` | - | Export current wireframe to HTML |

## Settings

Configure in VS Code Settings (`Cmd/Ctrl+,`):

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `wireframe.theme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | Preview theme |
| `wireframe.autoPreview` | `boolean` | `false` | Auto-open preview on file open |
| `wireframe.previewWidth` | `number` | `1200` | Base width for wireframe preview (px) |

### Example settings.json

```json
{
  "wireframe.theme": "auto",
  "wireframe.autoPreview": true,
  "wireframe.previewWidth": 1440
}
```

### Scale Mode

The preview uses **fixed layout with scale mode**:

- Wireframes are rendered at the configured `previewWidth`
- The preview scales down uniformly to fit the panel
- No responsive breakpoints - layout stays consistent at all sizes
- For different device sizes, create separate wireframe files (e.g., `dashboard-mobile.wf`, `dashboard-tablet.wf`)

## Syntax Highlighting

The extension provides syntax highlighting for:

- **Keywords**: `page`, `header`, `main`, `footer`, `sidebar`, `row`, `col`, `card`, etc.
- **Components**: `button`, `input`, `text`, `title`, `image`, `table`, etc.
- **Attributes**: `p`, `m`, `span`, `gap`, `justify`, `align`, etc.
- **Values**: Strings, numbers, booleans
- **Comments**: Single-line (`//`) and multi-line (`/* */`)

## Supported DSL Elements

### Layout

```wireframe
page "Title" {
  header { }
  sidebar { }
  main { }
  footer { }
}
```

### Grid System

```wireframe
row gap=4 {
  col span=6 { }
  col span=6 { }
}
```

### Components

```wireframe
// Text
title "Heading" level=2
text "Paragraph" muted

// Form
input "Label" type=email required
button "Submit" primary
checkbox "Remember me"
select "Option" ["A", "B", "C"]

// Feedback
alert "Message" variant=success
badge "New" variant=primary
progress value=75

// Data
table {
  columns ["Name", "Email"]
  row ["John", "john@example.com"]
}
```

## Troubleshooting

### Preview not updating

1. Check for syntax errors in the Problems panel
2. Try closing and reopening the preview
3. Reload the VS Code window (`Cmd/Ctrl+Shift+P` > "Reload Window")

### Extension not activating

1. Ensure the file has `.wf` or `.wireframe` extension
2. Check VS Code's Output panel for errors
3. Try reinstalling the extension

### Export not working

1. Ensure the file is saved
2. Check if the output directory is writable
3. Look for error messages in the notification area

## Development

### Prerequisites

- Node.js >= 20
- pnpm >= 9

### Building

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm watch

# Package VSIX
pnpm package
```

### Project Structure

```
packages/vscode-extension/
├── src/
│   ├── extension.ts         # Main extension entry
│   ├── preview.ts           # Live preview panel
│   ├── language.ts          # Language features
│   └── markdown-plugin.ts   # Markdown preview plugin
├── styles/
│   └── wireframe-preview.css  # Markdown preview styles
├── syntaxes/
│   └── wireframe.tmLanguage.json  # TextMate grammar
├── language-configuration.json    # Language config
├── package.json          # Extension manifest
└── tsup.config.ts        # Build config
```

## License

MIT
