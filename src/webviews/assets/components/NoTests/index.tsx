import React from 'react';
import { l } from '../../lib/utils';
import CTAButton from '../CTAButton';

const NoTests = (): JSX.Element => {
  return (
    <div className="no-tests">
      <h3>
        {l('noTestMetadataTitle', `This Job doesn't have any test metadata.`)}
      </h3>
      <p>
        {l(
          'noTestMetadataExplain',
          `You can set up test metadata collection by setting the store_test_results key in your config.`
        )}
      </p>
      <p>
        <CTAButton
          text={l('metadataLink', 'Learn more')}
          href="https://circleci.com/docs/2.0/collect-test-data/"
        />
      </p>
    </div>
  );
};

export default NoTests;
