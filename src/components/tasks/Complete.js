/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { acceptChallenge, declineChallenge } from '../../helpers/crud'

import { Card, Button } from '@shopify/polaris'

const Active = ({
  title,
  due,
  toggleUploadModal,
  deliver,
  taskId,
  from,
  ready,
  timeDelivered,
  createdAt
}) => {
  return (
    <Card
      title={title}
      sectioned
      primaryFooterAction={{
        content: 'Archive',
        onAction: () => console.log('download me')
      }}
      secondaryFooterAction={{
        content: 'Download',
        onAction: () => console.log('achive me')
      }}
    >
      <div className="flex mxc">
        <h2>This was completed on {timeDelivered || 'sometime'}.</h2>
      </div>

      <div className="flex mxc cxc pt3">
        <span className="br-100 bg-black h2 w2" />
        <p data-test="activeTask" className=" pl3">
          Complete
        </p>
      </div>
    </Card>
  )
}

Active.propTypes = {
  title: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  due: PropTypes.string.isRequired
}
Active.defaultProps = {
  title: 'Thing',
  from: 'Someone',
  due: 'Sometime'
}

export default Active
