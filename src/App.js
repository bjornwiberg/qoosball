import React, { Component } from 'react';
import Field from './Field';
import Registration from './components/Registration';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Field />
        <Registration />
      </div>
    );
  }
}

export default App;
