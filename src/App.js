import React, { Component } from 'react';
import Field from './Field';
import Registration from './components/Registration';
import './App.css';

import { getUserByTrigram } from './firebase';

function doStuff(userList){
  console.log(userList);
}
getUserByTrigram('aaz').then(data=>{
  console.log(data)
})

class App extends Component {
  render() {
    return (
      <div className="App">
        <Field />
      </div>
    );
  }
}

export default App;
