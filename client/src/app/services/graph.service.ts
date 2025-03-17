import { Injectable } from '@angular/core';
import { GraphControl } from '../Helpers/graph-control';
import { CircularLayout, HierarchicLayout, OrganicLayout, OrthogonalLayout, RadialLayout } from 'yfiles';
import { ApiCallsService } from './api-calls.service';
import { GraphData, Node, Ownership } from '../models/graph-data';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialogComponent } from '../mat-dialog/mat-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  private graphControl !: GraphControl

  constructor(private apiCallsService: ApiCallsService, private matDialog: MatDialog) {
    this.graphControl = new GraphControl();
    this.graphControl.itemsDeleting.subscribe((items: Node[]) => {
      this.onDeletingSelectedItems(items);
    });
  }

  getGraphControl(): GraphControl {
    return this.graphControl;
  }

  applyNewNode(nodeName: string, selectedParentNodes: Ownership[]): void {
    this.graphControl.applyNewNode(nodeName, selectedParentNodes);
  }

  createGraph(graphData: GraphData, elementId: string) {
    this.graphControl.createGraph(graphData, elementId);
  }

  openDeleteConfirmationDialog(): MatDialogRef<MatDialogComponent, boolean> {
    const dialogConfig = {
      width: '50%',
      length: '20%',
      disableClose: true,
      backdropClass: 'no-click-backdrop',
      position: {
        left: '25%',
      }
    };
    return this.matDialog.open(MatDialogComponent, dialogConfig);
  }

  onDeletingSelectedItems(items: Node[]): void {
    this.openDeleteConfirmationDialog().afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.graphControl.deleteSelectedItems();

          const nodeIds = items.map((node: Node) => node.id);
          this.apiCallsService.deleteSelectedItems(nodeIds)
            .subscribe({
              next: (resp) => {
                this.graphControl.deleteSelectedItems();
              },
              error: (err) => console.error('Failed to delete selected items')
            });
        } else {
          
        }
      })
  }

  setLayoutAlgorithm(layoutType: string): void {
    switch (layoutType) {
      case 'HierarchicLayout':
        this.graphControl.doLayout(new HierarchicLayout())
        break;
      case 'OrganicLayout':
        this.graphControl.doLayout(new OrganicLayout())
        break;
      case 'OrthogonalLayout':
        this.graphControl.doLayout(new OrthogonalLayout())
        break;
      case 'CircularLayout':
        this.graphControl.doLayout(new CircularLayout())
        break;
      case 'RadialLayout':
        this.graphControl.doLayout(new RadialLayout())
        break;
      default:
        console.log('Unknown layout type:', layoutType);
    }
  }
}
