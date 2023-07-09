import React from 'react';

import './Selection.css';

interface Props {
  children?: React.ReactNode | React.ReactNode[];
  fixVWScrollbar?: boolean;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

export const Selection: React.FC<Props> = (props) => {
  const scrollbarWidth = window.innerWidth - document.body.clientWidth;
  const style = {
    ...props.style,
    width: window.innerWidth - 10 - scrollbarWidth,
  }
  return (
    <div id="Selection" style={(props.fixVWScrollbar === true) ? style : props.style } onClick={props.onClick}>
      { props.children }  
    </div>
  );
};
