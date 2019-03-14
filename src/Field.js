import React, { Component } from 'react';
import './Field.css';

class Field extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  goal(player) {

  }

  getTeam(team, player1, player2) {
    return (
      <div className={`team ${team === 1 ? 'left' : 'right'}`} id="team1">
        <div className="player" onClick={this.goal(player1)}>{player1}</div>
        <div className="swap"></div>
        <div className="player" onClick={this.goal(player2)}>{player2}</div>
      </div>
    );
  }

  render() {
    return (
        <div className="field">
          {this.getTeam(1, 'Jonas', 'Aiham')}
          <div className="info">
            <div className="divider"></div>
            <div className="circle" />
            <div className="circle goal-left" />
            <div className="circle goal-right" />
            <div className="score"></div>
          </div>
          {this.getTeam(2, 'Rikard', 'Dragan')}
        </div>
    );
  }
}

export default Field;