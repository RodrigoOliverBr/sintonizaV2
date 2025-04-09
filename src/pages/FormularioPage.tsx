
// Adicionar a correção para os erros de compilação TS2554 e TS2339
// Em vez de employee.role, usar employee.roleId
// E garantir que o segundo argumento é passado para a função

// Se estiver apenas acessando a propriedade roleId do employee:
const jobRoleName = getJobRoleById(employee.roleId)?.name || "Não especificado";

// Se estiver chamando uma função que espera 2 argumentos:
someFunction(param1, param2);
