import React from 'react'
import PropTypes from 'prop-types'
import { logout } from '../helpers/auth'
import { Link } from 'react-router-dom'
import hiveLogo from '../styles/images/hive.png'

const Nav = ({ authed }) =>
  <header className='bg-near-black w-100 pv3'>
    <nav className='f6 fw6 ttu tracked flex mxb cxc w-100'>
      <Link to={authed ? '/dashboard' : '/'} className='link dim white f2'>
        <img src={hiveLogo} alt='hive logo' height='50px' />
      </Link>
      <div>
        {authed
          ? <button
            className='link dim dib f6 button-reset bg-white ba b--black-10 dim pointer pv1 black-60'
            onClick={() => {
              logout()
            }}
            >
              Logout
            </button>
          : <span>
            <Link to='/login' className='link dim dib white'>
                Start Here
              </Link>
          </span>}
      </div>
    </nav>
  </header>

Nav.propTypes = {}
Nav.defaultProps = {}

export default Nav
