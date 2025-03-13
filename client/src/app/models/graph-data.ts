export interface Ownership {
    parentId: string;
    percentage: number;
}

export interface AddNodeData {
    label: string;
    ownershipData: Ownership[];
}

export interface Node {
    id: string;
    label: string;
    ownerships: Ownership[];
}

export interface Edge {
    id: string;
    sourceId: string;
    targetId: string;
}

export interface GraphData {
    id: string;
    nodes: Node[];
    edges: Edge[];
}