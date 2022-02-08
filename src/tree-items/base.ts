import { Disposable, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { getAsset } from '../lib/utils';

export abstract class Base extends TreeItem implements Disposable {
  loadable: boolean;
  loading: boolean;
  activeLabel: string;
  activeDescription?: string;
  iconName?: string;

  static invalidLoad = "Can't set loading on a non-loadable tree item";

  constructor({
    label,
    loadable = false,
    iconName,
    collapsibleState = TreeItemCollapsibleState.None,
  }: {
    label: string;
    iconName?: string;
    loadable?: boolean;
    collapsibleState?: TreeItemCollapsibleState;
  }) {
    super(label, collapsibleState);

    this.render(() => {
      this.activeLabel = label;
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

    if (this.iconName) {
      this.iconPath = getAsset(this.iconName);
    }
  }

  setLoading(loading: boolean): void {
    if (!this.loadable) {
      throw new Error(Base.invalidLoad);
    }

    this.render(() => (this.loading = loading));
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

  dispose(): void {
    // Nothing to do here
  }

  get children(): TreeItem[] {
    return [];
  }
}
