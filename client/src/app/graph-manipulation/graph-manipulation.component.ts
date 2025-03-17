import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphService } from '../services/graph.service';
import { GraphData, Node, Ownership } from '../models/graph-data';
import { ApiCallsService } from '../services/api-calls.service';
import { GraphControl } from '../Helpers/graph-control';
import { MatDialog } from '@angular/material/dialog';
import { AddNewNodeDialogComponent } from '../add-new-node-dialog/add-new-node-dialog.component';

@Component({
  selector: 'app-graph-manipulation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './graph-manipulation.component.html',
  styleUrl: './graph-manipulation.component.css'
})
export class GraphManipulationComponent implements OnInit, OnDestroy {
  graphControl !: GraphControl;
  graphData !: GraphData;
  layoutAlgorithmString: string = 'HierarchicLayout';
  nodes : Node[] = [];

  constructor(private graphService: GraphService,
    private apiCallsService: ApiCallsService, private matDialog: MatDialog) { }

  ngOnInit(): void {
    const graphId = "67c4188a8b14961644089122";
    this.graphControl = this.graphService.getGraphControl();
    this.getGraphData(graphId)
      .subscribe(
        (graphData) => {
          if (graphData) {
            this.graphData = graphData;
            this.nodes = this.graphData.nodes;
            this.graphService.createGraph(this.graphData, '#graphComponent');
          } else {
            console.error('Graph data is empty!');
          }
        },
        (error) => {
          console.error('Error fetching graph data: ', error);
        }
      );
  }

  ngOnDestroy(): void {
    this.graphControl.cleanUp();
  }

  onLayoutChange($event: Event) {
    this.graphService.setLayoutAlgorithm(this.layoutAlgorithmString);
  }

  getGraphData(graphId: string) {
    return this.apiCallsService.getGraphData(graphId);
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
       if(result) {
        this.addNode(result.nodeName, result.selectedParentNodes)
       }
    });
  }

  addNode(nodeName: string, selectedParentNodes: Ownership[] = []) {
    this.apiCallsService.addNewNode(nodeName, selectedParentNodes)
      .subscribe(
        (response) => {
          this.graphService.applyNewNode(nodeName, selectedParentNodes);
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
