import React from 'react';

const PlayVoice = ({ onClick, text, className, disabled /* type, disabled, linkurl, onClick, text, className, tabIndex, minwidth, size = 'medium', icon = '' */ }) => {

  let classes = [className||''];

  if(disabled) classes.push('disabled');

  return <div onClick={onClick} className={`PlayVoice ${classes}`}>
            {text}
          </div>;


}

export default Button;
