
  const loadData = () => {
    setCompanies(getCompanies());
    
    const allEmployees = getEmployees();
    if (selectedCompanyId && selectedCompanyId !== "all") {
      setEmployees(allEmployees.filter(e => e.companyId === selectedCompanyId));
    } else {
      setEmployees(allEmployees);
    }
  };
