import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.scss']
})
export class DepartmentFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  mode: 'create' | 'edit';
  department?: Department;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private dialogRef: MatDialogRef<DepartmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit'; department?: Department }
  ) {
    this.mode = data.mode;
    this.department = data.department;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [
        this.department?.name || '',
        [Validators.required, Validators.maxLength(100)]
      ],
      description: [
        this.department?.description || '',
        [Validators.maxLength(500)]
      ]
    });
  }

  get f() {
    return this.form.controls;
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control.hasError('maxlength')) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `Maximum ${maxLength} caractères`;
    }
    return '';
  }

  submit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const departmentData: Department = this.form.value;

    const operation =
      this.mode === 'create'
        ? this.departmentService.create(departmentData)
        : this.departmentService.update(this.department!.id!, departmentData);

    operation.subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error saving department:', err);
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
