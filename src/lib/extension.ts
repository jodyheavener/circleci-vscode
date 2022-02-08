import { ExtensionContext } from 'vscode';

export class Extension {
  private _context?: ExtensionContext;

  configure(context: ExtensionContext): void {
    this._context = context;
  }

  get context(): ExtensionContext {
    return this._context!;
  }
}

export default new Extension();
