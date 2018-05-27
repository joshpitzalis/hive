import firebase from 'firebase';

// global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const config =
  process.env.NODE_ENV === 'production'
    ? {
      apiKey: 'AIzaSyAYYCTRCFkNeNxqCilib1CjieSNHtZaHMY',
      authDomain: 'hive-3027b.firebaseapp.com',
      databaseURL: 'https://hive-3027b.firebaseio.com',
      projectId: 'hive-3027b',
      storageBucket: 'hive-3027b.appspot.com',
      messagingSenderId: '382369785948',
    }
    : {
      apiKey: 'AIzaSyAjGTOHeeIKLa0_dSjTNQh3cxFVgOSw__8',
      authDomain: 'notforrealsies-f5b75.firebaseapp.com',
      databaseURL: 'https://notforrealsies-f5b75.firebaseio.com',
      projectId: 'notforrealsies-f5b75',
      storageBucket: 'notforrealsies-f5b75.appspot.com',
      messagingSenderId: '521873201284',
    };

firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;
export const storage = firebase.storage();
export const auth = firebase.auth();
