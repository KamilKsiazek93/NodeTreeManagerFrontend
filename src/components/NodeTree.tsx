import React from "react";
import { INodeTree } from "./Nodes";

export const NodeTree = (nodes:INodeTree) => {
  
    return (
          <ul id={nodes.name}>
          {nodes.nodesChild.map((node) => 
            <li className={nodes.name+nodes.id.toString()} key={node.name}>
              {node.name} 
              {node.nodesChild.length > 0 && <NodeTree id={node.id} parentId={node.parentId} name={node.name} nodesChild={node.nodesChild} />}
            </li>
            )}
          </ul>
    )
  }