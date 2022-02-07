import React, { useEffect, useState } from 'react';
import './App.css';
import { webAPIUrl } from './components/AppSettings';
import { INodeTree } from './components/Nodes';

const App = () => {

  const [nodes, setNodes] = useState<Array<INodeTree> | null>()

  useEffect(() => {
    const getData = async() => {
        fetch(`${webAPIUrl}/nodes`)
          .then(response => response.json())
          .then(data => setNodes(data));
    }
    getData()
  }, [])

  console.log(nodes)

  return (
    <div className="App">
      <h1>Tree manager</h1>
    </div>
  );
}

export default App;
