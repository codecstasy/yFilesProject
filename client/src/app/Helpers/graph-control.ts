import { ArrowEdgeStyle, Fill, GraphComponent, GraphEditorInputMode, GraphItemTypes, HierarchicLayout, HorizontalTextAlignment, IGraph, ILayoutAlgorithm, INode, InteriorLabelModel, Key, MarkupLabelStyle, ModifierKeys, NodeSizeConstraintProvider, ShapeNodeShape, ShapeNodeStyle, Size, Stroke, VerticalTextAlignment } from 'yfiles';
import { GraphBuilder } from './graph-builder';
import { GraphLayout } from './graph-layout';
import { GraphData, Node, Ownership } from '../models/graph-data';
import { EventEmitter } from '@angular/core';

export class GraphControl {
  layoutAlgorithmString !: string;

  constructor() {}

  itemsDeleting = new EventEmitter<Node[]>();
  graphComponent !: GraphComponent;
  graph !: IGraph;
  divElement !: string;

  cleanUp() {
    this.graphComponent.cleanUp();
    this.graphComponent.inputMode = null;
    this.graphComponent.graph.clear();
    this.graphComponent = null as any;
    //remove listeners;
    this.itemsDeleting.complete();
  }

  createGraph(graphData: GraphData, elementId: string): void {
    this.divElement = elementId;

    if (this.graphComponent) {
      this.cleanUp();
    }

    this.graphComponent = new GraphComponent(elementId);

    // Initialize the graph
    this.graph = this.graphComponent.graph;

    const graphEditorInputMode = new GraphEditorInputMode();
    graphEditorInputMode.keyboardInputMode.addKeyBinding(
      Key.DELETE,
      ModifierKeys.NONE,
      () => {
        const selectedItems = this.graphComponent.selection.toArray();
        const selectedNodes = selectedItems
          .filter(item => item instanceof INode)
          .map(node => {
            const nodeId = (node as INode).tag.id;
            return graphData.nodes.find(n => n.id === nodeId);
          })
          .filter(node => node !== undefined) as Node[];
        if(selectedNodes.length != 0)
          this.itemsDeleting.emit(selectedNodes);
        return true;
      }
    )
    graphEditorInputMode.allowCreateNode = false;
    graphEditorInputMode.allowCreateEdge = false;
    graphEditorInputMode.allowCreateBend = false;

    graphEditorInputMode.deletableItems = GraphItemTypes.NODE;
    this.graphComponent.inputMode = graphEditorInputMode;

    this.graph.nodeDefaults.style = new ShapeNodeStyle({
      shape: ShapeNodeShape.RECTANGLE,
      fill: 'rgb(224, 122, 214)',
    })

    this.graph.nodeDefaults.labels.layoutParameter = InteriorLabelModel.CENTER
    this.graph.nodeDefaults.labels.style = new MarkupLabelStyle({
      shape: 'round-rectangle',
      backgroundStroke: Stroke.BLACK,
      backgroundFill: Fill.WHITE,
      horizontalTextAlignment: HorizontalTextAlignment.CENTER,
      verticalTextAlignment: VerticalTextAlignment.CENTER
    })

    const arrowEdgeStyle = new ArrowEdgeStyle();
    this.graph.edgeDefaults.style = arrowEdgeStyle;

    this.graph.decorator.nodeDecorator.sizeConstraintProviderDecorator.setFactory(
      () => new NodeSizeConstraintProvider(
        new Size(40, 40),
        new Size(Infinity, Infinity)
      )
    );

    // Build graph
    GraphBuilder.buildGraph(graphData, this.graph);

    // Layout graph
    this.doLayout(graphData.layout);
  }

  applyNewNode(newNodeName: string, nodeId: string, selectedParentNodes: Ownership[]) {
    GraphBuilder.applyNewNode(this.graph, newNodeName, nodeId, selectedParentNodes);
  }

  clearSelectedItems() {
    const graphEditorInputMode = this.graphComponent.inputMode as GraphEditorInputMode;
    graphEditorInputMode.clearSelection();
  }

  deleteSelectedItems() {
    const graphEditorInputMode = this.graphComponent.inputMode as GraphEditorInputMode;
    graphEditorInputMode.deleteSelection();
  }

  doLayout(layoutStringSerial: number) {
    if (!this.graphComponent) {
      console.log('Provide a graph component first!');
      return;
    }

    GraphLayout.applyLayout(this.graphComponent, layoutStringSerial).then(() => {
      this.graphComponent.fitGraphBounds();
    }).catch(() => {
      console.log('Error while applying layout');
    });
  }

  fitViewport() {
    this.graphComponent.fitGraphBounds();
  }
}
