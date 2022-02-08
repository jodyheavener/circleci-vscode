import '@testing-library/jest-dom';
import { ExtensionContext } from 'vscode';
import extension from '../lib/extension';

export const extensionPath = 'extension-path';
export const context = { extensionPath } as ExtensionContext;

extension.configure(context);
