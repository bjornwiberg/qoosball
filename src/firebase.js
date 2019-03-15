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
    return new Promise(function (resolve) {
        firebase.database().ref().child('users').orderByChild('trigram').equalTo(trigram).once('value', snapshot => {
            const res = snapshot.val();
            resolve((res && Object.keys(res).length === 1) ? res : null);
        });
    });
};

const writeUserData = (trigram, name, dominantHand, nationality, race, slackId) => {
    return getUserByTrigram(trigram).then(user => {
        if (user === null) {
            const userId = firebase.database().ref().child('users').push().key;
            return firebase.database().ref('users/' + userId).set({
                trigram: trigram,
                name: name,
                dominantHand: dominantHand,
                nationality: nationality,
                race: race,
                slackId: slackId
            });
        } else {
            console.warn('error user already exists');
            return null;

        }
    });
}

/** Teams
 * 
 */
const getTeams = () => {
    return new Promise(resolve => {
        firebase.database().ref().child('teams').once('value', (snapshot) => {
            resolve(snapshot.val());
        });
    });
};

const getOrCreateTeam = (trigram1, trigram2) => {
    return Promise.all([getUserByTrigram(trigram1), getUserByTrigram(trigram1)]).then(users => { // check if users exists
        if (users[0] && users[1]) {
            return getTeams().then(teams => {
                if (teams && teams.length > 0) {
                    return teams[0];
                }
                const teamId = firebase.database().ref().child('teams').push().key;
                return firebase.database().ref('teams/' + teamId).set({
                    trigram1,
                    trigram2
                });
            });

        } else {
            throw new Error('something is fishy in danemark!');
        }
    });
}

export {
    firebase,
    getTeams,
    getOrCreateTeam,
    writeUserData
};