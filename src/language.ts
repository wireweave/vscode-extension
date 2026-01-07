/**
 * Language Features for Wireframe Lang
 *
 * Provides completion, hover, and other language features
 */

import * as vscode from 'vscode';

/**
 * Component definitions for auto-completion and hover
 */
const COMPONENT_DOCS: Record<
  string,
  { description: string; example: string; attributes?: string[] }
> = {
  // Layout
  page: {
    description: 'Root container for a wireframe page',
    example: 'page "Title" { ... }',
    attributes: ['title'],
  },
  header: {
    description: 'Page header section',
    example: 'header { ... }',
    attributes: ['fixed'],
  },
  main: {
    description: 'Main content area',
    example: 'main { ... }',
  },
  footer: {
    description: 'Page footer section',
    example: 'footer { ... }',
    attributes: ['fixed'],
  },
  sidebar: {
    description: 'Side navigation or content area',
    example: 'sidebar { ... }',
    attributes: ['position', 'collapsed'],
  },
  section: {
    description: 'Generic section container',
    example: 'section { ... }',
  },
  row: {
    description: 'Horizontal flex/grid row',
    example: 'row { col { ... } col { ... } }',
    attributes: ['gap', 'justify', 'align'],
  },
  col: {
    description: 'Column within a row',
    example: 'col span=6 { ... }',
    attributes: ['span', 'sm', 'md', 'lg', 'xl'],
  },

  // Containers
  card: {
    description: 'Card container with optional title',
    example: 'card "Title" { ... }',
    attributes: ['title'],
  },
  modal: {
    description: 'Modal dialog overlay',
    example: 'modal "Title" { ... }',
    attributes: ['title', 'open'],
  },
  drawer: {
    description: 'Slide-in drawer panel',
    example: 'drawer "Title" { ... }',
    attributes: ['title', 'position', 'open'],
  },
  accordion: {
    description: 'Expandable accordion panel',
    example: 'accordion "Title" { ... }',
    attributes: ['title', 'expanded'],
  },

  // Text
  text: {
    description: 'Text paragraph',
    example: 'text "Content"',
    attributes: ['size', 'weight', 'align', 'muted'],
  },
  title: {
    description: 'Heading/title text',
    example: 'title "Heading" level=2',
    attributes: ['level', 'size', 'align'],
  },
  link: {
    description: 'Hyperlink',
    example: 'link "Click here" href="/page"',
    attributes: ['href', 'external'],
  },

  // Inputs
  input: {
    description: 'Text input field',
    example: 'input "Label" placeholder="Enter text"',
    attributes: ['label', 'placeholder', 'type', 'disabled', 'required'],
  },
  textarea: {
    description: 'Multi-line text input',
    example: 'textarea "Label" placeholder="Enter text"',
    attributes: ['label', 'placeholder', 'rows', 'disabled'],
  },
  select: {
    description: 'Dropdown select input',
    example: 'select "Label" options=["A", "B", "C"]',
    attributes: ['label', 'placeholder', 'options', 'disabled'],
  },
  checkbox: {
    description: 'Checkbox input',
    example: 'checkbox "Accept terms" checked',
    attributes: ['label', 'checked', 'disabled'],
  },
  radio: {
    description: 'Radio button input',
    example: 'radio "Option A" name="group"',
    attributes: ['label', 'name', 'checked', 'disabled'],
  },
  switch: {
    description: 'Toggle switch',
    example: 'switch "Enable feature" checked',
    attributes: ['label', 'checked', 'disabled'],
  },
  slider: {
    description: 'Range slider input',
    example: 'slider "Volume" min=0 max=100 value=50',
    attributes: ['label', 'min', 'max', 'value', 'disabled'],
  },

  // Button
  button: {
    description: 'Clickable button',
    example: 'button "Click me" primary',
    attributes: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'size', 'disabled'],
  },

  // Display
  image: {
    description: 'Image placeholder',
    example: 'image alt="Photo" w=200 h=150',
    attributes: ['src', 'alt', 'w', 'h'],
  },
  placeholder: {
    description: 'Generic placeholder box',
    example: 'placeholder "Content area" w=300 h=200',
    attributes: ['label', 'w', 'h'],
  },
  avatar: {
    description: 'User avatar',
    example: 'avatar "John Doe" size=lg',
    attributes: ['name', 'src', 'size'],
  },
  badge: {
    description: 'Status badge/label',
    example: 'badge "New"',
    attributes: ['variant', 'pill'],
  },
  icon: {
    description: 'Icon placeholder',
    example: 'icon "settings" size=24',
    attributes: ['name', 'size'],
  },

  // Data
  table: {
    description: 'Data table',
    example: 'table columns=["Name", "Email"] rows=5',
    attributes: ['columns', 'rows', 'striped', 'bordered'],
  },
  list: {
    description: 'List of items',
    example: 'list items=["Item 1", "Item 2"]',
    attributes: ['items', 'ordered'],
  },

  // Feedback
  alert: {
    description: 'Alert/notification message',
    example: 'alert "Message" variant=success',
    attributes: ['variant'],
  },
  progress: {
    description: 'Progress bar',
    example: 'progress value=60 max=100',
    attributes: ['value', 'max', 'label'],
  },
  spinner: {
    description: 'Loading spinner',
    example: 'spinner size=lg',
    attributes: ['size'],
  },

  // Navigation
  nav: {
    description: 'Navigation menu',
    example: 'nav items=[{label: "Home", active: true}]',
    attributes: ['items', 'vertical'],
  },
  tabs: {
    description: 'Tab navigation',
    example: 'tabs items=["Tab 1", "Tab 2"]',
    attributes: ['items', 'active'],
  },
  breadcrumb: {
    description: 'Breadcrumb navigation',
    example: 'breadcrumb items=["Home", "Products", "Details"]',
    attributes: ['items'],
  },
};

