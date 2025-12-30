import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { User, CreateUserRequest } from '../../models/user';

export interface UserFormData {
  user?: User;
  isEditMode: boolean;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode: boolean;
  availableRoles = [
    { name: 'ROLE_ADMIN', label: 'Administrateur' },
    { name: 'ROLE_MANAGER', label: 'Manager' },
    { name: 'ROLE_EMPLOYEE', label: 'Employé' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserFormData
  ) {
    this.isEditMode = data?.isEditMode || false;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      username: [
        this.data?.user?.username || '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ],
      email: [
        this.data?.user?.email || '',
        [Validators.required, Validators.email]
      ],
      password: [
        '',
        this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]
      ],
      firstName: [this.data?.user?.firstName || ''],
      lastName: [this.data?.user?.lastName || ''],
      roles: this.fb.group({
        ROLE_ADMIN: [this.hasRole('ROLE_ADMIN')],
        ROLE_MANAGER: [this.hasRole('ROLE_MANAGER')],
        ROLE_EMPLOYEE: [this.hasRole('ROLE_EMPLOYEE')]
      })
    });

    if (this.isEditMode) {
      this.userForm.get('username')?.disable();
    }
  }

  hasRole(role: string): boolean {
    return this.data?.user?.roles?.includes(role) || false;
  }

  getSelectedRoles(): string[] {
    const rolesForm = this.userForm.get('roles')?.value;
    return Object.keys(rolesForm).filter(role => rolesForm[role]);
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const selectedRoles = this.getSelectedRoles();

      if (selectedRoles.length === 0) {
        alert('Veuillez sélectionner au moins un rôle');
        return;
      }

      const formValue = {
        ...this.userForm.getRawValue(),
        roles: selectedRoles
      };

      // Remove roles form group from the result
      delete formValue.roles.ROLE_ADMIN;
      delete formValue.roles.ROLE_MANAGER;
      delete formValue.roles.ROLE_EMPLOYEE;

      const result: CreateUserRequest = {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        roles: selectedRoles
      };

      // Don't send empty password in edit mode
      if (this.isEditMode && !result.password) {
        delete result.password;
      }

      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getFormTitle(): string {
    return this.isEditMode ? 'Modifier l\'utilisateur' : 'Créer un utilisateur';
  }

  getSubmitButtonText(): string {
    return this.isEditMode ? 'Modifier' : 'Créer';
  }
}
