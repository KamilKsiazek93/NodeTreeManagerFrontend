import React, { useEffect, useState } from 'react';
import './App.css';
import { webAPIUrl } from './components/AppSettings';
import { INodes, INodeTree } from './components/Nodes';
import { Button, Form, Modal } from 'react-bootstrap';
import { handleSortNode } from './components/Sort';
import { handleShowHide } from './components/ShowHide';
import { NodeTree } from './components/NodeTree';

const App = () => {

  const [nodes, setNodes] = useState<INodeTree[]>()
  const [nodeNames, setNodeNames] = useState<INodes[]>()
  const [nodeName, setNodeName] = useState("")
  const [nodeParentId, setNodeParentId] = useState(0)
  const [parentNodeName, setParentNodeName] = useState("")
  const [nodeId, setNodeId] = useState(0)
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [showEdit, setShowEdit] = useState(false);
  const handleShowEdit = () => setShowEdit(true);
  const [showDelete, setShowDelete] = useState(false);
  const handleShowDelete = () => setShowDelete(true);
  const [stateUpdater, setStateUpdater] = useState(0)
  const [message, setMessage] = useState<string>()

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

  const handleClose = () => {
    setShow(false)
    clearState()
  }

  const handleCloseEdit = () => {
    setShowEdit(false)
    clearState()
  }

  const handleCloseDelete = () => {
    setShowDelete(false)
    clearState()
  }

  const clearState = () => {
    setNodeName("")
    setParentNodeName("")
    setNodeParentId(0)
    setNodeId(0)
  }

  const handleNewNodeName = (name:string) => {
    setNodeName(name)
  }

  const handleNewNodeParent = (event:any) => {
    event.preventDefault()
    setNodeParentId(event.target.value)
  }

  const addNodeToDB = async() => {
    const data:INodes = {id: 0, parentId: nodeParentId, name: nodeName}
    await fetch(`${webAPIUrl}/nodes`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => setMessage(result.message));

    handleClose()
    clearState()
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
    const findingNodeName = nodeNames?.filter(item => item.id === parseInt(id))[0].name ?? ""
    const findingNodeParentId = nodeNames?.filter(item => item.id === parseInt(id))[0].parentId ?? 0
    const parentNode = nodeNames?.filter(item => item.id === findingNodeParentId) ?? []
    if(parentNode?.length > 0) {
      setParentNodeName(parentNode[0].name)
    } else {
      setParentNodeName("")
    }
    setNodeParentId(findingNodeParentId)
    setNodeName(findingNodeName)
  }
  
  const editNodeToDB = async() => {
    const data:INodes = {id: nodeId, parentId: nodeParentId, name: nodeName};

    if(nodeId !== 0) {
      await fetch(`${webAPIUrl}/nodes/${nodeId}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        let json = response.json()
        return (response.status >= 200 && response.status < 300) ? json : json.then(Promise.reject.bind(Promise));
      })
      .then(result => {
        setMessage(result.message)
      })
      .catch((error) => {
        setMessage(error.message);
      })
  
      handleCloseEdit()
      clearState()
      setStateUpdater(stateUpdater+1)
    }
  }

  const handleDeleteNode = () => {
    handleShowDelete()
  }

  const handleEditDeletingId = (id:string) => {
    setNodeId(parseInt(id))
  }

  const deleteNodeFromDB = async() => {
    if(nodeId !== 0) {
      await fetch(`${webAPIUrl}/nodes/${nodeId}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({id: nodeId})
      })
      .then(response => response.json())
      .then(result => setMessage(result.message));
      handleCloseDelete();
      clearState()
      setStateUpdater(stateUpdater+1)
    }
  }

  const handleSortSelect = () => {
    let sortOption = document.getElementById('sortSelect') as HTMLInputElement
    if(sortOption.value !== "") {
      const findingNodeName = nodeNames?.filter(item => item.id === parseInt(sortOption.value))[0].name ?? ""
      handleSortNode(findingNodeName+sortOption.value)
      sortOption.value = ""
    }
  }

  const handleShowHideSelect = () => {
    let showHideOption = document.getElementById('showHideSelect') as HTMLInputElement
    if(showHideOption.value !== "") {
      const findingNodeName = nodeNames?.filter(item => item.id === parseInt(showHideOption.value))[0].name ?? ""
      handleShowHide(findingNodeName+showHideOption.value)
      showHideOption.value = ""
    }
  }

  return (
    <div className="App">
      <h1 className="header">Tree manager</h1>

        <div className='panelButtons'>
          <Button variant='success' onClick={handleAddNode}>Dodaj element</Button>
          <Button variant="warning" onClick={handleEditNode} >Edytuj element</Button>
          <Button variant="danger" onClick={handleDeleteNode}>Usu?? element</Button>
        </div>
        <div className='selectPanel'><span className='rightMarginSpan'>Wybierz w??ze?? do posortowania</span>
          <select id="sortSelect" onClick={handleSortSelect}>
              <option defaultValue="" ></option>
              {nodeNames?.map((name, index) => 
                  <option value={name.id} key={index}>{name.name}</option>
              )}
          </select>
        <span className='bothtMarginSpan'>Wybierz w??ze?? do zwini??cia / rozwini??cia</span>
          <select id="showHideSelect" onChange={handleShowHideSelect}>
              <option defaultValue="" ></option>
              {nodeNames?.map((name, index) => 
                  <option value={name.id} key={index}>{name.name}</option>
              )}
          </select>
        </div>
        <div className="messageApi">{message}</div>
          <ul>
          {nodes?.map((node) =>
            <li key={node.name}>
              {node.name}
              
              {node.nodesChild.length > 0 && <NodeTree id={node.id} parentId={node.parentId} name={node.name} nodesChild={node.nodesChild} />}
            </li>
            )}
          </ul>

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
              Podaj nazw?? elementu:
              <Form.Control type="text" onChange={(e) => handleNewNodeName(e.target.value)}/> <br />
              <select id="selectAddNodeName" onChange={handleNewNodeParent}>
                  <option defaultValue="" >Wybierz element nadrz??dny</option>
                  <option value={nodeParentId} >Brak elementu nadrz??dnego</option>
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
              <select id="selectEditNodeName" onChange={(e) => handleEditElement(e.target.value)}>
                  <option defaultValue="" >Wybierz element do edycji</option>
                  {nodeNames?.map((name, index) => 
                      <option value={name.id} key={index}>{name.name}</option>
                  )}
              </select>
              <br/>
              Podaj now?? nazw??:
              <Form.Control type='text' id="editNodeName" value={nodeName} onChange={(e) => handleNewNodeName(e.target.value)} />
              Wybierz element nadrz??dny<br />
              <select id="selectEditParentName" onChange={handleNewNodeParent}>
                  <option value={nodeParentId} >{parentNodeName}</option>
                  <option value="0">Brak elementu nadrz??dnego</option>
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
          <Modal.Title>Usu?? element</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              Wybierz element do usuni??cia
              <select id="selectDeleteNodeName" onChange={(e) => handleEditDeletingId(e.target.value)}>
                  <option defaultValue="" >Element do usuni??cia</option>
                  {nodeNames?.map((name, index) => 
                      <option value={name.id} key={index}>{name.name}</option>
                  )}
              </select>
              <div className='alertMessage'>
                Pami??taj, ze usuni??cie elementu nadrz??dnego poci??ga za sob?? usuni??cie element??w pod nim. <br/>
                Je??li chcesz zachowa?? podrz??dne elementy przenie?? je przed usuni??ciem na inn?? ga??????.
              </div>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
              Zamknij
          </Button>
          <Button variant="danger"onClick={(e) => deleteNodeFromDB()}>Usu??</Button>
          </Modal.Footer>
        </Modal>
    </div>
  );
}

export default App;
