import React from 'react';
import './index.scss';

const CTAButton = ({
  text,
  href,
  onClick
}: {
  text: string;
  href?: string;
  onClick?: () => void;
}): JSX.Element => {
  if (href) {
    return (
      <a className="cta-button" {...{ href }}>
        {text}
      </a>
    );
  } else {
    return (
      <button className="cta-button" {...{ onClick }}>
        {text}
      </button>
    );
  }
};

export default CTAButton;
