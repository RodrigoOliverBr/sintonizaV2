
import { Company, Department, Employee } from "@/types/cadastro";

// Keys for localStorage
const COMPANIES_KEY = "istas21:companies";
const DEPARTMENTS_KEY = "istas21:departments";
const EMPLOYEES_KEY = "istas21:employees";

// Initial data
const initialCompanies: Company[] = [
  { id: "1", name: "eSocial Brasil" },
  { id: "2", name: "Tech Solutions Ltda." }
];

const initialDepartments: Department[] = [
  { id: "1", name: "Recursos Humanos" },
  { id: "2", name: "Tecnologia da Informação" },
  { id: "3", name: "Administrativo" },
  { id: "4", name: "Financeiro" },
  { id: "5", name: "Operacional" }
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

export const addCompany = (company: Omit<Company, "id">): Company => {
  const companies = getCompanies();
  const newCompany: Company = {
    ...company,
    id: Date.now().toString()
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
};

// Departments
export const getDepartments = (): Department[] => {
  const departments = localStorage.getItem(DEPARTMENTS_KEY);
  if (!departments) {
    localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(initialDepartments));
    return initialDepartments;
  }
  return JSON.parse(departments);
};

export const addDepartment = (department: Omit<Department, "id">): Department => {
  const departments = getDepartments();
  const newDepartment: Department = {
    ...department,
    id: Date.now().toString()
  };
  localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify([...departments, newDepartment]));
  return newDepartment;
};

export const updateDepartment = (department: Department): void => {
  const departments = getDepartments();
  const updatedDepartments = departments.map(d => d.id === department.id ? department : d);
  localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(updatedDepartments));
};

export const deleteDepartment = (id: string): void => {
  const departments = getDepartments();
  const filteredDepartments = departments.filter(d => d.id !== id);
  localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(filteredDepartments));
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

export const getDepartmentById = (id: string): Department | undefined => {
  return getDepartments().find(d => d.id === id);
};

export const getCompanyById = (id: string): Company | undefined => {
  return getCompanies().find(c => c.id === id);
};
