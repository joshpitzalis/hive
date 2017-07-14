const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

exports.saveUser = functions.auth.user().onCreate(event => {
  const user = event.data
  const email = user.email
  const displayName = user.displayName
  const uid = user.uid

  const newUserRef = admin.database().ref(`/users/${uid}/info`)
  return newUserRef.update({
    uid,
    email,
    created: new Date()
  })
})

exports.sendFileToClient = functions.database
  .ref('/users/{anyUser}/tasks/{task}')
  .onCreate(event => {
    const userEmail = event.data.val().client
    //   // need to serach if account exists
    //   const userAccount = admin
    //     .database()
    //     .ref('/users/{anyUser}/info')
    //     .orderByChild('email')
    //     .equalTo(userEmail)
    //     .once('value')
    //     .then(snap => console.log(snap.val()))
    // })

    admin
      .auth()
      .createUser({
        email: userEmail,
        emailVerified: false,
        password: 'changeme'
      })
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', userRecord)

        admin
          .database()
          .ref(`/users/${userRecord.uid}/beGiven`)
          .push({
            title: 'thingy',
            from: 'josh',
            due: 'tomorrow',
            link: 'http://localhost:3000/dashboard',
            ready: false
          })
          .catch(function(error) {
            console.log('Error pushing task to new user:', error)
          })
      })
      .catch(function(error) {
        console.log('Error creating new user:', error)
      })
  })
