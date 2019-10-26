import React from 'react';
import './Input.scss';


// import { getIntAsString, getFloatAsString } from 'core/functions';

const Input = (props) => {
  const getFocus = (e) => {
    if(e.target.tagName === 'DIV') e.target.getElementsByTagName('INPUT')[0].focus();
  }

  const handleChange = (e) => {
    // let newVal = e.target.value;
    // switch(props.valueType) {
    //   case 'int':
    //       newVal = getIntAsString(newVal);
    //       break;
    //   case 'float':
    //       newVal = getFloatAsString(newVal);
    //       break;
    // }
    props.onChange(e.target.value)
  }

  const handleKeyPress = (e) => {
    if(e.key === 'Enter' && props.onSubmit) props.onSubmit();
  }

  let kind = props.kind || 'default';
  let size = props.size || 'medium';

  return <div className={`c-input size_${size}`} onClick={getFocus}>
    <input
			className={`${ props.icon ? `withIcon icon-${props.icon}` : '' } kind-${kind} size-${size}`}
			type={props.type||'text'}
			value={props.value}
			onChange={handleChange}
			placeholder={props.placeholder}
			tabIndex={props.tabIndex}
			autoFocus={props.autoFocus}
      maxLength={props.maxLength}
      onKeyPress={handleKeyPress}
			/>
  </div>

}

export default Input;
