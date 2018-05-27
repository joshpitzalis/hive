import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@shopify/polaris';

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
  handleArchive,
  accepted,
  ready
}) => {
  return (
    <Card title={title} sectioned>
      <h2>
        You asked {client || 'Someone'} to do this by {due || 'sometime'}.
      </h2>
      <br />
      {ready ? (
        <div className="flex mxc cxc pt3">
          <span className="br-100 bg-black h2 w2" />
          <div className="flex col">
            <p data-test="completeTask" className=" pl3">
              Complete
            </p>
            {url && (
              <a href={url} className=" pl3">
                Go to link
              </a>
            )}
            {file && (
              <a href={file} className=" pl3" download>
                Download
              </a>
            )}
          </div>
        </div>
      ) : accepted ? (
        <div className="flex mxc cxc pt3">
          <span className="br-100 bg-green h2 w2" />
          <p data-test="activeTask" className=" pl3">
            Active
          </p>
        </div>
      ) : declined ? (
        <div className="flex mxc cxc">
          <span
            data-test="taskDeclined"
            className={`br-100 bg-red h2 w2 pointer`}
            title="Click to Archive"
          />
          <p className="pl3">{`${client} Declined.`}</p>
        </div>
      ) : (
        <div className="flex mxc cxc">
          <span className="br-100 bg-gold h2 w2" />
          <p data-test="awaitingResponse" className=" pl3">
            Awaiting response
          </p>
        </div>
      )}
    </Card>
  );
};

Task.propTypes = {
  title: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  due: PropTypes.string.isRequired
};
Task.defaultProps = {
  title: 'Thing',
  from: 'Someone',
  due: 'Sometime'
};

export default Task;
