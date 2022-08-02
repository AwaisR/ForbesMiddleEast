// [START initialize_firebase_in_sw]
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/7.12.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.12.0/firebase-messaging.js"
);
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
var firebaseConfig = {
  apiKey: "AIzaSyBIzvE_7Ua_kULIjEoJ3ATkgdqgsAOsYeY",
  authDomain: "marioplan-17d32.firebaseapp.com",
  databaseURL: "https://marioplan-17d32.firebaseio.com",
  projectId: "marioplan-17d32",
  storageBucket: "marioplan-17d32.appspot.com",
  messagingSenderId: "188131366408",
  appId: "1:188131366408:web:9af71f7b8a3c4de63923bd"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
// [END initialize_firebase_in_sw]
