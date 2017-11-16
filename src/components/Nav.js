import React from 'react'
import PropTypes from 'prop-types'
import { logout } from '../helpers/auth'
import { Link } from 'react-router-dom'
import realsieLogo from '../styles/images/realsies.png'
import { Button, ActionList, Popover } from '@shopify/polaris'
import { withState, setPropTypes } from 'recompose'

const Nav = ({ authed }) => (
  <header className="w-100">
    <nav className="flex mxb cxc w-100 pa4">
      <Link to={authed ? '/dashboard' : '/'} className="link dim white f2 pa3">
        <img src={realsieLogo} alt="hive logo" height="50px" />
      </Link>
      <div>{authed && <Settings />}</div>
    </nav>
  </header>
)

const Settings = withState(
  'open',
  'toggleOpen',
  false
)(({ open, toggleOpen }) => (
  <Popover
    active={open}
    activator={
      <Button
        icon={open ? 'caretUp' : 'caretDown'}
        onClick={() => toggleOpen(!open)}
      />
    }
  >
    <ActionList
      items={[
        {
          content: 'Settings',
          url: '/settings'
        },
        {
          content: 'Dashboard',
          url: '/dashboard'
        },
        {
          content: 'Logout',
          onAction: () => logout()
        }
      ]}
    />
  </Popover>
))

export default setPropTypes({ authed: PropTypes.bool })(Nav)
