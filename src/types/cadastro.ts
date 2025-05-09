
export interface Company {
  id: string;
  name: string;
  departments: Department[];
}

export interface Department {
  id: string;
  name: string;
  companyId: string;
}

export interface JobRole {
  id: string;
  name: string;
  companyId: string; // Added companyId to associate roles with companies
}

export interface Employee {
  id: string;
  name: string;
  cpf: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  address?: string;
  departmentId?: string;
  email?: string;
  jobRole?: string;
  roleId: string; // Added roleId property to fix TypeScript errors
  companyId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
