importScripts('https://www.gstatic.com/firebasejs/4.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.3.0/firebase-messaging.js');

const config = {
    // add firebase info
};
firebase.initializeApp(config);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(payload => {
    const title = "Notification: Obcon Web Push Test";
    const options = {
        body: payload.data.status
    };
    return self.registration.showNotification(title, options);
});