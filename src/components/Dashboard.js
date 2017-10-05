import React, { Component } from 'react';
import Task from './tasks/Sent';
import Pending from './tasks/Pending';
import Active from './tasks/Active';
import Deliverable from './tasks/Deliverable';
import Add from './modals/Add';
import AddCard from './modals/AddCard';
import Upload from './modals/Upload';
import { firebaseAuth, ref } from '../constants/firebase.js';
import { Button, DisplayText } from '@shopify/polaris';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      add: false,
      deliver: false,
      pendingTasks: null,
      tasksYouSent: null,
      activeTasks: null,
      showCardEntryForm: false,
      taskId: null,
      deliverableTaskId: null
    };

    this.toggleAddModal = this.toggleAddModal.bind(this);
  }

  componentDidMount() {
    this.getActiveTasks();
    this.getTasksSent();
    this.getPendingTasks();
  }

  toggleAddModal() {
    this.setState({ add: !this.state.add });
  }

  toggleAddCardModal = () => {
    this.setState({ showCardEntryForm: !this.state.showCardEntryForm });
  };

  toggleUploadModal = taskId => {
    console.log('dog');
    this.setState({ deliver: !this.state.deliver, deliverableTaskId: taskId });
  };

  getActiveTasks = () => {
    ref
      .child(`/users/${firebaseAuth().currentUser.uid}/active`)
      .on('value', snap => this.setState({ activeTasks: snap.val() }));
  };

  getTasksSent = () => {
    ref
      .child(`/users/${firebaseAuth().currentUser.uid}/sent`)
      .on('value', snap => this.setState({ tasksYouSent: snap.val() }));
  };

  getPendingTasks = () => {
    ref
      .child(`/users/${firebaseAuth().currentUser.uid}/pending`)
      .on('value', snap => this.setState({ pendingTasks: snap.val() }));
  };

  handleShowCardEntryForm = taskId => {
    this.setState({ showCardEntryForm: true, taskId });
  };

  render() {
    const TasksYouSent =
      this.state.tasksYouSent &&
      Object.values(this.state.tasksYouSent).map((task, index) => (
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
      ));

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
      ));

    const ActiveTasks =
      this.state.activeTasks &&
      Object.values(this.state.activeTasks).map((task, index) => (
        <Active
          key={index}
          title={task.title}
          from={task.client}
          due={task.deadline}
          taskId={task.taskId}
          createdAt={task.createdAt}
          ready={task.ready}
          toggleUploadModal={this.toggleUploadModal}
          archived={task.archived}
        />
      ));

    return (
      <div className="mw8 center tc">
        {this.state.add && <Add closeAddModal={this.toggleAddModal} />}
        {this.state.showCardEntryForm && (
          <AddCard
            closeAddCardModal={this.toggleAddCardModal}
            taskId={this.state.taskId}
          />
        )}
        {this.state.deliver && (
          <Upload
            closeUploadModal={this.toggleUploadModal}
            taskId={this.state.deliverableTaskId}
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
    );
  }
}
