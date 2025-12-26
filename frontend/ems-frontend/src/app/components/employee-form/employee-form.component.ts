import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { Employee } from '../../models/employee';
import { Department } from '../../models/department';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  mode: 'create' | 'edit' = 'create';
  loading = false;
  submitted = false;
  departments: Department[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private dialogRef: MatDialogRef<EmployeeFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.mode = this.data?.mode || 'create';
    this.form = this.fb.group({
      firstName: [
        this.data?.employee?.firstName || '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
      ],
      lastName: [
        this.data?.employee?.lastName || '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
      ],
      email: [
        this.data?.employee?.email || '',
        [Validators.required, Validators.email, Validators.maxLength(100)]
      ],
      departmentId: [this.data?.employee?.departmentId || null],
    });

    // Load departments
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (err) => {
        console.error('Error loading departments:', err);
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return 'Ce champ est obligatoire';
    }
    if (control.errors['email']) {
      return 'Format d\'email invalide';
    }
    if (control.errors['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
    }
    if (control.errors['maxlength']) {
      return `Maximum ${control.errors['maxlength'].requiredLength} caractères`;
    }
    return '';
  }

  submit() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Veuillez corriger les erreurs du formulaire', 'OK', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.loading = true;
    const payload: Employee = this.form.value;

    if (this.mode === 'create') {
      this.employeeService.create(payload).subscribe({
        next: () => {
          this.snackBar.open('Employé créé avec succès', 'OK', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open(
            'Erreur lors de la création: ' + (err.error?.message || 'Erreur inconnue'),
            'OK',
            { duration: 4000, panelClass: ['error-snackbar'] }
          );
        }
      });
    } else {
      const id = this.data.employee.id;
      this.employeeService.update(id, payload).subscribe({
        next: () => {
          this.snackBar.open('Employé modifié avec succès', 'OK', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open(
            'Erreur lors de la modification: ' + (err.error?.message || 'Erreur inconnue'),
            'OK',
            { duration: 4000, panelClass: ['error-snackbar'] }
          );
        }
      });
    }
  }

  close() {
    if (this.form.dirty && !confirm('Voulez-vous vraiment quitter sans sauvegarder ?')) {
      return;
    }
    this.dialogRef.close(false);
  }
}
