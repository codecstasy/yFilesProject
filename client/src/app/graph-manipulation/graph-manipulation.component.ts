import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphData, Node, Ownership } from '../models/graph-data';
import { ApiCallsService } from '../services/api-calls.service';
import { GraphControl } from '../Helpers/graph-control';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddNewNodeDialogComponent } from '../add-new-node-dialog/add-new-node-dialog.component';
import { MatDialogComponent } from '../delete-nodes-dialog/delete-nodes-dialog.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ResetConfirmationDialogComponent } from '../reset-confirmation-dialog/reset-confirmation-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CreateNewGraphDialogComponent } from '../create-new-graph-dialog/create-new-graph-dialog.component';
import { Subscription } from 'rxjs';

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
  layoutAlgorithmStringSerial !: number;
  layoutAlgorithmString !: string;
  graphId = "67c4188a8b14961644089122";
  availableGraphs: { id: string, graphName: string }[] = [];
  layoutOptions = [
    { label: 'Hierarchic Layout', value: 'HierarchicLayout' },
    { label: 'Organic Layout', value: 'OrganicLayout' },
    { label: 'Orthogonal Layout', value: 'OrthogonalLayout' },
    { label: 'Circular Layout', value: 'CircularLayout' },
    { label: 'Radial Layout', value: 'RadialLayout' }
  ];
  selectedGraphName = "Graph Name";

  itemsDeletingSubscription !: Subscription;
  getGraphDataSubscription !: Subscription;
  openResetConfirmationDialogSubscription !: Subscription;
  openAddNodeDialogSubscription !: Subscription;
  openCreateNewGraphDialogSubscription !: Subscription;
  openDeleteConfirmationDialogSubscription !: Subscription;


  constructor(
    private apiCallsService: ApiCallsService,
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getGraphIdFromUrl();
    this.loadAvailableGraphs();
    this.kickStart();
  }

  ngOnDestroy(): void {
    this.graphControl.cleanUp();
    
    this.getGraphDataSubscription.unsubscribe();
    this.openResetConfirmationDialogSubscription.unsubscribe();
    this.openAddNodeDialogSubscription.unsubscribe();
    this.openCreateNewGraphDialogSubscription.unsubscribe();
    this.openDeleteConfirmationDialogSubscription.unsubscribe();
  }

  createNewGraph(graphName: string) {
    this.apiCallsService.createNewGraph(graphName).subscribe({
      next: (response) => {
        const newGraphId = response.id;
        this.loadAvailableGraphs();
        this.router.navigate([], {
          queryParams: { graphId: newGraphId },
        });
        this.getGraphIdFromUrl();

        if (this.graphControl) {
          this.graphControl.cleanUp();
        }
        this.graphId = newGraphId;
        this.kickStart();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onGraphSelectionChange(newGraphId: string): void {
    if (newGraphId !== this.graphId) {
      this.graphId = newGraphId;

      this.router.navigate([], {
        queryParams: { graphId: newGraphId },
      });

      if (this.graphControl) {
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
  }

  getLayoutAlgorithmString(layoutAlgorithmStringSerial: number): string {
    if (layoutAlgorithmStringSerial == 0)
      return 'HierarchicLayout';
    else if (layoutAlgorithmStringSerial == 1)
      return 'OrganicLayout';
    else if (layoutAlgorithmStringSerial == 2)
      return 'OrthogonalLayout';
    else if (layoutAlgorithmStringSerial == 3)
      return 'CircularLayout';
    else if (layoutAlgorithmStringSerial == 4)
      return 'RadialLayout';
    else
      return 'InvalidLayout';
  }

  getLayoutAlgorithmSerial(layoutAlgorithmString: string) {
    if(layoutAlgorithmString == 'HierarchicLayout')
      return 0;
    else if(layoutAlgorithmString == 'OrganicLayout')
      return 1;
    else if(layoutAlgorithmString == 'OrthogonalLayout')
      return 2;
    else if(layoutAlgorithmString == 'CircularLayout')
      return 3;
    else if(layoutAlgorithmString == 'RadialLayout')
      return 4;
    else
      return 100;
  }

  kickStart(): void {
    this.graphControl = new GraphControl();

    this.itemsDeletingSubscription = this.graphControl.itemsDeleting.subscribe((items: Node[]) => {
      this.onDeletingSelectedItems(items);
    });

    this.getGraphDataSubscription = this.getGraphData(this.graphId)
      .subscribe(
        (graphData) => {
          if (graphData) {
            this.graphData = graphData;
            this.layoutAlgorithmStringSerial = graphData.layout;
            this.selectedGraphName = graphData.graphName;
            this.layoutAlgorithmString = this.getLayoutAlgorithmString(this.layoutAlgorithmStringSerial);
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
    this.openResetConfirmationDialogSubscription = this.openResetConfirmationDialog().afterClosed()
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
        else { }
      })
  }

  openAddNodeDialog() {
    const dialogConfig = {
      width: '50%',
      length: '20%',
      disableClose: true,
      backdropClass: 'no-click-backdrop',
      position: { left: '25%' },
      data: {
        nodes: this.graphData.nodes
      }
    };

    const dialogRef = this.matDialog.open(AddNewNodeDialogComponent, dialogConfig);

    this.openAddNodeDialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addNode(result.nodeName, result.selectedParentNodes)
      }
    });
  }

  openCreateNewGraphDialog() {
    const dialogConfig = {
      width: '50%',
      length: '20%',
      disableClose: true,
      backdropClass: 'no-click-backdrop',
      position: { left: '25%' }
    };

    const dialogRef = this.matDialog.open(CreateNewGraphDialogComponent, dialogConfig);

    this.openCreateNewGraphDialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createNewGraph(result.graphName);
      }
    });
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
    this.openDeleteConfirmationDialogSubscription = this.openDeleteConfirmationDialog().afterClosed()
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

  selectLayout(layoutValue: string) {
    this.layoutAlgorithmString = layoutValue;
    this.layoutAlgorithmStringSerial = this.getLayoutAlgorithmSerial(this.layoutAlgorithmString);
    this.setLayoutAlgorithm(this.layoutAlgorithmStringSerial);
    this.apiCallsService.setLayoutAlgorithm(this.layoutAlgorithmString, this.graphId)
      .subscribe({
        next: () => {},
        error: (error) => {
          console.log("Error setting layout algorithm", error);
        }
      });
  }

  setLayoutAlgorithm(layoutAlgorithmStringSerial: number): void {
    this.graphControl.doLayout(layoutAlgorithmStringSerial);
  }

  addNode(nodeName: string, selectedParentNodes: Ownership[] = []) {
    this.apiCallsService.addNewNode(this.graphId, nodeName, selectedParentNodes)
      .subscribe(
        (response) => {
          this.graphData.nodes.push(response);
          this.applyNewNode(nodeName, response.id, selectedParentNodes);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  applyNewNode(nodeName: string, nodeId: string, selectedParentNodes: Ownership[]): void {
    this.graphControl.applyNewNode(nodeName, nodeId, selectedParentNodes);
  }

  fitViewport() {
    this.graphControl.fitViewport();
  }
}
