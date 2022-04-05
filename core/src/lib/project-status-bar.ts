import {
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  window,
} from 'vscode';

export class ProjectStatusBar {
  statusBarItem: StatusBarItem;

  constructor(context: ExtensionContext) {
    this.statusBarItem = window.createStatusBarItem(
      StatusBarAlignment.Left,
      100
    );
    context.subscriptions.push(this.statusBarItem);
  }
}
