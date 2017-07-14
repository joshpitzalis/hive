import { firebaseAuth, ref, auth } from '../constants/firebase.js'

export function createNewTask(deliverable, client, deadline) {
  ref
    .child(`users/${firebaseAuth().currentUser.uid}/tasks`)
    .push({ deliverable: deliverable, client: client, deadline: deadline })
    .catch(error => console.error(error))
}

export function uploadDeliverable(file, url, timestamp, email) {
  ref
    .child(`users/${auth.currentUser.uid}/delivered`)
    .push({ file, url, timestamp, email })
    .catch(error => console.error(error))
}
