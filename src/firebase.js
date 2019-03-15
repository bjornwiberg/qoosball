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
/** Users */
const getUsers = (callback) => {
    if (callback && typeof callback === 'function') {
        firebase.database().ref().child('users').on('value', data => {
            callback(data.val());
        });
    }
    return new Promise(function (resolve) {
        firebase.database().ref().child('users').once('value', data => {
            resolve(data.val());
        });
    });
}

const getUserByTrigram = (trigram) => {
    return new Promise(function (resolve) {
        firebase.database().ref().child(`users/${trigram}`).once('value', snapshot => {
            resolve(snapshot.val());
        });
    });
};

const writeUserData = (trigram, name, dominantHand, nationality, race, slackId) => {
    return getUserByTrigram(trigram).then(user => {
        if (user === null) {
            return firebase.database().ref('users/' + trigram).set({
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

/** Teams **/
const getTeams = () => {
    return new Promise(resolve => {
        firebase.database().ref().child('teams').once('value', (snapshot) => {
            resolve(snapshot.val());
        });
    });
};

const getTeamById = (teamId) => {
    return new Promise(resolve => {
        firebase.database().ref().child(`teams/${teamId}`).once('value', (snapshot) => {
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
/** Games */
const startGame = ({ side, teamId1, teamId2 }) => {
    const gameId = firebase.database().ref().child('games').push().key;
    return firebase.database().ref('games/' + gameId).set({
        side,
        teamId1,
        teamId2,
        start: Date.now(),
        finish: ''
    }).then(gameId);
};

const finishGame = (gameId) => {
    return firebase.database().ref('games/' + gameId).update({
        finish: Date.now()
    });
};

const getGame = (gameId) => {
    return new Promise(resolve => {
        return firebase.database().ref('games/' + gameId).once('value', data => {
            resolve(data.val())
        });
    });
}

/** Goals */
const setGoal = ({ trigram, gameId, position }) => {
    return firebase.database().ref('games/' + gameId).set({
        trigram,
        gameId,
        timestamp: Date.now(),
        position
    });
}

const getGameGoals = (gameId) => {
    return new Promise(resolve => {
        firebase.database().ref('goals').orderByChild('gameId').equalTo(gameId).once('value', data => {
            resolve(data.val())
        });
    });
};

const getScore = (gameId) => {
    getGame(gameId).then(game => {
        if (!game) {
            console.log('invalid game');
            return null;
        }
        Promise.all([getGameGoals(gameId), getTeamById(game.teamId1), getTeamById(game.teamId2)]).then(res => {
            const allGameGoals = res[0];
            const team1 = [res[1].trigram1, res[1].trigram1];
            const team2 = [res[2].trigram1, res[2].trigram1];
            const score = {};
            score[game.teamId1] = [];
            score[game.teamId2] = [];
            allGameGoals.forEach(goal => {
                if (team1.contains(goal.trigram)) {
                    score[game.teamId1].push(goal);
                } else if (team2.contains(goal.trigram)) {
                    score[game.teamId2].push(goal);
                } else {
                    console.error('Something is fishy in Denmark')
                }
            });
        });
    });
}

export {
    firebase,
    getUsers,
    getUserByTrigram,
    writeUserData,
    getTeams,
    getOrCreateTeam,
    startGame,
    finishGame,
    setGoal,
    getScore,
};