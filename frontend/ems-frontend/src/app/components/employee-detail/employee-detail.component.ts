import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmployee(+id);
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  loadEmployee(id: number): void {
    this.loading = true;
    this.employeeService.getById(id).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading employee:', err);
        this.error = true;
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement de l\'employé', 'OK', {
          duration: 3000
        });
      }
    });
  }

  getInitials(): string {
    if (!this.employee) return '';
    return `${this.employee.firstName.charAt(0)}${this.employee.lastName.charAt(0)}`.toUpperCase();
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  editEmployee(): void {
    if (!this.employee) return;
    const ref = this.dialog.open(EmployeeFormComponent, {
      width: '520px',
      data: { mode: 'edit', employee: this.employee }
    });
    ref.afterClosed().subscribe((result) => {
      if (result && this.employee) {
        this.loadEmployee(this.employee.id!);
      }
    });
  }

  deleteEmployee(): void {
    if (!this.employee) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      return;
    }

    this.employeeService.delete(this.employee.id!).subscribe({
      next: () => {
        this.snackBar.open('Employé supprimé avec succès', 'OK', {
          duration: 2000
        });
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.snackBar.open('Erreur lors de la suppression', 'OK', {
          duration: 3000
        });
      }
    });
  }
}
