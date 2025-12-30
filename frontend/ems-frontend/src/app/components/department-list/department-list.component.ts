import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department';
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
import { DepartmentFormComponent } from '../department-form/department-form.component';
import { SelectionModel } from '@angular/cdk/collections';
import { HasRoleDirective } from '../../directives/has-role.directive';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
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
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss'],
})
export class DepartmentListComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Department>([]);
  selection = new SelectionModel<Department>(true, []);
  searchText = '';
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private departmentService: DepartmentService,
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
      ? ['select', 'id', 'name', 'description', 'employeeCount', 'actions']
      : ['id', 'name', 'description', 'employeeCount'];
  }

  setupFilter(): void {
    this.dataSource.filterPredicate = (data: Department, filter: string) => {
      const searchStr = filter.toLowerCase();
      return (
        data.name?.toLowerCase().includes(searchStr) ||
        data.description?.toLowerCase().includes(searchStr) ||
        data.id?.toString().includes(searchStr) ||
        false
      );
    };
  }

  load(): void {
    this.loading = true;
    this.departmentService.getAll().subscribe({
      next: (list) => {
        this.dataSource.data = list;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open('Erreur: impossible de charger les départements', 'OK', { duration: 3000 });
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

  openCreate() {
    const ref = this.dialog.open(DepartmentFormComponent, { width: '520px', data: { mode: 'create' } });
    ref.afterClosed().subscribe((res) => { if (res) this.load(); });
  }

  openEdit(department: Department) {
    const ref = this.dialog.open(DepartmentFormComponent, { width: '520px', data: { mode: 'edit', department } });
    ref.afterClosed().subscribe((res) => { if (res) this.load(); });
  }

  deleteDepartment(id: number | undefined, event?: Event) {
    if (event) event.stopPropagation();
    if (!id) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) return;
    this.departmentService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Département supprimé avec succès', 'OK', { duration: 2000 });
        this.load();
      },
      error: (err) => {
        const message = err.error?.message || 'Erreur lors de la suppression';
        this.snackBar.open(message, 'OK', { duration: 3000 });
      },
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
    if (!confirm(`Supprimer ${this.selection.selected.length} département(s) ?`)) return;

    let completed = 0;
    const total = this.selection.selected.length;

    this.selection.selected.forEach(department => {
      if (department.id) {
        this.departmentService.delete(department.id).subscribe({
          next: () => {
            completed++;
            if (completed === total) {
              this.snackBar.open(`${total} département(s) supprimé(s)`, 'OK', { duration: 2000 });
              this.selection.clear();
              this.load();
            }
          },
          error: (err) => {
            const message = err.error?.message || 'Erreur lors de la suppression';
            this.snackBar.open(message, 'OK', { duration: 3000 });
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

    const headers = ['ID', 'Nom', 'Description', 'Nombre d\'employés'];
    const csv = [
      headers.join(','),
      ...data.map(dept => [
        dept.id,
        dept.name,
        dept.description || '',
        dept.employeeCount || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `departments_${new Date().getTime()}.csv`);
    link.click();
    URL.revokeObjectURL(url);
    this.snackBar.open('Export réussi', 'OK', { duration: 2000 });
  }

  refresh() {
    this.load();
    this.snackBar.open('Liste actualisée', 'OK', { duration: 1500 });
  }
}
