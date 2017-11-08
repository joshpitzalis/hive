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
import { withState, lifecycle, compose } from 'recompose'

export default class Dashboard extends Component {
  state = {
    deliver: false,
    showCardEntryForm: false,
    taskId: null,
    deliverableTaskId: null
  }

  toggleAddCardModal = () => {
    this.setState({ showCardEntryForm: !this.state.showCardEntryForm })
  }

  toggleUploadModal = taskId => {
    this.setState({ deliver: !this.state.deliver, deliverableTaskId: taskId })
  }

  handleShowCardEntryForm = taskId => {
    this.setState({ showCardEntryForm: true, taskId })
  }

  render() {
    return (
      <div className="mw8 center tc">
        <SendARealsie
          AddModalIsOpen={this.props.AddModalIsOpen}
          toggleAddModal={this.props.toggleAddModal}
        />
        {this.state.showCardEntryForm && (
          <AddCard
            closeAddCardModal={this.toggleAddCardModal}
            taskId={this.state.taskId}
            toggleCheckout={this.toggleCheckout}
          />
        )}
        <PendingTasks handleShowCardEntryForm={this.handleShowCardEntryForm} />
        {this.state.deliver && (
          <Upload
            closeUploadModal={this.toggleUploadModal}
            taskId={this.state.deliverableTaskId}
          />
        )}
        <ActiveTasks toggleUploadModal={this.toggleUploadModal} />
        <TasksYouSent />
      </div>
    )
  }
}

// shows tasks you sent
export const TasksYouSent = lifecycle({
  componentDidMount() {
    ref
      .child(`/users/${firebaseAuth().currentUser.uid}/sent`)
      .on('value', snap => this.setState({ tasks: snap.val() }))
  }
})(({ tasks }) => (
  <div>
    <div>
      <br />
      <br />
      {tasks && <DisplayText size="extraLarge">You Sent...</DisplayText>}
      <div className="pv4">
        {tasks &&
          Object.values(tasks).map((task, index) => (
            <Task
              key={index}
              declined={task.declined}
              title={task.deliverable}
              client={task.client}
              due={task.deadline}
              taskId={task.taskId}
              file={task.file}
              url={task.url}
              accepted={task.accepted}
              ready={task.ready}
            />
          ))}
      </div>
    </div>
  </div>
))

// shows active tasks
export const ActiveTasks = lifecycle({
  componentDidMount() {
    ref
      .child(`/users/${firebaseAuth().currentUser.uid}/active`)
      .on('value', snap => this.setState({ tasks: snap.val() }))
  }
})(({ tasks, toggleUploadModal }) => (
  <section>
    <br />
    <br />
    {tasks && <DisplayText size="extraLarge">You Agreed To...</DisplayText>}
    <div className="pv4">
      {tasks &&
        Object.values(tasks).map((task, index) => (
          <Active
            key={index}
            title={task.title}
            from={task.client}
            due={task.due}
            taskId={task.taskId}
            createdAt={task.createdAt}
            ready={task.ready}
            toggleUploadModal={toggleUploadModal}
            archived={task.archived}
          />
        ))}
    </div>
  </section>
))

// shows pending tasks
export const PendingTasks = lifecycle({
  componentDidMount() {
    ref
      .child(`/users/${firebaseAuth().currentUser.uid}/pending`)
      .on('value', snap => this.setState({ pendingTasks: snap.val() }))
  }
})(({ tasks, handleShowCardEntryForm }) => (
  <section>
    <br />
    <br />
    {tasks && (
      <DisplayText size="extraLarge">You Have Been Asked To...</DisplayText>
    )}
    <div className="pv4">
      {tasks &&
        Object.values(this.state.pendingTasks).map(task => (
          <Pending
            key={task.taskId}
            title={task.title}
            from={task.from}
            due={task.deadline}
            taskId={task.taskId}
            createdAt={task.createdAt}
            showCardEntryForm={handleShowCardEntryForm}
          />
        ))}
    </div>
  </section>
))

// this component shows a create realsie modal
export const SendARealsie = withState(
  'AddModalIsOpen',
  'toggleAddModal',
  false
)(({ AddModalIsOpen, toggleAddModal }) => (
  <div>
    {AddModalIsOpen && (
      <Add closeAddModal={() => toggleAddModal(!AddModalIsOpen)} />
    )}

    <Button
      primary
      size="large"
      onClick={() => toggleAddModal(!AddModalIsOpen)}
    >
      Send Someone A Realsie
    </Button>
  </div>
))
