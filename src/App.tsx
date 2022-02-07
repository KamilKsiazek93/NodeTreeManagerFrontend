import React, { useEffect, useState } from 'react';
import './App.css';
import { webAPIUrl } from './components/AppSettings';
import { INodeNames, INodes, INodeTree } from './components/Nodes';
import { Button, Form, Modal } from 'react-bootstrap';

const App = () => {

  const [nodes, setNodes] = useState<INodeTree[]>()
  const [nodeNames, setNodeNames] = useState<INodeNames[]>()
  const [nodeName, setNodeName] = useState("")
  const [nodeParentId, setNodeParentId] = useState(0)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [stateUpdater, setStateUpdater] = useState(0)

  useEffect(() => {
    const getData = async() => {
        fetch(`${webAPIUrl}/nodes`)
          .then(response => response.json())
          .then(data => setNodes(data));
          fetch(`${webAPIUrl}/nodes/names`)
          .then(response => response.json())
          .then(data => setNodeNames(data));
    }
    getData()
  }, [stateUpdater])

  const handleNewNodeName = (event:any) => {
    event.preventDefault()
    setNodeName(event.target.value)
  }

  const handleNewNodeParent = (event:any) => {
    event.preventDefault()
    setNodeParentId(event.target.value)
  }

  const addNodeToDB = () => {
    const data:INodes = {id: 0, parentId: nodeParentId, name: nodeName}
    fetch(`${webAPIUrl}/nodes`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(data)
    })
    handleClose()
    setStateUpdater(stateUpdater+1)
  }

  const handleAddNode = () => {
    handleShow()
  }


  const NodeTree = (nodes:INodeTree) => {
    return (
      <div>
       {nodes.nodesChild.map((node) => 
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
        {nodes?.map((node) =>
          <ul key={node.id}>
            <li>
              {node.name}
              {node.nodesChild.length > 0 && <NodeTree id={node.id} parentId={node.parentId} name={node.name} nodesChild={node.nodesChild} />}
            </li>
          </ul>
        )}
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
            <Modal.Title>Dodaj element</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Podaj nazwę elementu:
                <Form.Control type="text" onChange={handleNewNodeName}/> <br />
                <select id="selectObstacleName" onChange={handleNewNodeParent}>
                        <option defaultValue="" >Wybierz element nadrzędny</option>
                        {nodeNames?.map((name, index) => 
                            <option value={name.id} key={index}>{name.name}</option>
                        )}
                    </select>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Zamknij
            </Button>
            <Button variant="primary"onClick={(e) => addNodeToDB()}>Dodaj</Button>
            </Modal.Footer>
        </Modal>
        <div>
          <Button variant='success' onClick={handleAddNode}>Dodaj element</Button>
        </div>
    </div>
  );
}

export default App;
