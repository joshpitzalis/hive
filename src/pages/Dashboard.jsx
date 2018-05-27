import React, { Component } from 'react';
import Task from '../components/tasks/Sent';
import Pending from '../components/tasks/Pending';
import Active from '../components/tasks/Active';
import Add from '../components/modals/Add';
import AddCard from '../components/modals/AddCard';
import Upload from '../components/modals/Upload';
import { firebaseAuth, ref } from '../constants/firebase.js';
import { Button, DisplayText } from '@shopify/polaris';
import { withState, lifecycle } from 'recompose';

export default class Dashboard extends Component {
  state = {
    deliver: false,
    showCardEntryForm: false,
    taskId: null,
    deliverableTaskId: null,
  };

  toggleAddCardModal = () => {
    this.setState({ showCardEntryForm: !this.state.showCardEntryForm });
  };

  toggleUploadModal = taskId => {
    this.setState({ deliver: !this.state.deliver, deliverableTaskId: taskId });
  };

  handleShowCardEntryForm = taskId => {
    this.setState({ showCardEntryForm: true, taskId });
  };

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
          <Upload closeUploadModal={this.toggleUploadModal} taskId={this.state.deliverableTaskId} />
        )}
        <ActiveTasks toggleUploadModal={this.toggleUploadModal} />
        <TasksYouSent />
      </div>
    );
  }
}

export const callTask = ({ user, type }) => ref.child(`/users/${user}/${type}`).once('value');

// shows tasks you sent
export const TasksYouSent = lifecycle({
  componentDidMount() {
    callTask(firebaseAuth().currentUser.uid, 'sent').then(snap =>
      this.setState({ tasks: snap.val() }),
    );
  },
})(({ tasks }) => (
  <div>
    {tasks && (
      <div>
        <br />
        <br />
        <DisplayText size="extraLarge">You Sent...</DisplayText>
        <div className="pv4">
          {Object.values(tasks).map((task, index) => (
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
    )}
  </div>
));

// shows active tasks
export const ActiveTasks = lifecycle({
  componentDidMount() {
    callTask(firebaseAuth().currentUser.uid, 'active').then(snap =>
      this.setState({ tasks: snap.val() }),
    );
  },
})(({ tasks, toggleUploadModal }) => (
  <section>
    {tasks && (
      <div>
        <br />
        <br />
        <DisplayText size="extraLarge">You Agreed To...</DisplayText>
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
      </div>
    )}
  </section>
));

// shows pending tasks
export const PendingTasks = lifecycle({
  componentDidMount() {
    callTask(firebaseAuth().currentUser.uid, 'pending').then(snap =>
      this.setState({ tasks: snap.val() }),
    );
  },
})(({ tasks, handleShowCardEntryForm }) => (
  <section>
    {tasks && (
      <div>
        <br />
        <br />
        {tasks && <DisplayText size="extraLarge">You Have Been Asked To...</DisplayText>}
        <div className="pv4">
          {tasks &&
            Object.values(tasks).map(task => (
              <Pending
                key={task.taskId}
                title={task.title}
                from={task.from}
                due={task.due}
                taskId={task.taskId}
                createdAt={task.createdAt}
                showCardEntryForm={handleShowCardEntryForm}
              />
            ))}
        </div>
      </div>
    )}
  </section>
));

// this component shows a create realsie modal
export const SendARealsie = withState('AddModalIsOpen', 'toggleAddModal', false)(
  ({ AddModalIsOpen, toggleAddModal }) => (
    <div>
      {AddModalIsOpen && <Add closeAddModal={() => toggleAddModal(!AddModalIsOpen)} />}

      <Button primary size="large" onClick={() => toggleAddModal(!AddModalIsOpen)}>
        Send Someone A Realsie
      </Button>
    </div>
  ),
);
