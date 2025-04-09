
import React, { useState, useEffect } from "react";
import { getJobRoles } from "@/services/storageService";
import Layout from "@/components/Layout";
import { JobRole } from "@/types/cadastro";

const FormularioPage: React.FC = () => {
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);

  useEffect(() => {
    // Load job roles
    setJobRoles(getJobRoles());
  }, []);

  // Utility function to get job role by id
  const getJobRoleById = (roleId: string) => {
    return jobRoles.find(role => role.id === roleId);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Formulário de Avaliação</h1>
        <p className="text-lg mb-8">
          Utilize este formulário para realizar a avaliação de riscos ocupacionais.
        </p>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p>Conteúdo do formulário em desenvolvimento.</p>
        </div>
      </div>
    </Layout>
  );
};

export default FormularioPage;
