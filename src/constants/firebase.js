import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyAYYCTRCFkNeNxqCilib1CjieSNHtZaHMY',
  authDomain: 'hive-3027b.firebaseapp.com',
  databaseURL: 'https://hive-3027b.firebaseio.com',
  projectId: 'hive-3027b',
  storageBucket: 'hive-3027b.appspot.com',
  messagingSenderId: '382369785948'
}
firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth
export const storage = firebase.storage()
export const auth = firebase.auth()
