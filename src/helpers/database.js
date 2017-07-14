import { firebaseAuth, ref } from '../constants/firebase.js'

export function createNewTask(deliverable, client, deadline, taskId) {
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
