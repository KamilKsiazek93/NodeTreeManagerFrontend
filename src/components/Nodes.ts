export interface INodes {
    id: number;
    parentId: number;
    name: string;
}

export interface INodeTree {
    id: number;
    parentId: number;
    name: string;
    nodesChild: Array<INodeTree>
}