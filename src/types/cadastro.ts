
export interface Company {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  name: string;
  cpf: string;
  role: string;
  departmentId: string;
  companyId: string;
}
