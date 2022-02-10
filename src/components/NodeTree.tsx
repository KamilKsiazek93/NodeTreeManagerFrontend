import React from "react";
import { INodeTree } from "./Nodes";
import { Button } from "react-bootstrap";
import { handleShowHide } from "./ShowHide";
import { handleSortNode } from "./Sort";

export const NodeTree = (nodes:INodeTree) => {
    return (
          <ul id={nodes.name}>
          {nodes.nodesChild.map((node) => 
            <li className={nodes.name} key={node.name}>
              {node.name} {node.nodesChild.length > 0 && <Button onClick={(e) => handleShowHide(node.name)} >Zwiń / Rozwiń</Button>}
              {node.nodesChild.length > 0 && <Button onClick={(e) => handleSortNode(node.name)} >Sortuj</Button>}
              {node.nodesChild.length > 0 && <NodeTree id={node.id} parentId={node.parentId} name={node.name} nodesChild={node.nodesChild} />}
            </li>
            )}
          </ul>
    )
  }