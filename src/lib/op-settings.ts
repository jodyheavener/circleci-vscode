import { window } from 'vscode';
import { execute } from './utils';

type VaultItem = {
  fields: { label: string; value?: string }[];
};

const timeoutAfter = 60 * 1000;

class OPSettings {
  cache: Record<string, { value: string; dispose: NodeJS.Timer }> = {};
  itemNames: Record<string, string> = {};

  async retrieve(key: string): Promise<string> {
    const existing = this.cache[key];
    if (existing) {
      console.log('Using cached value for', key);
      clearTimeout(existing.dispose);
      existing.dispose = setTimeout(() => delete this.cache[key], timeoutAfter);
      return existing.value;
    }

    const value = await this.getValue(key);

    if (value) {
      this.cache[key] = {
        value,
        dispose: setTimeout(() => delete this.cache[key], timeoutAfter),
      };
    }

    return value;
  }

  private async requestItemName(key: string): Promise<string | null> {
    const result =
      this.itemNames[key] ||
      (await window.showInputBox({
        title: 'Enter the name of the vault item to use',
        ignoreFocusOut: true,
      }));

    return result || null;
  }

  private async requestFieldName(
    fields: VaultItem['fields']
  ): Promise<string | null> {
    const result = await window.showQuickPick(
      fields.map((field) => field.label),
      {
        title: 'Choose which field to use',
        ignoreFocusOut: true,
      }
    );

    return result || null;
  }

  private async lookUpItem(itemName: string): Promise<VaultItem | null> {
    let data: string;

    try {
      data = execute(['op', 'item', 'get', `"${itemName}"`, '--format json']);
    } catch (error) {
      window.showErrorMessage(
        "There was a problem looking up the vault item. Maybe it doesn't exist?"
      );
      return null;
    }

    return JSON.parse(data) as VaultItem;
  }

  private async getValue(key: string): Promise<string | null> {
    const itemName = await this.requestItemName(key);
    if (!itemName) {
      window.showErrorMessage('No vault item name provided, aborting.');
      return null;
    }

    const item = await this.lookUpItem(itemName);
    if (!item) {
      return null;
    }

    const fieldsWithValues = item.fields.filter((field) =>
      Boolean(field.value)
    );
    if (fieldsWithValues.length === 0) {
      window.showErrorMessage(
        "The vault item you chose doesn't have any fields with values."
      );
      return null;
    }

    const fieldName = await this.requestFieldName(fieldsWithValues);
    if (!fieldName) {
      window.showErrorMessage('No field selected, aborting.');
      return null;
    }

    this.itemNames[key] = itemName;

    return item.fields.find((field) => field.label === fieldName)?.value;
  }
}

export const opSettings = new OPSettings();
