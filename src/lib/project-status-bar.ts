import {
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  window,
} from 'vscode';
import { events } from './events';
import { gitService } from './git-service';
import { Events } from './types';

export class ProjectStatusBar {
  statusBarItem: StatusBarItem;

  constructor(context: ExtensionContext) {
    this.statusBarItem = window.createStatusBarItem(
      StatusBarAlignment.Left,
      100
    );
    context.subscriptions.push(this.statusBarItem);

    events.on(Events.GitDataUpdate, this.update.bind(this));
    this.update();
  }

  update(): void {
    const gitSet = gitService.sets.find((set) => set.active);
    this.statusBarItem.text = `$(testing-run-all-icon) ${gitSet.repo} | ${gitSet.branch}`;
    this.statusBarItem.tooltip = 'Tests are running in CircleCI';
    this.statusBarItem.show();
  }
}
