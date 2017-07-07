import React from 'react'
import PropTypes from 'prop-types'

const Deliverable = ({ ready, title, from, due, myStuff }) =>
  <article className="dt w-100 bb b--black-05 pb2 mt2 tl">
    <div className="dtc w2 w3-ns v-mid">
      {ready
        ? <span className="br-100 bg-yellow h2 w2 db" />
        : <span className="br-100 bg-black h2 w2 db" />}
    </div>
    <div className="dtc v-mid pl3">
      <h1 className="f6 f5-ns fw6 lh-title black mv0">
        {title}
      </h1>
      {!ready &&
        <h2 className="f6 fw4 mt0 mb0 black-60">
          {from || 'Someone'} will send this to you by {due || 'sometime'}.
        </h2>}
    </div>

    <div className="dtc v-mid">
      <form className="w-100 tr">
        {ready &&
          <button
            className="f6 button-reset bg-white ba b--black-10 dim pointer pv1 black-60"
            type="submit"
          >
            Download
          </button>}
        {myStuff &&
          <button
            className="f6 button-reset bg-white ba b--black-10 dim pointer pv1 black-60"
            type="submit"
          >
            Deliver
          </button>}
      </form>
    </div>
  </article>

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