/**
 * Attribute definitions for completion
 */
const ATTRIBUTE_DOCS: Record<string, { description: string; values?: string[] }> = {
  span: { description: 'Column span (1-12)' },
  sm: { description: 'Span at small breakpoint (576px+)' },
  md: { description: 'Span at medium breakpoint (768px+)' },
  lg: { description: 'Span at large breakpoint (992px+)' },
  xl: { description: 'Span at extra-large breakpoint (1200px+)' },
  flex: { description: 'Enable flexbox layout' },
  direction: { description: 'Flex direction', values: ['row', 'column'] },
  justify: { description: 'Justify content', values: ['start', 'center', 'end', 'between', 'around'] },
  align: { description: 'Align items', values: ['start', 'center', 'end', 'stretch'] },
  gap: { description: 'Gap between items (0-20)' },
  p: { description: 'Padding (0-20)' },
  m: { description: 'Margin (0-20)' },
  w: { description: 'Width (number or "full", "auto")' },
  h: { description: 'Height (number or "full", "auto")' },
  size: { description: 'Size variant', values: ['xs', 'sm', 'md', 'lg', 'xl'] },
  variant: { description: 'Style variant', values: ['default', 'success', 'warning', 'danger', 'info'] },
};

/**
 * Register language features
 */
export function registerLanguageFeatures(context: vscode.ExtensionContext) {
  // Completion provider
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    'wireframe',
    {
      provideCompletionItems(document, position) {
        const items: vscode.CompletionItem[] = [];

        // Add component completions
        for (const [name, doc] of Object.entries(COMPONENT_DOCS)) {
          const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Class);
          item.detail = doc.description;
          item.documentation = new vscode.MarkdownString(`\`\`\`wireframe\n${doc.example}\n\`\`\``);
          items.push(item);
        }

        // Add attribute completions
        for (const [name, doc] of Object.entries(ATTRIBUTE_DOCS)) {
          const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Property);
          item.detail = doc.description;
          if (doc.values) {
            item.documentation = `Values: ${doc.values.join(', ')}`;
          }
          items.push(item);
        }

        return items;
      },
    },
    ' ',
    '\n'
  );

  // Hover provider
  const hoverProvider = vscode.languages.registerHoverProvider('wireframe', {
    provideHover(document, position) {
      const range = document.getWordRangeAtPosition(position);
      if (!range) return null;

      const word = document.getText(range);

      // Check components
      if (COMPONENT_DOCS[word]) {
        const doc = COMPONENT_DOCS[word];
        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`**${word}** - ${doc.description}\n\n`);
        markdown.appendCodeblock(doc.example, 'wireframe');
        if (doc.attributes) {
          markdown.appendMarkdown(`\n\nAttributes: \`${doc.attributes.join('`, `')}\``);
        }
        return new vscode.Hover(markdown);
      }

      // Check attributes
      if (ATTRIBUTE_DOCS[word]) {
        const doc = ATTRIBUTE_DOCS[word];
        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`**${word}** - ${doc.description}`);
        if (doc.values) {
          markdown.appendMarkdown(`\n\nValues: \`${doc.values.join('`, `')}\``);
        }
        return new vscode.Hover(markdown);
      }

      return null;
    },
  });

  context.subscriptions.push(completionProvider, hoverProvider);
}
