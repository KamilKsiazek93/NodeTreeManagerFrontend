import React from 'react';
import './App.css';
import { webAPIUrl } from './components/AppSettings';

const App = () => {

  const getData = () => {
    fetch(`${webAPIUrl}/nodes`)
  .then(response => response.json())
  .then(data => console.log(data));
  }

  getData()

  return (
    <div className="App">
      <h1>Tree manager</h1>
    </div>
  );
}

export default App;
