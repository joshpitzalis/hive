import React, { Component } from 'react'
import Task from './Task.js'

import Add from './Add'
import Upload from './Upload'
import { firebaseAuth, ref } from '../constants/firebase.js'
import { Button, DisplayText } from '@shopify/polaris'

export default class Dashboard extends Component {
  state = {
    add: false,
    deliver: false
  }

  componentDidMount() {
    this.getTasksINeedToDo()
    this.getTasksSent()
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

  getTasksSent = () => {
    ref
      .child(`/users/${firebaseAuth().currentUser.uid}/sent`)
      .on('value', snap => this.setState({ TasksYouSent: snap.val() }))
  }

  // handleArchive = async taskId => {
  //   const task = await ref
  //     .child(`/users/${firebaseAuth().currentUser.uid}/beGiven/${taskId}`)
  //     .once('value')
  //     .then(snap => snap.val())
  //     .catch(error => console.error(error))
  //   ref
  //     .child(`/users/${firebaseAuth().currentUser.uid}/beGiven/${taskId}`)
  //     .remove()
  //     .catch(error => console.error(error))
  //   ref
  //     .child(`/users/${firebaseAuth().currentUser.uid}/archived`)
  //     .push(task)
  //     .catch(error => console.error(error))
  // }

  render() {
    const TasksYouSent =
      this.state.TasksYouSent &&
      Object.values(this.state.TasksYouSent).map(task => (
        <Task
          key={task.taskId}
          ready={task.ready}
          title={task.deliverable}
          client={task.client}
          due={task.deadline}
          taskId={task.taskId}
          file={task.file}
          url={task.url}
          handleArchive={this.handleArchive}
        />
      ))

    // const ThingsYouNeedToDo =
    //   this.state.thingsYouNeedToDo &&
    //   Object.keys(this.state.thingsYouNeedToDo).map(item => (
    //     <Deliverable
    //       key={this.state.thingsYouNeedToDo[item].taskId}
    //       ready={false}
    //       myStuff={true}
    //       title={this.state.thingsYouNeedToDo[item].deliverable}
    //       from={this.state.thingsYouNeedToDo[item].client}
    //       due={this.state.thingsYouNeedToDo[item].deadline}
    //       toggleUploadModal={this.toggleUploadModal}
    //       deliver={this.state.deliver}
    //       taskId={this.state.thingsYouNeedToDo[item].taskId}
    //     />
    //   ))
    return (
      <div className="mw8 center tc">
        <Button data-test="createTask" primary onClick={this.toggleAddModal}>
          Send Someone A Realsie
        </Button>
        {this.state.add && <Add closeAddModal={this.toggleAddModal} />}
        {/* {this.state.deliver &&
        <Upload closeUploadModal={this.toggleUploadModal} />} */}
        {/* <div className="pv3">{ThingsYouWillGet}</div> */}
        <div className="h3" />
        {TasksYouSent && <DisplayText size="extraLarge">Sent</DisplayText>}
        <div className="pv3">{TasksYouSent}</div>
      </div>
    )
  }
}
