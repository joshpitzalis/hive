import React, { Component } from 'react'
import Task from './tasks/Sent'
import Pending from './tasks/Pending'
import Deliverable from './tasks/Deliverable'
import Add from './modals/Add'
import Upload from './modals/Upload'
import { firebaseAuth, ref } from '../constants/firebase.js'
import { Button, DisplayText } from '@shopify/polaris'

export default class Dashboard extends Component {
  state = {
    add: false,
    deliver: false,
    pendingTasks: null,
    tasksYouSent: null
  }

  componentDidMount() {
    // this.getTasksINeedToDo()
    this.getTasksSent()
    this.getPendingTasks()
  }

  toggleAddModal = () => {
    this.setState({ add: !this.state.add })
  }

  toggleUploadModal = () => {
    this.setState({ deliver: !this.state.deliver })
  }

  // getTasksINeedToDo = () => {
  //   ref
  //     .child(`/users/${firebaseAuth().currentUser.uid}/tasks`)
  //     .on('value', snap => this.setState({ thingsYouNeedToDo: snap.val() }))
  // }

  getTasksSent = () => {
    ref
      .child(`/users/${firebaseAuth().currentUser.uid}/sent`)
      .on('value', snap => this.setState({ tasksYouSent: snap.val() }))
  }

  getPendingTasks = () => {
    ref
      .child(`/users/${firebaseAuth().currentUser.uid}/pending`)
      .on('value', snap => this.setState({ pendingTasks: snap.val() }))
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
      this.state.tasksYouSent &&
      Object.values(this.state.tasksYouSent).map(task => (
        <Task
          key={task.taskId}
          declined={task.declined}
          title={task.deliverable}
          client={task.client}
          due={task.deadline}
          taskId={task.taskId}
          file={task.file}
          url={task.url}
          handleArchive={this.handleArchive}
        />
      ))

    const PendingTasks =
      this.state.pendingTasks &&
      Object.values(this.state.pendingTasks).map(task => (
        <Pending
          key={task.taskId}
          title={task.title}
          from={task.from}
          due={task.deadline}
          taskId={task.taskId}
          createdAt={task.createdAt}
        />
      ))

    // const ThingsYouNeedToDo =
    //   this.state.thingsYouNeedToDo &&
    // Object.values(this.state.thingsYouNeedToDo).map(task => (
    //     <Deliverable
    //       key={task.taskId}
    // ready={task.ready}
    // title={task.deliverable}
    // client={task.client}
    // due={task.deadline}
    // taskId={task.taskId}
    // file={task.file}
    // url={task.url}
    // handleArchive={this.handleArchive}
    //     />
    //   ))
    return (
      <div className="mw8 center tc">
        {this.state.add && <Add closeAddModal={this.toggleAddModal} />}
        <Button
          data-test="createTask"
          primary
          size="large"
          onClick={this.toggleAddModal}
        >
          Send Someone A Realsie
        </Button>
        <br />
        <br />

        {/* {this.state.deliver &&
        <Upload closeUploadModal={this.toggleUploadModal} />} */}
        {/* <div className="pv3">{ThingsYouWillGet}</div> */}
        {PendingTasks && (
          <section>
            <DisplayText size="extraLarge">
              You have been Asked To...
            </DisplayText>
            <div className="pv3">{PendingTasks}</div>
          </section>
        )}

        <br />
        <br />
        {TasksYouSent && <DisplayText size="extraLarge">Sent</DisplayText>}
        <div className="pv3">{TasksYouSent}</div>
      </div>
    )
  }
}
