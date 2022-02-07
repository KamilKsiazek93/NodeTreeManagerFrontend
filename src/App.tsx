import React, { useEffect, useState } from 'react';
import './App.css';
import { webAPIUrl } from './components/AppSettings';
import { INodeTree } from './components/Nodes';

const App = () => {

  const [nodes, setNodes] = useState<INodeTree[]>()

  useEffect(() => {
    const getData = async() => {
        fetch(`${webAPIUrl}/nodes`)
          .then(response => response.json())
          .then(data => setNodes(data));
    }
    getData()
  }, [])


  const NodeTree = (nodes:INodeTree) => {
    return (
      <div>
       {nodes.nodesChild.map((node, index) => 
          <ul key={node.id}>
            <li>
              {node.name}
              {node.nodesChild.length > 0 && <NodeTree id={node.id} parentId={node.parentId} name={node.name} nodesChild={node.nodesChild} />}
            </li>
          </ul>
       )}
      </div>
    )
  }

  return (
    <div className="App">
      <h1>Tree manager</h1>
        {nodes?.map((node, index) =>
          <ul key={node.id}>
            <li>
              {node.name}
              {node.nodesChild.length > 0 && <NodeTree id={node.id} parentId={node.parentId} name={node.name} nodesChild={node.nodesChild} />}
            </li>
          </ul>
        )}
    </div>
  );
}

export default App;
