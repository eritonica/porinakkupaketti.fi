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
  console.log("scrollbarWidth");
  console.log(scrollbarWidth);
  const style = {
    ...props.style,
    maxWidth: window.innerWidth - (scrollbarWidth * 2 + 10) ,
  }
  return (
    <div id="Selection" style={(props.fixVWScrollbar === true) ? style : props.style } onClick={props.onClick}>
      { props.children }  
    </div>
  );
};
