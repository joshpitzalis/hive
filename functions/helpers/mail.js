const functions = require('firebase-functions')
const admin = require('firebase-admin')
// const nodemailer = require('nodemailer')

var mailgun = require('mailgun-js')({
  apiKey: 'key-e97fd64eb5cc24f8466074ddf553e1b9',
  domain: 'www.realsies.com'
})

// var nodemailerMailgun = nodemailer.createTransport(auth)

exports.weeklyEmail = functions.https.onRequest((req, res) => {
  const currentTime = new Date().getTime()
  const lastWeek = currentTime - 604800000
  // 604800000 is one week in milliseconds
  let emails = ['joshpitzalis@gmail.com']

  admin
    .database()
    .ref()
    .child('users/info')
    .orderByChild('created')
    .startAt(lastWeek)
    .once('value')
    .then(snap => {
      snap.forEach(child => {
        const email = child.val().email
        emails.push(email)
      })
      return emails
    })
    .then(emails => {
      console.log('emails', emails)
      const data = {
        from: `hi@realsies.com`,
        bcc: emails.join(),
        subject: 'Thanks for Trying Realsies.',
        text: `I'd love to know how it has been using Realsies over the last week. Any bugs that I should know of? Or features that you would like added?`
      }

      mailgun.messages().send(data, function(error, body) {
        console.log(body)
      })

      // mailgun
      //   .messages()
      //   .send(data)
      //   .then(() => res.send('Email sent'))
      //   .catch(error => res.send(error))
    })
})

// .then(emails => {
//   const mailOptions = {
//     from: `"Hive" <joshpitzalis@gmail.com>`,
//     bcc: emails.join(),
//     subject: 'Thanks for Trying Hive.',
//     text: `I'd love to know how it has been using Hive over the last week. Any serious bugs that I should know of? Or features that you would like added?`
//   }
//   return mailTransport
//     .sendMail(mailOptions)
//     .then(() => {
//       res.send('Email sent')
//     })
//     .catch(error => res.send(error))
// })
// })
