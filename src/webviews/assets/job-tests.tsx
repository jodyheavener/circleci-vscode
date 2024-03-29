import React from 'react';
import { render } from 'react-dom';
import JobTests from './components/JobTests';

// @ts-ignore
const vscode = acquireVsCodeApi() as any;
const rootElement = document.getElementById('root')!;

render(
  <React.StrictMode>
    <JobTests {...{ vscode }} />
  </React.StrictMode>,
  rootElement
);
