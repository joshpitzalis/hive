import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button } from '@shopify/polaris'

const Task = ({
  declined,
  title,
  due,
  toggleUploadModal,
  deliver,
  taskId,
  client,
  file,
  url,
  handleArchive
}) => {
  return (
    <Card title={title} sectioned>
      <h2>
        You asked {client || 'Someone'} to do this by {due || 'sometime'}.
      </h2>
      <br />

      {declined ? (
        <div className="flex mxc cxc">
          <span
            className={`br-100 bg-red h2 w2 pointer`}
            title="Click to Archive"
          />
          <p>{`${client} Declined. Click here to archive this task`}</p>
        </div>
      ) : (
        <div className="flex mxc cxc">
          <span className="br-100 bg-gold h2 w2" />
          <p className=" pl3">Awaiting response</p>
        </div>
      )}
    </Card>
  )
}

Task.propTypes = {
  title: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  due: PropTypes.string.isRequired
}
Task.defaultProps = {
  title: 'Thing',
  from: 'Someone',
  due: 'Sometime'
}

export default Task
