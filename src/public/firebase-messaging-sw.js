importScripts("https://www.gstatic.com/firebasejs/7.12.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.12.0/firebase-messaging.js"
);
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
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png"
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
