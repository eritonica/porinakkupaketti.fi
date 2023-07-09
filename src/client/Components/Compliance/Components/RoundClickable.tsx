import React from 'react';

import './RoundClickable.css';

interface Props {
  style?: React.CSSProperties;
  children?: React.ReactNode | React.ReactNode[];
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

export const RoundClickable: React.FC<Props> = (props) => {
  return (
    <div id="RoundClickable" style={props.style} onClick={props.onClick}>
      { props.children }  
    </div>
  );
};
