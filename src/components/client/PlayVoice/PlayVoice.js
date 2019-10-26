import React from 'react';
import './PlayVoice.scss';

const PlayVoice = ({ onClick, text, className, disabled /* type, disabled, linkurl, onClick, text, className, tabIndex, minwidth, size = 'medium', icon = '' */ }) => {

  let classes = [className||''];

  if(disabled) classes.push('disabled');

  return <div onClick={onClick} className={`PlayVoice ${classes}`} />

}

export default PlayVoice;
