import React, { Component } from 'react'
import Task from './tasks/Sent'
import Pending from './tasks/Pending'
import Active from './tasks/Active'
import Deliverable from './tasks/Deliverable'
import Add from './modals/Add'
import AddCard from './modals/AddCard'
import Upload from './modals/Upload'
import { firebaseAuth, ref } from '../constants/firebase.js'
import { Button, DisplayText } from '@shopify/polaris'

export default class Dashboard extends Component {
  state = {
    add: false,
    deliver: false,
    pendingTasks: null,
    tasksYouSent: null,
    activeTasks: null,
    showCardEntryForm: false,
    taskId: null
  }

  componentDidMount() {
    this.getActiveTasks()
    this.getTasksSent()
    this.getPendingTasks()
  }

  toggleAddModal = () => {
    this.setState({ add: !this.state.add })
  }

  toggleAddCardModal = () => {
    this.setState({ showCardEntryForm: !this.state.showCardEntryForm })
  }

  toggleUploadModal = () => {
    this.setState({ deliver: !this.state.deliver })
  }

  getActiveTasks = () => {
    ref
      .child(`/users/${firebaseAuth().currentUser.uid}/active`)
      .on('value', snap => this.setState({ activeTasks: snap.val() }))
  }

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

  handleShowCardEntryForm = taskId => {
    this.setState({ showCardEntryForm: true, taskId })
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
          showCardEntryForm={this.handleShowCardEntryForm}
        />
      ))

    const ActiveTasks =
      this.state.activeTasks &&
      Object.values(this.state.activeTasks).map(task => (
        <Active
          key={task.taskId}
          title={task.title}
          from={task.client}
          due={task.deadline}
          taskId={task.taskId}
          createdAt={task.createdAt}
        />
      ))

    return (
      <div className="mw8 center tc">
        {this.state.add && <Add closeAddModal={this.toggleAddModal} />}
        {this.state.showCardEntryForm && (
          <AddCard
            closeAddCardModal={this.toggleAddCardModal}
            taskId={this.state.taskId}
          />
        )}
        <Button primary size="large" onClick={this.toggleAddModal}>
          Send Someone A Realsie
        </Button>

        {ActiveTasks && (
          <section>
            <br />
            <br />
            <DisplayText size="extraLarge">You Agreed To...</DisplayText>
            <div className="pv4">{ActiveTasks}</div>
          </section>
        )}

        {/* {this.state.deliver &&
        <Upload closeUploadModal={this.toggleUploadModal} />} */}
        {/* <div className="pv3">{ThingsYouWillGet}</div> */}

        {PendingTasks && (
          <section>
            <br />
            <br />
            <DisplayText size="extraLarge">
              You Have Been Asked To...
            </DisplayText>
            <div className="pv4">{PendingTasks}</div>
          </section>
        )}

        {TasksYouSent && (
          <div>
            <br />
            <br />
            <DisplayText size="extraLarge">You Sent...</DisplayText>
            <div className="pv4">{TasksYouSent}</div>
          </div>
        )}
      </div>
    )
  }
}
