import React from 'react'
import PropTypes from 'prop-types'
import { logout } from '../helpers/auth'
import { Link } from 'react-router-dom'

const Nav = ({ authed }) =>
  <header className="bg-yellow w-100 pa3">
    <nav className="f6 fw6 ttu tracked flex justify-between items-center">
      <Link
        to={authed ? '/dashboard' : '/'}
        className="link dim near-black f2 black"
      >
        HIVE
      </Link>
      <div>
        {authed
          ? <button
              className="link dim near-black dib"
              onClick={() => {
                logout()
              }}
            >
              Logout
            </button>
          : <span>
              <Link to="/login" className="link dim near-black dib">
                Login
              </Link>
              <Link to="/register" className="link dim near-black dib pl3">
                Register
              </Link>
            </span>}
      </div>
    </nav>
  </header>

Nav.propTypes = {}
Nav.defaultProps = {}

export default Nav
