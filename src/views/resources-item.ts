import { TreeItem, TreeItemCollapsibleState, window } from 'vscode';
import Loader from './loader';
import Empty from './empty';
import { l } from '../lib/utils';
import { Paged } from 'circle-client';

export default class ResourcesItem extends TreeItem {
  protected prefixRows: TreeItem[] = [];
  protected mainRows: TreeItem[] = [];
  private allRows: TreeItem[] = [];
  private loaderRow?: Loader;
  pageToken: string | null = null;

  constructor(
    label: string,
    collapsibleState: TreeItemCollapsibleState,
    private readonly resourceName: string,
    private readonly autoload: boolean
  ) {
    super(label, collapsibleState);
  }

  setup(): void {
    this.loaderRow = new Loader(
      this.resourceName,
      this.updateResources.bind(this)
    );

    this.allRows = [this.loaderRow];

    if (this.autoload) {
      this.updateResources.call(this);
    }
  }

  didUpdate(): void {
    this.loaderRow!.setLoading(false);
    this.allRows = this.mainRows.length
      ? this.mainRows
      : [new Empty(this.resourceName)];

    if (this.pageToken) {
      this.allRows.push(this.loaderRow!);
    }

    this.refresh();
  }

  refresh(): void {
    throw 'Sub-class must implement refresh';
  }

  updateResources(): void {
    throw 'Sub-class must implement updateResources';
  }

  async loadResources<T>(
    loader: () => Promise<Paged<T>>
  ): Promise<Paged<T>['items']> {
    this.loaderRow!.setLoading(true);
    this.refresh();

    try {
      const { items, next_page_token: pageToken } = await loader();
      this.pageToken = pageToken;
      return Promise.resolve(items);
    } catch (error) {
      window.showErrorMessage(
        l('loadItemsFail', `There was an issue loading`, this.resourceName)
      );
      console.error(error);
      return Promise.resolve([]);
    }
  }

  reload(): void {
    this.allRows = [this.loaderRow!];
    this.mainRows = [];
    this.pageToken = null;
    this.updateResources();
  }

  get children(): TreeItem[] {
    return this.allRows;
  }
}
