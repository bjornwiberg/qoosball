import React, { Component } from 'react';
import './Field.css';
import { getUsers as getUsersFromFirebase, startGame, getOrCreateTeam } from './firebase';

class Field extends Component {

  // TODO:
  // 1. swap places button
  // 2. add goal / own goal buttons
  // 3. Timer


  constructor(props) {
    super(props);

    this.playerChanged = this.playerChanged.bind(this);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.getAvailableUsers = this.getAvailableUsers.bind(this);
    this.getNameForPosition = this.getNameForPosition.bind(this);
    this.getTrigramForPosition = this.getTrigramForPosition.bind(this);
    this.isPositionTaken = this.isPositionTaken.bind(this);
    this.unlockPosition = this.unlockPosition.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  async componentDidMount() {
    await getUsersFromFirebase(this.fetchUsers);
  }

  state = {
    gameStarted: false,
    playerPositions: {},
    selectedPlayers: [],
    team1: {
      id: 1,
      score: 0,
      player1: 'Aiham',
      player2: 'Jonas'
    },
    team2: {
      id: 2,
      score: 9,
      player1: 'Rikard',
      player2: 'Björn'
    },
    users: [],
  };

  fetchUsers(data) {
    const users = Object.keys(data).map(key => data[key]);
    this.setState({ users });
  }

  unlockPosition(positionKey) {
    let { playerPositions, selectedPlayers } = this.state;
    const trigram = playerPositions[positionKey];
    const idx = selectedPlayers.indexOf(trigram);

    if (idx > -1) {
      selectedPlayers.splice(idx, 1);
    }
    delete playerPositions[positionKey];
    this.setState({ playerPositions, selectedPlayers });
  }

  playerChanged(e, team, position) {
    let { playerPositions, selectedPlayers } = this.state;
    const { target: { value: trigram } } = e;
    const key = `${team}${position}`;

    if (this.isPositionTaken(key)) {
      this.unlockPosition(key);
    }

    if (trigram !== '') {
      playerPositions = {
        ...playerPositions,
        [key]: trigram,
      };
      selectedPlayers.push(trigram);
    }

    this.setState({ playerPositions, selectedPlayers });
  }

  isPositionTaken(key) {
    const { playerPositions } = this.state;
    return (playerPositions.hasOwnProperty(key));
  }

  getAvailableUsers() {
    const { selectedPlayers, users } = this.state;
    return users.filter(({ trigram }) => !selectedPlayers.includes(trigram));
  }

  getNameForPosition(team, position) {
    const key = `${team}${position}`;
    const { playerPositions, users } = this.state;
    let name = 'Select player';

    if (this.isPositionTaken(key)) {
      const trigram = playerPositions[key];
      ({ name } = users.find(user => user.trigram === trigram));
    }

    return name;
  }

  getTrigramForPosition(team, position) {
    const key = `${team}${position}`;
    const { playerPositions } = this.state;
    return this.isPositionTaken(key) ? playerPositions[key] : null;
  }


  getTeamPositionSelection(team, position) {
    const player = this.getNameForPosition(team, position);
    return (
      <div className="player">
        <select className={`${team === 1 ? 'left team1' : 'right team2'}`} onChange={e => this.playerChanged(e, team, position)} >
          <option value="">{player}</option>
          {this.getAvailableUsers().map(({ name, trigram }) => (
            <option key={trigram} value={trigram}>{name}</option>
          ))}
        </select>
        {this.isPositionTaken(`${team}${position}`) && <span className="unlock" onClick={() => this.unlockPosition(`${team}${position}`)}>X</span>}
      </div>
    );
  }

  getTeam(team, player1, player2) {
    return (
      <div className={`team ${team === 1 ? 'left team1' : 'right team2'}`} id="team1">
        {this.getTeamPositionSelection(team, 'first')}
        <div className="swap"></div>
        {this.getTeamPositionSelection(team, 'second')}
      </div>
    );
  }

  async startGame() {
    this.setState({ gameStarted: true });
    try {
      const team1 = await getOrCreateTeam(this.getTrigramForPosition(1, 'first'), this.getTrigramForPosition(1, 'second'));
      const team2 = await getOrCreateTeam(this.getTrigramForPosition(2, 'first'), this.getTrigramForPosition(2, 'second'));
      if (team1 && team2) {
        this.setState({ gameId: await startGame({side: 'orange', teamId1: Object.keys(team1)[0], teamId2: Object.keys(team2)[0]}) });
      } else {
        console.error('something is fishy in denmark!');
      }
    } catch (err) {
      console.log(err);
    }
  }

  getStartInfo() {
    const { selectedPlayers, gameStarted } = this.state;
    const content = selectedPlayers.length === 4
      ? <button className="start-button" onClick={this.startGame}>Start game</button>
      : 'Please assign all users to start';

    return gameStarted ? '' : <div className="select-users-info">{content}</div>;
  }

  render() {
    const { team1, team2 } = this.state;
    return (
      <div className="field">
        {this.getTeam(team1.id, team1.player1, team1.player2)}
        <div className="info">
          {this.getStartInfo()}
          <div className="divider"></div>
          <div className="circle" />
          <div className="circle goal-left" />
          <div className="circle goal-right" />
          <div className="score">
            <span className="team2">{team2.score}</span>
            {'   :   '}
            <span className="team1">{team1.score}</span>
          </div>
        </div>
        {this.getTeam(team2.id, team2.player1, team2.player2)}
      </div>
    );
  }
}

export default Field;

