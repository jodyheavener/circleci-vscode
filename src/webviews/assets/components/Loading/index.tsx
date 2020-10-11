import React from 'react';
import CircleLogo from './logo.svg';
import { l } from '../../lib/utils';
import './index.scss';

const Loading = (): JSX.Element => {
  return (
    <div className="loading-container">
      <CircleLogo />
      <p>{l('loadingLabel', 'Loading...')}</p>
    </div>
  );
};

export default Loading;
