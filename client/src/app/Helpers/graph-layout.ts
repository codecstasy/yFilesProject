import { GraphComponent, ILayoutAlgorithm, OrganicLayout, OrthogonalLayout, TreeLayout } from 'yfiles';

export class GraphLayout {
  static applyLayout(graphComponent: GraphComponent, layout: ILayoutAlgorithm): Promise<void> {
    // console.log(`layout applied: ${layout}`)
    return graphComponent.morphLayout(layout);
  }
}
