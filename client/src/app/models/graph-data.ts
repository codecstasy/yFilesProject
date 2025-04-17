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
    graphName: string;
    layout: LayoutType;
    nodes: Node[];
    edges: Edge[];
}

export enum LayoutType {
    HierarchicLayout = 0,
    OrganicLayout = 1,
    OrthogonalLayout = 2,
    CircularLayout = 3,
    RadialLayout = 4
}