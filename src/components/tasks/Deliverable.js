/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import Upload from '../modals/Upload'
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
  handleArchive,
  pending
}) => {
  return (
    <Card
      title={title}
      sectioned
      primaryFooterAction={{ content: 'Accept' }}
      secondaryFooterAction={{ content: 'Decline' }}
    >
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
          {client || 'Someone'} asked you to do this by {due || 'sometime'}.
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

//
//
// const Deliverable = ({
//   ready,
//   title,
//   from,
//   due,
//   myStuff,
//   toggleUploadModal,
//   deliver,
//   taskId,
//   file,
//   url,
//   handleArchive
// }) => {
//   return (
//     <Card title={title} sectioned className="tl">
//       {deliver && (
//         <Upload
//           toggleUploadModal={toggleUploadModal}
//           clientEmail={from}
//           taskId={taskId}
//         />
//       )}
//       <div className="dtc w2 w3-ns v-mid">
//         {ready ? (
//           <span
//             className={`br-100 bg-yellow h2 w2 db pointer bg-gold`}
//             title="Click to Archive"
//             onClick={() => handleArchive(taskId)}
//           />
//         ) : (
//           <span className="br-100 bg-black h2 w2 db" />
//         )}
//       </div>
//       <div className="dtc v-mid pl3">
//         <h1 className="f6 f5-ns fw6 lh-title black mv0">{title}</h1>
//         {myStuff ? (
//           <h2 className="f6 fw4 mt0 mb0 black-60">
//             Do this for {from || 'Someone'} by {due || 'sometime'}.
//           </h2>
//         ) : (
//           !ready && (
//             <h2 className="f6 fw4 mt0 mb0 black-60">
//               {from || 'Someone'} will do this for you by {due || 'sometime'}.
//             </h2>
//           )
//         )}
//       </div>
//
//       <div className="dtc v-mid">
//         <div className="w-100 tr">
//           {ready && (
//             <button className="f6 button-reset bg-white ba b--black-10 dim pointer pv1 black-60">
//               {file ? (
//                 <a href={file} download className="link">
//                   Download
//                 </a>
//               ) : (
//                 <a href={url} target="_blank" className="link">
//                   Open
//                 </a>
//               )}
//             </button>
//           )}
//           {myStuff && (
//             <button
//               className="f6 button-reset bg-white ba b--black-10 dim pointer pv1 black-60"
//               onClick={toggleUploadModal}
//             >
//               Deliver
//             </button>
//           )}
//         </div>
//       </div>
//     </Card>
//   )
// }
