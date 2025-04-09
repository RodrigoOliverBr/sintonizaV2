
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
}

export interface Employee {
  id: string;
  name: string;
  cpf: string;
  roleId: string;
  departmentId: string;
  companyId: string;
}
