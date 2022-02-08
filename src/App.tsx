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
  const [nodeId, setNodeId] = useState(0)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
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

  const handleNewNodeName = (name:string) => {
    setNodeName(name)
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

  const handleEditNode = () => {
    handleShowEdit()
  }

  const handleEditElement = (id:string) => {
    setNodeId(parseInt(id))
    var findingNode = nodeNames?.filter(item => item.id === parseInt(id))[0].name ?? ""
    setNodeName(findingNode)
  }
  
  const editNodeToDB = () => {
    const data:INodes = {id: nodeId, parentId: nodeParentId, name: nodeName};

    fetch(`${webAPIUrl}/nodes/${nodeId}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(data)
    })

    handleCloseEdit()
    setStateUpdater(stateUpdater+1)
  }

  const handleDeleteNode = () => {
    handleShowDelete()
  }

  const handleEditDeletingId = (id:string) => {
    setNodeId(parseInt(id))
  }

  const deleteNodeFromDB = () => {
    if(nodeId !== 0) {
      fetch(`${webAPIUrl}/nodes/${nodeId}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({id: nodeId})
      })
      handleCloseDelete();
      setStateUpdater(stateUpdater+1)
    }
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
                <Form.Control type="text" onChange={(e) => handleNewNodeName(e.target.value)}/> <br />
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

        <Modal
            show={showEdit}
            onHide={handleCloseEdit}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
            <Modal.Title>Edytuj element</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Wybierz element do edycji:
                <select id="selectObstacleName" onChange={(e) => handleEditElement(e.target.value)}>
                    <option defaultValue="" >Wybierz element do edycji</option>
                    {nodeNames?.map((name, index) => 
                        <option value={name.id} key={index}>{name.name}</option>
                    )}
                </select>
                <br/>
                Podaj nową nazwę:
                <Form.Control type='text' id="editNodeName" value={nodeName} onChange={(e) => handleNewNodeName(e.target.value)} />
                <select id="selectObstacleName" onChange={handleNewNodeParent}>
                    <option defaultValue="" >Wybierz element nadrzędny</option>
                    {nodeNames?.map((name, index) => 
                        <option value={name.id} key={index}>{name.name}</option>
                    )}
                </select>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
                Zamknij
            </Button>
            <Button variant="warning"onClick={(e) => editNodeToDB()}>Edytuj</Button>
            </Modal.Footer>
        </Modal>

        <Modal
            show={showDelete}
            onHide={handleCloseDelete}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
            <Modal.Title>Usuń element</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Wybierz element do usunięcia
                <select id="selectObstacleName" onChange={(e) => handleEditDeletingId(e.target.value)}>
                    <option defaultValue="" >Wybierz element do edycji</option>
                    {nodeNames?.map((name, index) => 
                        <option value={name.id} key={index}>{name.name}</option>
                    )}
                </select>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
                Zamknij
            </Button>
            <Button variant="danger"onClick={(e) => deleteNodeFromDB()}>Usuń</Button>
            </Modal.Footer>
        </Modal>

        <div>
          <Button variant='success' onClick={handleAddNode}>Dodaj element</Button>
          <Button variant="warning" onClick={handleEditNode} >Edytuj element</Button>
          <Button variant="danger" onClick={handleDeleteNode}>Usuń element</Button>
        </div>
    </div>
  );
}

export default App;
