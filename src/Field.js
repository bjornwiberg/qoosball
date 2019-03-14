import React, { Component } from 'react';
import './Field.css';

class Field extends Component {

  // TODO:
  // 1. swap places button
  // 2. add goal / own goal buttons
  // 3. Timer


  constructor(props) {
    super(props);
    this.state = {
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
    };
    this.playerChanged = this.playerChanged.bind(this);
  }

  playerChanged(teamId, player) {
    console.log(teamId, player);
  }

  getTeam(team, player1, player2) {
    return (
      <div className={`team ${team === 1 ? 'left team1' : 'right team2'}`} id="team1">
        <div className="player">
          <select className={`${team === 1 ? 'left team1' : 'right team2'}`} onChange={() => { this.playerChanged(team, player1); }} >
            <option value="">Select player</option>
            <option value={'Aiham'}>{'Aiham'}</option>
            <option value={'Rikard'}>{'Rikard'}</option>
            <option value={'Jonas'}>{'Jonas'}</option>
            <option value = { 'Björn'} > { 'Björn'}</option >
          </select>
        </div>
        <div className="swap"></div>
        <div className="player">
          <select className={`${team === 1 ? 'left team1' : 'right team2'}`} onChange={() => { this.playerChanged(team, player2); }} >
            <option value="">Select player</option>
            <option value={'Aiham'}>{'Aiham'}</option>
            <option value={'Rikard'}>{'Rikard'}</option>
            <option value={'Jonas'}>{'Jonas'}</option>
            <option value={'Björn'} > {'Björn'}</option>
          </select>
        </div>
      </div>
    );
  }

  render() {
    const { team1, team2 } = this.state;
    return (
        <div className="field">
          {this.getTeam(team1.id, team1.player1, team1.player2)}
          <div className="info">
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