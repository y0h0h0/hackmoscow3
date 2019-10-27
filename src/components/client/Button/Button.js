import React from 'react';
import './Button.scss';

const Button = ({ onClick, text }) => {

  return <div className="c-grButton" onClick={onClick}>
    <div/>
    <div>{text}</div>
    <div/>
  </div>


}

export default Button;
