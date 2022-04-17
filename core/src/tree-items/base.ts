import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { getImage } from '../lib/utils';

export abstract class Base extends TreeItem {
  loadable: boolean;
  loading: boolean;
  activeLabel: string;
  activeDescription?: string;
  activeTooltip?: string;
  iconName?: string;
  children: TreeItem[] = [];

  static invalidLoad = "Can't set loading on a non-loadable tree item";

  constructor({
    label,
    description,
    contextValue,
    iconName,
    tooltip,
    loadable = false,
    collapsibleState = TreeItemCollapsibleState.None,
  }: {
    label: string;
    description?: string;
    contextValue?: string;
    iconName?: string;
    tooltip?: string;
    loadable?: boolean;
    collapsibleState?: TreeItemCollapsibleState;
  }) {
    super(label, collapsibleState);

    this.contextValue = contextValue;

    this.render(() => {
      this.activeLabel = label;
      this.activeDescription = description;
      this.activeTooltip = tooltip || label;
      this.iconName = iconName;
      this.loadable = loadable;
      this.loading = false;
    });
  }

  protected render(prerender?: () => void): void {
    if (prerender) {
      prerender.call(this);
    }

    this.label = this.loadable
      ? this.loading
        ? 'Loading...'
        : this.activeLabel
      : this.activeLabel;

    this.description = this.loadable
      ? this.loading
        ? undefined
        : this.activeDescription
      : this.activeDescription;

    this.tooltip = this.loadable
      ? this.loading
        ? 'Loading...'
        : this.activeTooltip
      : this.activeTooltip;

    if (this.iconName) {
      this.iconPath = getImage(this.iconName);
    }

    this.collapsibleState =
      this.children.length > 0
        ? TreeItemCollapsibleState.Expanded
        : TreeItemCollapsibleState.None;
  }

  setLoading(loading: boolean): void {
    if (!this.loadable) {
      throw new Error(Base.invalidLoad);
    }

    this.render(() => (this.loading = loading));
  }

  setCommand(command?: string, title?: string): void {
    if (!command) {
      this.command = undefined;
      return;
    }

    this.command = {
      command,
      title,
      arguments: [this],
    };
  }

  setIconName(iconName: string): void {
    this.render(() => (this.iconName = iconName));
  }

  setLabel(label: string): void {
    this.render(() => (this.activeLabel = label));
  }

  setDescription(description?: string): void {
    this.render(() => (this.activeDescription = description));
  }

  setTooltip(tooltip: string): void {
    this.render(() => (this.activeTooltip = tooltip));
  }
}
