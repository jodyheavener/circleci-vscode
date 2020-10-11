import React from 'react';
import { render } from 'react-dom';
import JobTests from './components/JobTests';

// @ts-ignore
const vscode = acquireVsCodeApi() as any;
const rootElement = document.getElementById('root')!;
const rootPath = rootElement.dataset.rootPath!;

render(
  <React.StrictMode>
    <JobTests {...{ vscode, rootPath }} />
  </React.StrictMode>,
  rootElement
);
