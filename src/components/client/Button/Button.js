import React from 'react';
import './Button.scss';

const Button = ({ type, disabled, linkurl, onClick, text, className, tabIndex, minwidth, size = 'medium', icon = '' }) => {

  let classes = [className||''];
  switch(type) {
    case 'secondary': classes.push('secondary'); break;
    case 'ghost': classes.push('ghost'); break;
    default: classes.push('primary');
  }

  if(disabled) classes.push('disabled');
  if(text) classes.push('withText');
  if(icon) classes.push(`withIcon icon_${icon}`); // icon = `icon_${icon}`;}
  if(size) classes.push(`size_${size}`);


  return <div className="c-grButton" onClick={onClick}>
    <div/>
    <div>{text}</div>
    <div/>
  </div>

  //
  // button
  //
  //
  // return <button onClick={onClick} className={`button ${classes.join(' ')}`} style={{minWidth:minwidth||null}} tabIndex={tabIndex} >
  //           {text}
  //         </button>;


}

export default Button;
