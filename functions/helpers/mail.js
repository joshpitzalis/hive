const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

const mailgun = require('mailgun-js')({
  apiKey: functions.config().mailgunapi.id,
  domain: functions.config().mailgundomian.id,
});

function sendNewChallengeEmail(client, from, deliverable, deadline) {
  const mailOptions = {
    from: 'Realsies <hi@realsies.com>',
    to: client,
  };

  mailOptions.subject = 'You have Been Challenged';
  mailOptions.text = `${from} has challenged you to ${deliverable} by ${deadline}. To accept this challenge login at https://www.app.realsies.com/login with your email and the password 'changeme'.`;

  return mailgun
    .messages()
    .send(mailOptions)
    .then(() => {
      console.log('New welcome email sent to:', client);
    });
}

exports.newChallengeEmail = functions.database
  .ref('users/{uid}/sent/{newChallenge}')
  .onCreate((event) => {
    const {
      client, from, deliverable, deadline,
    } = event.data.val();
    console.log(event.data);
    return sendNewChallengeEmail(client, from, deliverable, deadline);
  });

// exports.weeklyEmail = functions.https.onRequest((req, res) => {
//   const currentTime = new Date().getTime();
//   const lastWeek = currentTime - 604800000;
//   // 604800000 is one week in milliseconds
//   const emails = ['joshpitzalis@gmail.com'];
//
//   admin
//     .database()
//     .ref()
//     .child('users/info')
//     .orderByChild('created')
//     .startAt(lastWeek)
//     .once('value')
//     .then((snap) => {
//       snap.forEach((child) => {
//         const email = child.val().email;
//         emails.push(email);
//       });
//       return emails;
//     })
//     .then((emails) => {
//       console.log('emails', emails);
//       const data = {
//         from: 'hi@realsies.com',
//         bcc: emails.join(),
//         subject: 'Thanks for Trying Realsies.',
//         text:
//           "I'd love to know how it has been using Realsies over the last week. Any bugs that I should know of? Or features that you would like added?",
//       };
//
//       mailgun.messages().send(data, (error, body) => {
//         console.log(body);
//       });
//     });
// });
