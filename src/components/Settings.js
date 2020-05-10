/* eslint-disable */
import React from 'react'
import { Card, Layout, Banner } from '@shopify/polaris'
import { firebaseAuth } from '../constants/firebase.js'
import { compose, withState } from 'recompose'

// responsible for displaying settings
const Settings = () => (
  <Layout>
    <Layout.Section>
      <ResetPassword />
      <br />
      <DeleteAccount />
    </Layout.Section>
  </Layout>
)

const enhance = compose(withState('value', 'updateValue', false))

const ResetPassword = enhance(({ value, updateValue }) => (
  <section>
    {firebaseAuth().currentUser &&
      value && (
        <Banner
          title={`Your password reset email has been sent to ${firebaseAuth()
            .currentUser.email}`}
          status="success"
        />
      )}
    <br />
    {firebaseAuth().currentUser && (
      <Card
        title={`Reset password for ${firebaseAuth().currentUser.email}`}
        primaryFooterAction={{
          content: 'Reset Password',
          onAction: () =>
            firebaseAuth()
              .sendPasswordResetEmail(firebaseAuth().currentUser.email)
              .then(() => {
                console.log('Email sent.')
                updateValue(true)
              })
              .catch(error => console.error(error))
        }}
      >
        <Card.Section>
          <p>You will recieve an email with password reset instructions.</p>
        </Card.Section>
      </Card>
    )}
  </section>
))

const enhanced = compose(withState('value', 'updateValue', false))

const DeleteAccount = enhanced(({ value, updateValue }) => (
  <section>
    {firebaseAuth().currentUser &&
      value && (
        <Banner
          title={`This operation is sensitive and requires that you logout and then log back in again to prove your identity.`}
          status="critical"
        />
      )}
    <br />
    {firebaseAuth().currentUser && (
      <Card
        title="Delete Your Account"
        primaryFooterAction={{
          content: 'Delete',
          icon: 'delete',
          destructive: true,
          onAction: () => {
            firebaseAuth()
              .currentUser.delete()
              .then(() => {
                console.log('Account deleted Successfully.')
              })
              .catch(error => {
                console.error(error)
                updateValue(true)
              })
          }
        }}
      >
        <Card.Section>
          <p>
            Deleting your account will delete all of your data on our system.
            The operation is irreversable.
          </p>
        </Card.Section>
      </Card>
    )}
  </section>
))

export default Settings

// // responsible for handling password form data
// const enhance = compose(
//   withState('currentPassword', 'updateCurrentPassword', ''),
//   withState('newPassword', 'updateNewPassword', ''),
//   withState('confirmPassword', 'updateConfirmPassword', ''),
//   withState('data', 'updateData', ''),
//   withHandlers({
//     changeCurrent: props => event => {
//       props.updateCurrentPassword(event)
//     },
//     changeNew: props => event => {
//       props.updateNewPassword(event)
//     },
//     changeConfirm: props => event => {
//       props.updateConfirmPassword(event)
//     },
//     onSubmit: props => event => {
//       event.preventDefault()
//       console.log({
//         currentPassword: props.currentPassword,
//         newPassword: props.newPassword,
//         confirmPassword: props.confirmPassword
//       })

//       user
//         .updatePassword(props.confirmPassword)
//         .then(() => console.log(' password update Update successful.'))
//         .catch(error => console.log('password update not  successful.'))
//     }
//   })
// )

// // responsible for showing password change form
// const PasswordForm = enhance(
//   ({
//     currentPassword,
//     changeCurrent,
//     newPassword,
//     changeNew,
//     confirmPassword,
//     changeConfirm,
//     onSubmit
//   }) => (
//     <Card title="Change your password" sectioned>
//       <FormLayout>
//         <TextField
//           type="text"
//           label="Current Password"
//           error={null}
//           value={currentPassword}
//           onChange={changeCurrent}
//         />

//         <TextField
//           type="password"
//           label="New Password"
//           error={null}
//           value={newPassword}
//           onChange={changeNew}
//         />

//         <TextField
//           type="password"
//           label="Confirm New Password"
//           error={null}
//           value={confirmPassword}
//           onChange={changeConfirm}
//         />

//         <Button submit onClick={onSubmit}>
//           Change Password
//         </Button>
//       </FormLayout>
//     </Card>
//   )
// )
