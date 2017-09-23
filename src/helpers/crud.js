import { firebaseAuth, ref } from '../constants/firebase.js'

export const acceptChallenge = (taskId, title, client, due, createdAt) => {
  const taskData = {
    title,
    client,
    due,
    taskId,
    createdAt
  }
  const pathUpdates = {}
  pathUpdates[
    `users/${firebaseAuth().currentUser.uid}/pending/${taskId}`
  ] = null
  pathUpdates[`pendingTasks/${taskId}`] = null
  pathUpdates[
    `users/${firebaseAuth().currentUser.uid}/active/${taskId}`
  ] = taskData
  pathUpdates[`activeTasks/${taskId}`] = taskData
  ref.update(pathUpdates).catch(error => console.error(error))
}

export const declineChallenge = taskId => {
  const pathUpdates = {}
  pathUpdates[
    `users/${firebaseAuth().currentUser.uid}/pending/${taskId}`
  ] = null
  pathUpdates[`pendingTasks/${taskId}`] = null
  ref.update(pathUpdates).catch(error => console.error(error))
  // cloud function 'challengeDeclined' will then change status to declined for sender, to avoid passing uids around in the client
}

export function createNewTask(deliverable, client, deadline) {
  // create a unique id for the task
  const newTaskKey = ref
    .child(`users/${firebaseAuth().currentUser.uid}/sent`)
    .push().key

  // create the new task data
  const newTask = {
    deliverable,
    client,
    deadline,
    createdAt: Date.now(),
    taskId: newTaskKey,
    from: firebaseAuth().currentUser.email,
    declined: false
  }

  // store task with user
  ref
    .child(`users/${firebaseAuth().currentUser.uid}/sent/${newTaskKey}`)
    .update(newTask)
    .catch(error => console.error(error))

  // store tasks in a list of pending tasks
  ref
    .child(`pendingTasks/${newTaskKey}`)
    .update(newTask)
    .catch(error => console.error(error))

  // ref
  //   .child(`activeTasks/${newTaskKey}`)
  //   .update({
  //     deliverable,
  //     client,
  //     deadline,
  //     createdAt: Date.now(),
  //     taskId: newTaskKey,
  //     from: firebaseAuth().currentUser.email,
  //     ready: false,
  //     userId: firebaseAuth().currentUser.uid,
  //     cardId
  //   })
  //   .catch(error => console.error(error))
}

export function uploadDeliverable(
  file = null,
  url = null,
  taskId,
  timeDelivered = Date.now()
) {
  ref
    .child(`users/${firebaseAuth().currentUser.uid}/tasks`)
    .child(taskId)
    .update({ file, url, timeDelivered, ready: true })
    .catch(error => console.error(error))
  ref
    .child(`activeTasks/${taskId}`)
    .remove()
    .catch(error => console.error(error))
}

// export function submitNewCreditCard(
//   number,
//   cvv,
//   exp_month,
//   exp_year,
//   address_zip
// ) {
//   Stripe.card.createToken(
//     {
//       number,
//       cvc,
//       exp_month,
//       exp_year,
//       address_zip
//     },
//     (status, response) => {
//       if (response.error) {
//         this.newCreditCard.error = response.error.message
//       } else {
//         firebase
//           .database()
//           .ref(`/stripe_customers/${this.currentUser.uid}/sources`)
//           .push({ token: response.id })
//           .then(() => {
//             this.newCreditCard = {
//               number: '',
//               cvc: '',
//               exp_month: 1,
//               exp_year: 2017,
//               address_zip: ''
//             }
//           })
//       }
//     }
//   )
// }
