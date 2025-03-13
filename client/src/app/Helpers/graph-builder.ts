import { IGraph, Rect } from 'yfiles';
import { Edge, GraphData, Node } from '../models/graph-data';

export class GraphBuilder {

  static buildGraph(graphData: GraphData, graph: IGraph): void {

    const nodesMap = new Map<string, any>();

    graphData.nodes.forEach((node: Node) => {
      const newNode = graph.createNode(new Rect(0, 0, 60, 60));

      graph.addLabel(newNode, `<b>${node.label}</b>`);

      newNode.tag = node;
      nodesMap.set(node.id, newNode);
    });

    graphData.edges.forEach((edge: Edge) => {
      const sourceNode = nodesMap.get(edge.sourceId);
      const targetNode = nodesMap.get(edge.targetId);

      if (sourceNode && targetNode) {
        graph.createEdge(sourceNode, targetNode);
      }
    });
  }

  static applyNewNodeLive(graph: IGraph, nodeName: string) {
      const newNode = graph.createNode(new Rect(0, 0, 60, 60));
      graph.addLabel(newNode, `<b>${nodeName}</b>`);
  }
}
