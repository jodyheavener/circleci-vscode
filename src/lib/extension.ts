import { ExtensionContext } from 'vscode';
import { configuration } from './config';

export class Extension {
  private _context?: ExtensionContext;

  configure(context: ExtensionContext): void {
    this._context = context;
    configuration.configure(context);
  }

  get context(): ExtensionContext {
    return this._context!;
  }
}

export const extension = new Extension();
