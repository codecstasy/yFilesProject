import { IGraph, INode, Rect } from 'yfiles';
import { Edge, GraphData, Node, Ownership } from '../models/graph-data';

export class GraphBuilder {
  static nodesMap: Map<string, INode> = new Map<string, INode>();  // <node id, node>

  static buildGraph(graphData: GraphData, graph: IGraph): void {
    this.nodesMap.clear();

    this.nodesMap = new Map<string, INode>();

    graphData.nodes.forEach((node: Node) => {
      const newNode = graph.createNode(new Rect(0, 0, 60, 60));

      graph.addLabel(newNode, `<b>${node.label}</b>`);

      newNode.tag = node;
      this.nodesMap.set(node.id, newNode);
    });

    graphData.edges.forEach((edge: Edge) => {
      const sourceNode = this.nodesMap.get(edge.sourceId);
      const targetNode = this.nodesMap.get(edge.targetId);

      if (sourceNode && targetNode) {
        graph.createEdge(sourceNode, targetNode);
      }
    });
  }

  static applyNewNode(graph: IGraph, nodeName: string, nodeId: string, selectedParentNodes: any[]) {
    const newNode = graph.createNode(new Rect(0, 0, 60, 60));
    graph.addLabel(newNode, `<b>${nodeName}</b>`);

    this.nodesMap.set(nodeId, newNode);

    selectedParentNodes.forEach(( parentId ) => {
      const sourceNode = this.nodesMap.get(parentId);
      if (sourceNode) {
        graph.createEdge(sourceNode, newNode);
      }
    });
  }
}
