import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAhIHvflS-grlLibEscfFI6WpXO1yiE6Pg",
    authDomain: "qoosball.firebaseapp.com",
    databaseURL: "https://qoosball.firebaseio.com",
    projectId: "qoosball",
    storageBucket: "qoosball.appspot.com",
    messagingSenderId: "892090921294"
};

firebase.initializeApp(config);

firebase.auth().signInAnonymously().catch(function (error) {
    // const errorCode = error.code;
    // const errorMessage = error.message;
    console.error('firebase', error);
});
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log('firebase', 'as anonymous', user.id)
    } else {
        console.log('firebase', 'logged out')
    }
});

const getUserByTrigram = (trigram) => {
    return new Promise(function (resolve, reject) {
        firebase.database().ref().child('users').orderByChild('trigram').equalTo(trigram).once('value', snapshot => {
            const userCount = Object.keys(snapshot.val()).length;
            resolve((userCount === 1) ? snapshot.val() : null);
        });
    });
};

const writeUserData = (trigram, name, dominantHand, nationality, race, slackId) => {
    return getUserByTrigram(trigram).then(user=>{
        if(typeof user === null){
            const userId = firebase.database().ref().child('users').push().key;
            return firebase.database().ref('users/' + userId).set({
                trigram: trigram,
                name: name,
                dominantHand: dominantHand,
                nationality: nationality,
                race: race,
                slackId: slackId
            });
        }else{
            console.warn('error user already exists');
            return null;

        }
    });
}
// writeUserData('aaz', 'Aiham', 'right', 'Jamaican', 'Elf', 'aihazm');

export {
    firebase,
    writeUserData
};