import React, { Component } from 'react'
import Deliverable from './Deliverables.js'

export default class Dashboard extends Component {
  state = {
    ThingsYouWillGet: [
      1,
      2,
      3,
      {
        title: 'thingy',
        from: 'josh',
        due: 'tomorrow',
        link: 'http://localhost:3000/dashboard',
        ready: true
      }
    ],
    ThingsYouNeedToDo: [
      {
        title: 'stuffs',
        from: 'josh',
        due: 'tomorrow',
        link: 'http://localhost:3000/dashboard',
        ready: true
      }
    ]
  }
  render() {
    const ThingsYouWillGet = this.state.ThingsYouWillGet.map((item, index) =>
      <Deliverable
        key={index}
        ready={item.ready}
        title={item.title}
        from={item.from}
        due={item.due}
      />
    )

    const ThingsYouNeedToDo = this.state.ThingsYouNeedToDo.map((item, index) =>
      <Deliverable
        key={index}
        ready={item.ready}
        title={item.title}
        from={item.from}
        due={item.due}
      />
    )
    return (
      <div className="mw6 center tc">
        <p className="f4 tc mv3">Things you will get...</p>
        <div className="pv3">
          {ThingsYouWillGet}
        </div>
        <p className="f4 tc mv3">Things you need to do...</p>
        <div className="pv3">
          {ThingsYouNeedToDo}
        </div>
        <button className="link dim dib f6 button-reset bg-white ba b--black-10 dim pointer pv1 black-60 mv5">
          Add a New Thing
        </button>
      </div>
    )
  }
}
