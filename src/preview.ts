/**
 * Wireframe Preview Panel
 *
 * Provides real-time preview of wireweave documents in a webview panel
 */

import * as vscode from 'vscode';
import { parse, render, renderToSvg, renderToHtml, resolveViewport } from '@wireweave/core';
import type { WireframeDocument } from '@wireweave/core';

/**
 * Manages wireframe preview webview panels
 */
export class WireframePreviewPanel {
  private static currentPanel: WireframePreviewPanel | undefined;
  private static readonly viewType = 'wireframePreview';

  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.panel = panel;
    this.extensionUri = extensionUri;

    // Handle disposal
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

    // Update content when panel becomes visible
    this.panel.onDidChangeViewState(
      () => {
        if (this.panel.visible) {
          const editor = vscode.window.activeTextEditor;
          if (editor?.document.languageId === 'wireframe') {
            this.updateContent(editor.document);
          }
        }
      },
      null,
      this.disposables
    );

    // Initial content
    const editor = vscode.window.activeTextEditor;
    if (editor?.document.languageId === 'wireframe') {
      this.updateContent(editor.document);
    } else {
      this.showWelcome();
    }
  }

  /**
   * Create or show the preview panel
   */
  public static createOrShow(extensionUri: vscode.Uri, position: 'current' | 'side') {
    const column =
      position === 'side' ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active;

    // If we already have a panel, show it
    if (WireframePreviewPanel.currentPanel) {
      WireframePreviewPanel.currentPanel.panel.reveal(column);
      return;
    }

    // Otherwise, create a new panel
    const panel = vscode.window.createWebviewPanel(
      WireframePreviewPanel.viewType,
      'Wireframe Preview',
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [extensionUri],
      }
    );

    WireframePreviewPanel.currentPanel = new WireframePreviewPanel(panel, extensionUri);
  }

  /**
   * Update the preview content from a document
   */
  public static update(document: vscode.TextDocument) {
    if (WireframePreviewPanel.currentPanel) {
      WireframePreviewPanel.currentPanel.updateContent(document);
    }
  }

  /**
   * Export document to SVG or HTML
   */
  public static async export(
    document: vscode.TextDocument,
    format: 'svg' | 'html'
  ): Promise<string> {
    const source = document.getText();

    try {
      const ast = parse(source);

      if (format === 'svg') {
        const result = renderToSvg(ast);
        return result.svg;
      } else {
        return renderToHtml(ast);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Parse error: ${message}`);
    }
  }

  /**
   * Update the webview content
   */
  private updateContent(document: vscode.TextDocument) {
    const source = document.getText();

    if (!source.trim()) {
      this.showWelcome();
      return;
    }

    try {
      const ast = parse(source);
      const { html, css } = render(ast, {
        theme: this.getTheme(),
        includeStyles: true,
      });

      this.panel.webview.html = this.getWebviewContent(html, css, ast);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.panel.webview.html = this.getErrorContent(message);
    }
  }

  /**
   * Get the current theme setting
   */
  private getTheme(): 'light' | 'dark' {
    const config = vscode.workspace.getConfiguration('wireframe');
    const themeSetting = config.get<string>('theme', 'auto');

    if (themeSetting === 'auto') {
      return vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark
        ? 'dark'
        : 'light';
    }
    return themeSetting as 'light' | 'dark';
  }

  /**
   * Get the base preview width setting
   */
  private getPreviewWidth(): number {
    const config = vscode.workspace.getConfiguration('wireframe');
    return config.get<number>('previewWidth', 1200);
  }

  /**
   * Generate the webview HTML content
   * Uses fixed scale mode - wireframe maintains exact aspect ratio
   */
  private getWebviewContent(html: string, css: string, ast?: WireframeDocument): string {
    const isDark = this.getTheme() === 'dark';
    const bgColor = isDark ? '#1e1e1e' : '#ffffff';
    const textColor = isDark ? '#d4d4d4' : '#000000';

    // Get viewport from first page, or use config setting as fallback
    let baseWidth = this.getPreviewWidth();
    let baseHeight = Math.round(baseWidth * 0.75); // Default 4:3 aspect ratio

    if (ast && ast.children.length > 0) {
      const firstPage = ast.children[0];
      if (firstPage.viewport !== undefined || firstPage.device !== undefined) {
        const viewport = resolveViewport(firstPage.viewport, firstPage.device);
        baseWidth = viewport.width;
        baseHeight = viewport.height;
      }
    }

    // Scale settings - viewport aspect ratio is preserved
    // Fixed scale: 0.5 for desktop (>800px), 0.8 for mobile
    const fixedScale = baseWidth > 800 ? 0.5 : 0.8;
    const scaledWidth = Math.round(baseWidth * fixedScale);
    const scaledHeight = Math.round(baseHeight * fixedScale);

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
  <style>
    /* Core wireframe styles */
    ${css}

    /* Fixed viewport preview styles */
    * {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: ${bgColor};
      color: ${textColor};
    }
    body {
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    }
    .wireframe-container {
      display: flex;
      justify-content: center;
    }
    .wireframe-scaler-wrapper {
      position: relative;
      width: ${scaledWidth}px;
      height: ${scaledHeight}px;
      background: #ffffff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-radius: 4px;
      overflow: hidden;
    }
    .wireframe-scaler {
      position: absolute;
      top: 0;
      left: 0;
      width: ${baseWidth}px;
      height: ${baseHeight}px;
      transform: scale(${fixedScale});
      transform-origin: top left;
    }
    /* Override core's min-height: 100vh */
    .wf-page {
      width: ${baseWidth}px;
      height: ${baseHeight}px;
      min-height: auto;
      overflow: auto;
    }
  </style>
</head>
<body>
  <div class="wireframe-container">
    <div class="wireframe-scaler-wrapper">
      <div class="wireframe-scaler">
        ${html}
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Show error content
   */
  private getErrorContent(message: string): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #fef2f2;
      color: #991b1b;
    }
    h3 {
      margin: 0 0 12px 0;
      font-size: 16px;
      color: #dc2626;
    }
    pre {
      margin: 0;
      padding: 12px;
      background: #fee2e2;
      border-radius: 6px;
      font-family: 'SF Mono', Monaco, Consolas, monospace;
      font-size: 13px;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <h3>Syntax Error</h3>
  <pre>${this.escapeHtml(message)}</pre>
</body>
</html>`;
  }

  /**
   * Show welcome content when no file is open
   */
  private showWelcome(): void {
    this.panel.webview.html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
  <style>
    body {
      margin: 0;
      padding: 40px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc;
      color: #475569;
      text-align: center;
    }
    h2 {
      margin: 0 0 16px 0;
      color: #1e293b;
    }
    p {
      margin: 0 0 24px 0;
      line-height: 1.6;
    }
    code {
      display: block;
      margin: 24px auto;
      max-width: 400px;
      padding: 16px;
      background: #1e293b;
      color: #e2e8f0;
      border-radius: 8px;
      font-family: 'SF Mono', Monaco, Consolas, monospace;
      font-size: 13px;
      text-align: left;
      white-space: pre;
    }
  </style>
</head>
<body>
  <h2>Wireframe Lang Preview</h2>
  <p>Open a <strong>.wf</strong> or <strong>.wireframe</strong> file to see the preview.</p>
  <code>page "My App" {
  header {
    title "Welcome"
  }
  main {
    card "Hello" {
      text "Start editing!"
      button "Click me"
    }
  }
}</code>
</body>
</html>`;
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Dispose the panel and clean up resources
   */
  private dispose() {
    WireframePreviewPanel.currentPanel = undefined;

    this.panel.dispose();

    while (this.disposables.length) {
      const disposable = this.disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}
