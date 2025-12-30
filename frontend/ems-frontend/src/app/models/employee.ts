export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  departmentId?: number;
  departmentName?: string;

  // User account fields
  username?: string;
  password?: string;
  roles?: string[];
}
