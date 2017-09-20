const functions = require('firebase-functions')
const admin = require('firebase-admin')

exports.updateTask = functions.database
  .ref('/users/{anyUser}/tasks/{task}')
  .onUpdate(event => {
    if (event.data.val().ready) {
      admin
        .auth()
        .getUserByEmail(event.data.val().client)
        .then(result =>
          admin
            .database()
            .ref(`/users/${result.uid}/beGiven/${event.data.val().taskId}`)
            .update({
              ready: true,
              file: event.data.val().file || null,
              url: event.data.val().url || null,
              timeDelivered: event.data.val().timeDelivered
            })
            .catch(function(error) {
              console.log('Error updating deliverable for client:', error)
            })
        )
    }
  })

exports.challengeDeclined = functions.database
  .ref(`/users/{anyUser}/pending/{anyTask}`)
  .onDelete(event => {
    console.log('deleted task', event.data.val())
    admin
      .auth()
      .getUserByEmail(event.data.val().from)
      .then(result =>
        admin
          .database()
          .ref(`/users/${result.uid}/sent/${event.data.val().taskId}`)
          .update({
            declined: true
          })
          .catch(error =>
            console.log('Error showing declined to sender', error)
          )
      )
  })
