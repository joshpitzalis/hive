import React from 'react'
import PropTypes from 'prop-types'
import { acceptChallenge, declineChallenge } from '../../helpers/crud'

import { Card, Button } from '@shopify/polaris'

const Pending = ({
  title,
  due,
  toggleUploadModal,
  deliver,
  taskId,
  from,
  createdAt
}) => {
  return (
    <Card
      title={title}
      sectioned
      primaryFooterAction={{
        content: 'Accept',
        onAction: () => acceptChallenge(taskId, title, from, due, createdAt)
      }}
      secondaryFooterAction={{
        content: 'Decline',
        onAction: () => declineChallenge(taskId)
      }}
    >
      <div className="flex">
        <h2 className="pl4">
          {from || 'Someone'} asked you to do this by {due || 'sometime'}.
        </h2>
      </div>
    </Card>
  )
}

Pending.propTypes = {
  title: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  due: PropTypes.string.isRequired
}
Pending.defaultProps = {
  title: 'Thing',
  from: 'Someone',
  due: 'Sometime'
}

export default Pending
