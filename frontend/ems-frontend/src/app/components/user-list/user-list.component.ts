import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'username', 'email', 'firstName', 'lastName', 'roles', 'enabled', 'actions'];
  loading = false;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Erreur lors du chargement des utilisateurs', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: {
        isEditMode: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Utilisateur créé avec succès', 'Fermer', { duration: 3000 });
            this.loadUsers();
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de la création de l\'utilisateur', 'Fermer', { duration: 3000 });
          }
        });
      }
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: {
        user: user,
        isEditMode: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.update(user.id, result).subscribe({
          next: () => {
            this.snackBar.open('Utilisateur modifié avec succès', 'Fermer', { duration: 3000 });
            this.loadUsers();
          },
          error: (error) => {
            this.snackBar.open('Erreur lors de la modification', 'Fermer', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur supprimé avec succès', 'Fermer', { duration: 3000 });
          this.loadUsers();
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  getRoleBadgeColor(role: string): string {
    switch(role) {
      case 'ROLE_ADMIN': return 'accent';
      case 'ROLE_MANAGER': return 'primary';
      case 'ROLE_EMPLOYEE': return '';
      default: return '';
    }
  }

  getRoleLabel(role: string): string {
    return role.replace('ROLE_', '');
  }
}
