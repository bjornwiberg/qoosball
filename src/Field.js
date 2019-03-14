import React, { Component } from 'react';
import './Field.css';

class Field extends Component {

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
        score: 10,
        player1: 'Rikard',
        player2: 'Björn'
      },
    };
  }

  goal(player) {

  }

  getTeam(team, player1, player2) {
    return (
      <div className={`team ${team === 1 ? 'left team1' : 'right team2'}`} id="team1">
        <div className="player" onClick={this.goal(player1)}>{player1}</div>
        <div className="swap"></div>
        <div className="player" onClick={this.goal(player2)}>{player2}</div>
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
              <span className="team2">5</span>
              {'   :   '}
              <span className="team1">7</span>
            </div>
          </div>
        {this.getTeam(team2.id, team2.player1, team2.player2)}
        </div>
    );
  }
}

export default Field;