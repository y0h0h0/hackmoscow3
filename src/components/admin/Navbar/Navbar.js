import React from 'react';
import { NavLink } from 'react-router-dom';

export default () => {
  return (
    <div className="Navbar">
      <header className="navbar navbar-expand navbar-dark bg-dark flex-column flex-md-row">
        <a className="navbar-brand mr-0 mr-md-2" href="/admin">
          F
        </a>

        <div className="navbar-nav-scroll">
          <ul className="navbar-nav flex-row">
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/">Constructor</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/statisctics">Statistics</NavLink>
            </li>
          </ul>
        </div>

        <NavLink className="btn btn-secondary justify-self-end ml-md-auto" to="/admin/user">
          username
        </NavLink>
      </header>
    </div>
  );
}
