import React, { Component } from 'react';
import './App.css';

class Field extends Component {
  render() {
    return (
        <div className="field">
          <div className="team" id="team1">
            <div className="player">Player 1</div>
            <div className="swap"></div>
            <div className="player">Player 2</div>
          </div>
        </div>
    );
  }
}

export default Field;