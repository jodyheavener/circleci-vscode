import { ExtensionContext, workspace } from 'vscode';
import { configuration } from './config';
import { gitService } from './git-service';

export class Extension {
  private _context?: ExtensionContext;

  async configure(context: ExtensionContext): Promise<void> {
    this._context = context;
    configuration.configure(context);

    if (!this.workspacePath) {
      throw new Error('No workspace folder found');
    }

    await gitService.configure();
  }

  get context(): ExtensionContext {
    return this._context!;
  }

  get workspacePath(): string {
    if (
      !workspace.workspaceFolders ||
      workspace.workspaceFolders.length === 0
    ) {
      return null;
    } else {
      return workspace.workspaceFolders[0].uri.fsPath;
    }
  }
}

export const extension = new Extension();
