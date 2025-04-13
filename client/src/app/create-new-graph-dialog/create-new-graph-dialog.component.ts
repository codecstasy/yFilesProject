import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-new-graph-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    CommonModule
  ],
  templateUrl: './create-new-graph-dialog.component.html',
  styleUrl: './create-new-graph-dialog.component.css'
})
export class CreateNewGraphDialogComponent implements OnInit {
  graphForm !: FormGroup;
  constructor(private dialogRef: MatDialogRef<CreateNewGraphDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {}
  
  ngOnInit(): void {
    this.graphForm = new FormGroup({
          graphName: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  onSubmit() {
    if(this.graphForm.valid) {
      this.dialogRef.close({
        graphName: this.graphForm.value.graphName
    });
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
