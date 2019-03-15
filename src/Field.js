import React, { Component } from 'react';
import './Field.css';
import { getUsers as getUsersFromFirebase, setGoal, startGame, getOrCreateTeam, getScore } from './firebase';

const INITAL_STATE = {
  gameStarted: false,
  gameId: '',
  gameOver: false,
  playerPositions: {},
  selectedPlayers: [],
  scores: [0, 0],
  team1: {
    id: 1,
    score: 0,
    player1: 'Aiham',
    player2: 'Jonas'
  },
  team2: {
    id: 2,
    score: 0,
    player1: 'Rikard',
    player2: 'Björn'
  },
  users: [],
};
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
    this.getTeamPositionSelection = this.getTeamPositionSelection.bind(this);
    this.getTeam = this.getTeam.bind(this);
    this.swapTeamMembers = this.swapTeamMembers.bind(this);
  }

  async componentDidMount() {
    await getUsersFromFirebase(this.fetchUsers);
  }

  state = {
    ...INITAL_STATE,
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
    let name = position === 'first' ? '1st player' : '2nd player';

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

  async addGoal(data) {
    const { scores: [team1Score, team2Score] } = this.state;
    setGoal({ ...data });
    const score = await getScore(this.state.gameId);
    const team1NewScore = score[Object.keys(score)[0]].length;
    const team2NewScore = score[Object.keys(score)[1]].length;

    if (team1Score === 4 && team1NewScore === 5) {
      this.swapTeamMembers(1)
    }

    if (team2Score === 4 && team2NewScore === 5) {
      this.swapTeamMembers(2)
    }

    const gameOver = (team1Score === 10 === 10 || team2NewScore === 10);

    this.setState({gameOver, scores: [team1NewScore, team2NewScore]});
  }

  getTeamPositionSelection(team, side) {
    const player = this.getNameForPosition(team, side);
    const trigram = this.getTrigramForPosition(team, side);
    const { gameStarted, gameId } = this.state;
    const position = team === 1 ? 'blue' : 'orange';
    const addGoalData = { trigram, gameId, position };
    if (gameStarted) return (
      <div className="player">
        {player}
        <div className="score" onClick={() => this.addGoal(addGoalData)}><span role="img" aria-label="Add score">🥅</span></div>
      </div>
    )

    return (
      <div className="player">
        <select disabled={gameStarted} className={`${team === 1 ? 'left team1' : 'right team2'}`} onChange={e => this.playerChanged(e, team, side)} >
          <option value="">{player}</option>
          {this.getAvailableUsers().map(({ name, trigram }) => (
            <option key={trigram} value={trigram}>{name}</option>
          ))}
        </select>
        {this.isPositionTaken(`${team}${side}`) && <span className="unlock" onClick={() => this.unlockPosition(`${team}${side}`)}>X</span>}
      </div>
    );
  }

  getTeam(team, player1, player2) {
    const { gameStarted } = this.state;
    return (
      <div className={`team ${team === 1 ? 'left team1' : 'right team2'}`} id="team1">
        {this.getTeamPositionSelection(team, 'first')}
        {gameStarted && <div className="swap" onClick={() => this.swapTeamMembers(team)}><span role="img" aria-label="Swap users">🔁</span></div>}
        {this.getTeamPositionSelection(team, 'second')}
      </div>
    );
  }
  swapTeamMembers(team) {
    const { playerPositions } = this.state;
    const firstPlayer = this.getTrigramForPosition(team, 'first');
    const secondPlayer = this.getTrigramForPosition(team, 'second');

    playerPositions[`${team}first`] = secondPlayer;
    playerPositions[`${team}second`] = firstPlayer;

    this.setState({ playerPositions });
  }

  async startGame() {
    try {
      const team1 = await getOrCreateTeam(this.getTrigramForPosition(1, 'first'), this.getTrigramForPosition(1, 'second'));
      const team2 = await getOrCreateTeam(this.getTrigramForPosition(2, 'first'), this.getTrigramForPosition(2, 'second'));
      if (team1 && team2) {
        try {
          const gameId = await startGame({ side: 'orange', teamId1: Object.keys(team1)[0], teamId2: Object.keys(team2)[0] });
          this.setState({ gameId, gameStarted: true });
          const score = await getScore(gameId);
          this.setState({scores: [score[Object.keys(score)[0]].length, score[Object.keys(score)[1]].length]});
        } catch (err) {
          console.log(err);
        }
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

  getGameOverInfo() {
    const { gameOver } = this.state;

    return gameOver && <div className="select-users-info select-users-info__full-page">GAME OVER</div>;
  }

  render() {
    const { team1, team2, scores: [team1Score, team2Score] } = this.state;
    return (
      <div className="field">
        {this.getTeam(team1.id, team1.player1, team1.player2)}
        <div className="info">
          {this.getStartInfo()}
          {this.getGameOverInfo()}
          <div className="divider"></div>
          <div className="circle" />
          <div className="circle goal-left" />
          <div className="circle goal-right" />
          <div className="score">
            <span className="team2">{team1Score}</span>
            {'   :   '}
            <span className="team1">{team2Score}</span>
          </div>
        </div>
        {this.getTeam(team2.id, team2.player1, team2.player2)}
      </div>
    );
  }
}

export default Field;

