
import { Company, Department, Employee, JobRole } from "@/types/cadastro";

// Keys for localStorage
const COMPANIES_KEY = "istas21:companies";
const EMPLOYEES_KEY = "istas21:employees";
const JOB_ROLES_KEY = "istas21:jobRoles";

// Initial data
const initialCompanies: Company[] = [
  { 
    id: "1", 
    name: "eSocial Brasil",
    departments: [
      { id: "1-1", name: "Recursos Humanos", companyId: "1" },
      { id: "1-2", name: "Tecnologia da Informação", companyId: "1" },
      { id: "1-3", name: "Administrativo", companyId: "1" }
    ]
  },
  { 
    id: "2", 
    name: "Tech Solutions Ltda.",
    departments: [
      { id: "2-1", name: "Desenvolvimento", companyId: "2" },
      { id: "2-2", name: "Suporte", companyId: "2" },
      { id: "2-3", name: "Comercial", companyId: "2" }
    ]
  }
];

const initialJobRoles: JobRole[] = [
  { id: "1", name: "Analista de Recursos Humanos" },
  { id: "2", name: "Engenheiro de Software" },
  { id: "3", name: "Técnico de Segurança" },
  { id: "4", name: "Analista Administrativo" },
  { id: "5", name: "Gerente de Projetos" }
];

// Companies
export const getCompanies = (): Company[] => {
  const companies = localStorage.getItem(COMPANIES_KEY);
  if (!companies) {
    localStorage.setItem(COMPANIES_KEY, JSON.stringify(initialCompanies));
    return initialCompanies;
  }
  return JSON.parse(companies);
};

export const addCompany = (company: Omit<Company, "id" | "departments">): Company => {
  const companies = getCompanies();
  const newCompany: Company = {
    ...company,
    id: Date.now().toString(),
    departments: []
  };
  localStorage.setItem(COMPANIES_KEY, JSON.stringify([...companies, newCompany]));
  return newCompany;
};

export const updateCompany = (company: Company): void => {
  const companies = getCompanies();
  const updatedCompanies = companies.map(c => c.id === company.id ? company : c);
  localStorage.setItem(COMPANIES_KEY, JSON.stringify(updatedCompanies));
};

export const deleteCompany = (id: string): void => {
  const companies = getCompanies();
  const filteredCompanies = companies.filter(c => c.id !== id);
  localStorage.setItem(COMPANIES_KEY, JSON.stringify(filteredCompanies));
  
  // Also delete all employees of this company
  const employees = getEmployees();
  const filteredEmployees = employees.filter(e => e.companyId !== id);
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(filteredEmployees));
};

// Departments
export const addDepartmentToCompany = (companyId: string, departmentName: string): Department => {
  const companies = getCompanies();
  const company = companies.find(c => c.id === companyId);
  
  if (!company) {
    throw new Error("Empresa não encontrada");
  }
  
  // Garantir que a propriedade departments existe
  if (!company.departments) {
    company.departments = [];
  }
  
  const newDepartment: Department = {
    id: `${companyId}-${Date.now()}`,
    name: departmentName,
    companyId
  };
  
  company.departments.push(newDepartment);
  updateCompany(company);
  
  return newDepartment;
};

export const getDepartmentsByCompany = (companyId: string): Department[] => {
  const company = getCompanyById(companyId);
  return company && company.departments ? company.departments : [];
};

export const deleteDepartment = (companyId: string, departmentId: string): void => {
  const companies = getCompanies();
  const company = companies.find(c => c.id === companyId);
  
  if (!company || !company.departments) return;
  
  company.departments = company.departments.filter(d => d.id !== departmentId);
  updateCompany(company);
  
  // Update employees that had this department
  const employees = getEmployees();
  const updatedEmployees = employees.map(e => {
    if (e.departmentId === departmentId) {
      return { ...e, departmentId: "" };
    }
    return e;
  });
  
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(updatedEmployees));
};

// Job Roles
export const getJobRoles = (): JobRole[] => {
  const jobRoles = localStorage.getItem(JOB_ROLES_KEY);
  if (!jobRoles) {
    localStorage.setItem(JOB_ROLES_KEY, JSON.stringify(initialJobRoles));
    return initialJobRoles;
  }
  return JSON.parse(jobRoles);
};

export const addJobRole = (name: string): JobRole => {
  const jobRoles = getJobRoles();
  
  // Check for similar names to avoid duplicates
  const normalizedName = name.toLowerCase().trim();
  const similarExists = jobRoles.some(role => 
    role.name.toLowerCase().trim() === normalizedName
  );
  
  if (similarExists) {
    throw new Error("Uma função com nome similar já existe");
  }
  
  const newRole: JobRole = {
    id: Date.now().toString(),
    name
  };
  
  localStorage.setItem(JOB_ROLES_KEY, JSON.stringify([...jobRoles, newRole]));
  return newRole;
};

export const deleteJobRole = (id: string): void => {
  const jobRoles = getJobRoles();
  const filteredRoles = jobRoles.filter(r => r.id !== id);
  localStorage.setItem(JOB_ROLES_KEY, JSON.stringify(filteredRoles));
};

export const getJobRoleById = (id: string): JobRole | undefined => {
  return getJobRoles().find(r => r.id === id);
};

// Employees
export const getEmployees = (): Employee[] => {
  const employees = localStorage.getItem(EMPLOYEES_KEY);
  if (!employees) {
    return [];
  }
  return JSON.parse(employees);
};

export const getEmployeesByCompany = (companyId: string): Employee[] => {
  const employees = getEmployees();
  return employees.filter(e => e.companyId === companyId);
};

export const addEmployee = (employee: Omit<Employee, "id">): Employee => {
  const employees = getEmployees();
  const newEmployee: Employee = {
    ...employee,
    id: Date.now().toString()
  };
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify([...employees, newEmployee]));
  return newEmployee;
};

export const updateEmployee = (employee: Employee): void => {
  const employees = getEmployees();
  const updatedEmployees = employees.map(e => e.id === employee.id ? employee : e);
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(updatedEmployees));
};

export const deleteEmployee = (id: string): void => {
  const employees = getEmployees();
  const filteredEmployees = employees.filter(e => e.id !== id);
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(filteredEmployees));
};

export const getDepartmentById = (companyId: string, departmentId: string): Department | undefined => {
  const company = getCompanyById(companyId);
  return company?.departments?.find(d => d.id === departmentId);
};

export const getCompanyById = (id: string): Company | undefined => {
  return getCompanies().find(c => c.id === id);
};
