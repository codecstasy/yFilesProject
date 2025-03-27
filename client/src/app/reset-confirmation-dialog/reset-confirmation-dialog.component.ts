import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-confirmation-dialog',
  standalone: true,
  imports: [],
  templateUrl: './reset-confirmation-dialog.component.html',
  styleUrl: './reset-confirmation-dialog.component.css'
})
export class ResetConfirmationDialogComponent {
  testForm !: FormGroup;
    constructor(
      private dialogRef: MatDialogRef<ResetConfirmationDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }
  
    ngOnInit() {
      this.testForm = new FormGroup({});
    }
    
    onConfirm() {
      this.dialogRef.close(true);
    }
  
    onCancel() {
      this.dialogRef.close(false);
    }
}
