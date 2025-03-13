import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { Node } from '../models/graph-data';

@Component({
  selector: 'app-add-new-node-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatCheckboxModule, 
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './add-new-node-dialog.component.html',
  styleUrl: './add-new-node-dialog.component.css'
})
export class AddNewNodeDialogComponent implements OnInit {
  nodeForm !: FormGroup;
  nodes : Node[] = [];
  selected = [];

  constructor(
      private dialogRef: MatDialogRef<AddNewNodeDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.nodes = this.data.nodes;

    this.nodeForm = new FormGroup({
      nodeName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      selectedNode: new FormControl([])
    });
  }

  onSubmit() {
    if(this.nodeForm.valid) {
      this.dialogRef.close({
        nodeName: this.nodeForm.value.nodeName,
        selectedParentNodes: this.nodeForm.value.selectedNode
    });
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
