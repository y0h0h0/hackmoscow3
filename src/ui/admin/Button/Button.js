import React from 'react';

export default ({
  fullWidth,
  size,
  strict,
  variant,
  ...props
}) => {
  return (
    <button
      className={[
        "btn",
        (fullWidth ? "btn-block" : ''),
        (strict ? "btn-strict" : ''),
        (size === 'small' ? ' btn-sm' : ''),
        (size === 'large' ? ' btn-lg' : ''),
        (variant ? ` btn-${variant}` : ''),
      ].join(' ')}
      type="button"
      {...props}
    />
  );
}
