import React, { Component } from 'react'
import Deliverable from './Deliverables.js'
import Add from './Add'
import Upload from './Upload'
import { firebaseAuth, ref } from '../constants/firebase.js'

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
    add: false,
    deliver: false
  }

  componentDidMount() {
    this.getTasksINeedToDo()
  }

  toggleAddModal = () => {
    this.setState({ add: !this.state.add })
  }

  toggleUploadModal = () => {
    this.setState({ deliver: !this.state.deliver })
  }

  getTasksINeedToDo = () => {
    ref
      .child(`/users/${firebaseAuth().currentUser.uid}/tasks`)
      .on('value', snap => this.setState({ thingsYouNeedToDo: snap.val() }))
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

    const ThingsYouNeedToDo =
      this.state.thingsYouNeedToDo &&
      Object.keys(this.state.thingsYouNeedToDo).map((item, index) =>
        <Deliverable
          key={index}
          ready={false}
          myStuff={true}
          title={this.state.thingsYouNeedToDo[item].deliverable}
          from={this.state.thingsYouNeedToDo[item].client}
          due={this.state.thingsYouNeedToDo[item].deadline}
          toggleUploadModal={this.toggleUploadModal}
          deliver={this.state.deliver}
        />
      )
    return (
      <div className="mw6 center tc">
        {this.state.add && <Add closeAddModal={this.toggleAddModal} />}
        {/* {this.state.deliver &&
        <Upload closeUploadModal={this.toggleUploadModal} />} */}
        <p className="f4 tc mv3 b">PEOPLE</p>
        <div className="pv3">
          {ThingsYouWillGet}
        </div>
        <p className="f4 tc mv3 b">YOU</p>
        <div className="pv3">
          {ThingsYouNeedToDo}
        </div>
        <button
          className="link dim dib f6 button-reset bg-white ba b--black-10 dim pointer pv1 black-60 mv5"
          onClick={this.toggleAddModal}
        >
          Add a New Thing
        </button>
      </div>
    )
  }
}
