import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { SelectionModel } from '@angular/cdk/collections';
import { HasRoleDirective } from '../../directives/has-role.directive';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    HasRoleDirective
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Employee>([]);
  selection = new SelectionModel<Employee>(true, []);
  searchText = '';
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setupColumns();
    this.load();
    this.setupFilter();
  }

  setupColumns(): void {
    const canEdit = this.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_MANAGER']);
    this.displayedColumns = canEdit
      ? ['select', 'id', 'firstName', 'lastName', 'email', 'departmentName', 'actions']
      : ['id', 'firstName', 'lastName', 'email', 'departmentName'];
  }

  setupFilter(): void {
    this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      const searchStr = filter.toLowerCase();
      return (
        data.firstName?.toLowerCase().includes(searchStr) ||
        data.lastName?.toLowerCase().includes(searchStr) ||
        data.email?.toLowerCase().includes(searchStr) ||
        data.departmentName?.toLowerCase().includes(searchStr) ||
        data.id?.toString().includes(searchStr) ||
        false
      );
    };
  }

  load(): void {
    this.loading = true;
    this.employeeService.getAll().subscribe({
      next: (list) => {
        this.dataSource.data = list;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open('Erreur: impossible de charger', 'OK', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchText.trim();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilter();
  }

  viewEmployee(employee: Employee): void {
    if (employee.id) {
      this.router.navigate(['/employees', employee.id]);
    }
  }

  openCreate() {
    const ref = this.dialog.open(EmployeeFormComponent, { width: '520px', data: { mode: 'create' } });
    ref.afterClosed().subscribe((res) => { if (res) this.load(); });
  }

  openEdit(employee: Employee) {
    const ref = this.dialog.open(EmployeeFormComponent, { width: '520px', data: { mode: 'edit', employee } });
    ref.afterClosed().subscribe((res) => { if (res) this.load(); });
  }

  deleteEmployee(id: number | undefined, event?: Event) {
    if (event) event.stopPropagation();
    if (!id) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) return;
    this.employeeService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Employé supprimé avec succès', 'OK', { duration: 2000 });
        this.load();
      },
      error: () => this.snackBar.open('Erreur lors de la suppression', 'OK', { duration: 3000 }),
    });
  }

  // Selection Methods
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  deleteSelected() {
    if (this.selection.selected.length === 0) return;
    if (!confirm(`Supprimer ${this.selection.selected.length} employé(s) ?`)) return;

    let completed = 0;
    const total = this.selection.selected.length;

    this.selection.selected.forEach(employee => {
      if (employee.id) {
        this.employeeService.delete(employee.id).subscribe({
          next: () => {
            completed++;
            if (completed === total) {
              this.snackBar.open(`${total} employé(s) supprimé(s)`, 'OK', { duration: 2000 });
              this.selection.clear();
              this.load();
            }
          },
          error: () => {
            this.snackBar.open('Erreur lors de la suppression', 'OK', { duration: 3000 });
          }
        });
      }
    });
  }

  exportToCSV() {
    const data = this.dataSource.filteredData;
    if (data.length === 0) {
      this.snackBar.open('Aucune donnée à exporter', 'OK', { duration: 2000 });
      return;
    }

    const headers = ['ID', 'Prénom', 'Nom', 'Email'];
    const csv = [
      headers.join(','),
      ...data.map(emp => [
        emp.id,
        emp.firstName,
        emp.lastName,
        emp.email
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `employees_${new Date().getTime()}.csv`);
    link.click();
    URL.revokeObjectURL(url);
    this.snackBar.open('Export réussi', 'OK', { duration: 2000 });
  }

  refresh() {
    this.load();
    this.snackBar.open('Liste actualisée', 'OK', { duration: 1500 });
  }
}
