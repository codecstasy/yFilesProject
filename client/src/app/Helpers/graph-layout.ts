import { CircularLayout, GraphComponent, HierarchicLayout, ILayoutAlgorithm, OrganicLayout, OrthogonalLayout, RadialLayout } from 'yfiles';

export class GraphLayout {
  static layoutAlgorithm: ILayoutAlgorithm;

  static applyLayout(graphComponent: GraphComponent, layoutStringSerial: number): Promise<void> {
    switch (layoutStringSerial) {
      case 0:
        this.layoutAlgorithm = new HierarchicLayout();
        break;
      case 1:
        this.layoutAlgorithm = new OrganicLayout();
        break;
      case 2:
        this.layoutAlgorithm = new OrthogonalLayout();
        break;
      case 3:
        this.layoutAlgorithm = new CircularLayout();
        break;
      case 4:
        this.layoutAlgorithm = new RadialLayout();
        break;
      default:
        console.log('Unknown layout type:', this.layoutAlgorithm);
    }
    return graphComponent.morphLayout(this.layoutAlgorithm);
  }
}
