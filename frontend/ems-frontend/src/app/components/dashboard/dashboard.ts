import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { Employee } from '../../models/employee';
import { Department } from '../../models/department';

interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  trend?: string;
}

interface DepartmentStat {
  id?: number;
  name: string;
  employeeCount: number;
  percentage: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  stats: StatCard[] = [];
  recentEmployees: Employee[] = [];
  departments: Department[] = [];
  departmentStats: DepartmentStat[] = [];
  loading = true;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Load both employees and departments
    Promise.all([
      this.employeeService.getAll().toPromise(),
      this.departmentService.getAll().toPromise()
    ]).then(([employees, departments]) => {
      if (departments) {
        this.departments = departments;
      }
      if (employees) {
        this.calculateStats(employees, departments || []);
        this.recentEmployees = employees.slice(-5).reverse();
      }
      if (departments) {
        this.calculateDepartmentStats(employees || [], departments);
      }
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }

  calculateStats(employees: Employee[], departments: Department[]): void {
    const total = employees.length;
    const domains = new Set(employees.map(e => e.email?.split('@')[1])).size;
    const withDepartment = employees.filter(e => e.departmentId).length;
    const departmentCount = departments.length;

    this.stats = [
      {
        title: 'Total Employés',
        value: total,
        icon: 'group',
        color: '#ff6b6b',
      },
      {
        title: 'Départements',
        value: departmentCount,
        icon: 'business',
        color: '#7ee7c6',
      },
      {
        title: 'Employés Assignés',
        value: withDepartment,
        icon: 'assignment_ind',
        color: '#ffd93d',
      },
      {
        title: 'Statut',
        value: 'Actif',
        icon: 'check_circle',
        color: '#6bcf7f',
      }
    ];
  }

  calculateDepartmentStats(employees: Employee[], departments: Department[]): void {
    const totalEmployees = employees.length;

    // Calculate stats for each department
    this.departmentStats = departments.map(dept => {
      const employeeCount = employees.filter(emp => emp.departmentId === dept.id).length;
      const percentage = totalEmployees > 0 ? (employeeCount / totalEmployees) * 100 : 0;

      return {
        id: dept.id,
        name: dept.name,
        employeeCount,
        percentage
      };
    });

    // Add "Sans département" category
    const unassignedCount = employees.filter(emp => !emp.departmentId).length;
    if (unassignedCount > 0) {
      this.departmentStats.push({
        name: 'Sans département',
        employeeCount: unassignedCount,
        percentage: totalEmployees > 0 ? (unassignedCount / totalEmployees) * 100 : 0
      });
    }

    // Sort by employee count descending
    this.departmentStats.sort((a, b) => b.employeeCount - a.employeeCount);
  }

  navigateToEmployees(): void {
    this.router.navigate(['/employees']);
  }

  navigateToDepartments(): void {
    this.router.navigate(['/departments']);
  }

  openCreateDialog(): void {
    this.router.navigate(['/employees']);
  }

  viewEmployee(employee: Employee): void {
    if (employee.id) {
      this.router.navigate(['/employees', employee.id]);
    }
  }
}
