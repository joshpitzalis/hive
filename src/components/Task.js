import React from 'react'
import PropTypes from 'prop-types'
import Upload from './Upload'
import { Card, Button } from '@shopify/polaris'

const Deliverable = ({
  ready,
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
      <div className="flex">
        {ready ? (
          <span
            className={`br-100 bg-yellow h2 w2 db pointer bg-gold`}
            title="Click to Archive"
            onClick={() => handleArchive(taskId)}
          />
        ) : (
          <span className="br-100 bg-black h2 w2 db" />
        )}

        <h2 className="pl4">
          You asked {client || 'Someone'} to do this by {due || 'sometime'}.
        </h2>
      </div>
      {ready && (
        <Button>
          {file ? (
            <a href={file} download className="link">
              Download
            </a>
          ) : (
            <a href={url} target="_blank" className="link">
              Open
            </a>
          )}
        </Button>
      )}
    </Card>
  )
}

Deliverable.propTypes = {
  title: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  due: PropTypes.string.isRequired
}
Deliverable.defaultProps = {
  title: 'Thing',
  from: 'Someone',
  due: 'Sometime'
}

export default Deliverable
