import { GraphComponent, ILayoutAlgorithm } from 'yfiles';

export class GraphLayout {
  static applyLayout(graphComponent: GraphComponent, layout: ILayoutAlgorithm): Promise<void> {
    return graphComponent.morphLayout(layout);
  }
}
