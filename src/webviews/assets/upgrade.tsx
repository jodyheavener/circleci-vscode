import React from 'react';
import { render } from 'react-dom';
import Upgrade from './components/Upgrade';

// @ts-ignore
const vscode = acquireVsCodeApi() as any;
const rootElement = document.getElementById('root')!;

render(
  <React.StrictMode>
    <Upgrade {...{ vscode }} />
  </React.StrictMode>,
  rootElement
);
