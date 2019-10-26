import React from 'react';
import './Layout.scss';

export default ({ children }) => {
  return (
      <div className="layout">
        <div className="playerField">
          {children}
          <div className="c-notifications" />
        </div>

      </div>
  );
}
