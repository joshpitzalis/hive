import React from 'react';
import PropTypes from 'prop-types';
import { logout } from '../helpers/auth';
import { Link } from 'react-router-dom';
import realsieLogo from '../styles/images/realsies.png';
import { Button } from '@shopify/polaris';

const Nav = ({ authed }) => (
  <header className="w-100">
    <nav className="flex mxb cxc w-100 pa4">
      <Link to={authed ? '/dashboard' : '/'} className="link dim white f2 pa3">
        <img src={realsieLogo} alt="hive logo" height="50px" />
      </Link>
      <div>
        {authed && (
          <Button
            data-test="logoutButton"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Button>
        )}
      </div>
    </nav>
  </header>
);

Nav.propTypes = {};
Nav.defaultProps = {};

export default Nav;
