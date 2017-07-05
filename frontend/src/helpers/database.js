import { firebaseAuth, ref } from '../constants/firebase.js'

export function createNewTask (deliverable, client, deadline) {
  ref.child(`users/${firebaseAuth().currentUser.uid}/tasks`).push({deliverable: deliverable, client: client, deadline: deadline}).catch(error => console.error(error))
}
