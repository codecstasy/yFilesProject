import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphData, Node, Ownership } from '../models/graph-data';
import { ApiCallsService } from '../services/api-calls.service';
import { GraphControl } from '../Helpers/graph-control';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddNewNodeDialogComponent } from '../add-new-node-dialog/add-new-node-dialog.component';
import { MatDialogComponent } from '../delete-nodes-dialog/delete-nodes-dialog.component';
import { CircularLayout, HierarchicLayout, OrganicLayout, OrthogonalLayout, RadialLayout } from 'yfiles';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ResetConfirmationDialogComponent } from '../reset-confirmation-dialog/reset-confirmation-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-graph-manipulation',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './graph-manipulation.component.html',
  styleUrl: './graph-manipulation.component.css'
})
export class GraphManipulationComponent implements OnInit, OnDestroy {
  graphControl !: GraphControl;
  graphData !: GraphData;
  layoutAlgorithmString: string = 'HierarchicLayout';
  nodes: Node[] = [];
  graphId = "67c4188a8b14961644089122";
  availableGraphs: { id: string, graphName: string }[] = [];
  layoutOptions = [
    { label: 'Hierarchic Layout', value: 'HierarchicLayout' },
    { label: 'Organic Layout', value: 'OrganicLayout' },
    { label: 'Orthogonal Layout', value: 'OrthogonalLayout' },
    { label: 'Circular Layout', value: 'CircularLayout' },
    { label: 'Radial Layout', value: 'RadialLayout' }
  ];

  constructor(
    private apiCallsService: ApiCallsService,
    private matDialog: MatDialog,
    private  route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getGraphIdFromUrl();
    this.loadAvailableGraphs();
    this.kickStart();
  }

  ngOnDestroy(): void {
    this.graphControl.cleanUp();
  }

  onGraphSelectionChange(newGraphId : string): void {
    if (newGraphId !== this.graphId) {
      this.graphId = newGraphId;
      // console.log(this.graphId);

      this.router.navigate([], {
        queryParams: { graphId: newGraphId },
      });

      if(this.graphControl) {
        this.graphControl.cleanUp();
      }
      this.kickStart();
    }
  }

  loadAvailableGraphs(): void {
    this.apiCallsService.getAllGraphs().subscribe({
      next: (graphs) => {
        this.availableGraphs = graphs;
      },
      error: (err) => {
        console.error('Failed to load available graphs:', err);
      }
    });
  }

  getGraphIdFromUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const paramGraphId = urlParams.get('graphId');
    if (paramGraphId) {
      this.graphId = paramGraphId;
    }
    // console.log(this.graphId);
  }

  kickStart(): void {
    this.graphControl = new GraphControl();

    this.graphControl.itemsDeleting.subscribe((items: Node[]) => {
      this.onDeletingSelectedItems(items);
    });

    this.getGraphData(this.graphId)
      .subscribe(
        (graphData) => {
          if (graphData) {
            this.graphData = graphData;
            this.nodes = this.graphData.nodes;
            this.createGraph(this.graphData, '#graphComponent');
          } else {
            console.error('Graph data is empty!');
          }
        },
        (error) => {
          console.error('Error fetching graph data: ', error);
        }
      );
  }

  resetGraph() {
    this.openResetConfirmationDialog().afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.apiCallsService.resetGraph(this.graphId)
            .subscribe({
              next: () => {
                if (this.graphControl) {
                  this.graphControl.cleanUp();
                }
                this.kickStart();
              },
              error: () => console.error("Error resetting the graph")
            });
        }
        else {}
      })
  }

  openResetConfirmationDialog(): MatDialogRef<ResetConfirmationDialogComponent, boolean> {
    const dialogConfig = {
      width: '50%',
      length: '20%',
      disableClose: true,
      backdropClass: 'no-click-backdrop',
      position: {
        left: '25%',
      }
    };
    return this.matDialog.open(ResetConfirmationDialogComponent, dialogConfig);
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

  createGraph(graphData: GraphData, elementId: string) {
    this.graphControl.createGraph(graphData, elementId);
  }

  getGraphData(graphId: string) {
    return this.apiCallsService.getGraphData(graphId);
  }

  onDeletingSelectedItems(items: Node[]): void {
    this.openDeleteConfirmationDialog().afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.graphControl.deleteSelectedItems();

          const nodeIds = items.map((node: Node) => node.id);
          this.apiCallsService.deleteSelectedItems(this.graphId, nodeIds)
            .subscribe({
              next: (resp) => {
                this.graphControl.deleteSelectedItems();
              },
              error: (err) => console.error('Failed to delete selected items')
            });
        } else {
          // Do nothing
        }
      })
  }

  forceLayoutChange() {
    this.setLayoutAlgorithm(this.layoutAlgorithmString);
  }

  getSelectedLayoutLabel(): string {
    const selectedOption = this.layoutOptions.find(option => option.value === this.layoutAlgorithmString);
    return selectedOption ? selectedOption.label : 'Select Layout';
  }

  getSelectedGraphName(): string {
    const selectedGraphName = this.availableGraphs.find(graph => graph.id === this.graphId);
    return selectedGraphName ? selectedGraphName.graphName : 'Select Graph';
  }

  selectLayout(layoutValue: string) {
    this.layoutAlgorithmString = layoutValue;
    this.forceLayoutChange();
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

  openAddNodeDialog() {
    const dialogConfig = {
      width: '50%',
      length: '20%',
      disableClose: true,
      backdropClass: 'no-click-backdrop',
      position: { left: '25%' },
      data: {
        nodes: this.nodes
      }
    };

    const dialogRef = this.matDialog.open(AddNewNodeDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addNode(result.nodeName, result.selectedParentNodes)
      }
    });
  }

  addNode(nodeName: string, selectedParentNodes: Ownership[] = []) {
    this.apiCallsService.addNewNode(this.graphId, nodeName, selectedParentNodes)
      .subscribe(
        (response) => {
          this.applyNewNode(nodeName, selectedParentNodes);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  applyNewNode(nodeName: string, selectedParentNodes: Ownership[]): void {
    this.graphControl.applyNewNode(nodeName, selectedParentNodes);
  }

  fitViewport() {
    this.graphControl.fitViewport();
  }
}
