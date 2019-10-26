import React from 'react';
import './Layout.scss';

export default ({ children }) => {
  return (
      <div className="hm3_client_layout">

        <div className="central">

          <div className="playerField">
            {children}
          </div>

          <div className="c-notifications" />
          <div className="c-iphone-shadow" />
          <div className="c-iphone-frame" />

        </div>

      </div>
  );
}
