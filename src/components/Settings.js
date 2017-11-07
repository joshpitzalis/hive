import React from 'react'
import { deleteUser } from '../helpers/auth'

const Settings = (user, authed) => (
  <div className="w-100 h5 flex mxc cxc">
    <button
      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
      onClick={() => deleteUser(user)}
      data-test="deleteUser"
    >
      Delete Your Account
    </button>
  </div>
)

export default Settings
