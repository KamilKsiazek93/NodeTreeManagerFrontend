export interface INodes {
    id: number;
    parentId: number;
    name: string;
}

export interface INodeTree extends INodes {
    nodesChild: Array<INodeTree>
}