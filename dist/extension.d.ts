import * as vscode from 'vscode';

/**
 * wireweave VSCode Extension
 *
 * Provides syntax highlighting, real-time preview, and export functionality
 * for wireweave DSL files.
 */

/**
 * Extension activation
 */
declare function activate(context: vscode.ExtensionContext): {
    extendMarkdownIt(md: MarkdownIt): MarkdownIt;
};
interface MarkdownIt {
    renderer: {
        rules: {
            fence?: (tokens: Array<{
                info?: string;
                content: string;
            }>, idx: number, options: unknown, env: unknown, self: {
                renderToken: (tokens: unknown[], idx: number, options: unknown) => string;
            }) => string;
        };
    };
}
/**
 * Extension deactivation
 */
declare function deactivate(): void;

export { activate, deactivate };
