import { firebaseAuth, ref } from '../constants/firebase.js'

export function createNewTask(deliverable, client, deadline, taskId, cardId) {
  const newTaskKey = ref
    .child(`users/${firebaseAuth().currentUser.uid}/tasks`)
    .push().key

  ref
    .child(`users/${firebaseAuth().currentUser.uid}/tasks/${newTaskKey}`)
    .update({
      deliverable,
      client,
      deadline,
      createdAt: Date.now(),
      taskId: newTaskKey,
      from: firebaseAuth().currentUser.email,
      ready: false
    })
    .catch(error => console.error(error))
  ref
    .child(`activeTasks/${newTaskKey}`)
    .update({
      deliverable,
      client,
      deadline,
      createdAt: Date.now(),
      taskId: newTaskKey,
      from: firebaseAuth().currentUser.email,
      ready: false,
      userId: firebaseAuth().currentUser.uid,
      cardId
    })
    .catch(error => console.error(error))
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
