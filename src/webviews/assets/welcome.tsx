import React from 'react';
import { render } from 'react-dom';
import Welcome from './components/Welcome';

// @ts-ignore
const vscode = acquireVsCodeApi() as any;
const rootElement = document.getElementById('root')!;

render(
  <React.StrictMode>
    <Welcome {...{ vscode }} />
  </React.StrictMode>,
  rootElement
);
