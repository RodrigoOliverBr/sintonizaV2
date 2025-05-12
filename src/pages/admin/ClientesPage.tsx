
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Pencil, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { addCliente, deleteCliente, getClientes, updateCliente } from "@/services/adminService";
import { Cliente } from "@/types/admin";
import EditClienteDialog from "@/components/dialogs/EditClienteDialog";
import DeleteConfirmationDialog from "@/components/dialogs/DeleteConfirmationDialog";
import { toast } from "sonner";

const ClientesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<Cliente[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  
  useEffect(() => {
    // Load clients on component mount
    loadClientes();
  }, []);
  
  const loadClientes = () => {
    const clientesList = getClientes();
    setClients(clientesList);
  };
  
  const filteredClients = clients.filter(client => 
    client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNewClient = () => {
    setSelectedClient(null);
    setIsEditDialogOpen(true);
  };

  const handleEditClient = (client: Cliente) => {
    setSelectedClient(client);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClient = (client: Cliente) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteClient = () => {
    if (selectedClient) {
      try {
        deleteCliente(selectedClient.id);
        toast.success("Cliente excluído com sucesso!");
        loadClientes();
      } catch (error) {
        toast.error(`Erro ao excluir cliente: ${error}`);
      }
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveClient = (clienteData: Omit<Cliente, "id">) => {
    try {
      if (selectedClient) {
        // Update existing client
        updateCliente({
          ...clienteData,
          id: selectedClient.id
        });
      } else {
        // Create new client
        addCliente(clienteData);
      }
      loadClientes();
    } catch (error) {
      toast.error(`Erro ao salvar cliente: ${error}`);
    }
  };

  return (
    <AdminLayout title="Gerenciar Clientes">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Lista de Clientes</CardTitle>
          <CardDescription>
            Visualize e gerencie os clientes cadastrados no sistema
          </CardDescription>
          
          <div className="flex items-center gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={handleOpenNewClient}>Novo Cliente</Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.nome}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.plano}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.situacao === 'liberado'
                          ? 'bg-green-100 text-green-800'
                          : client.situacao === 'pendente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {client.situacao === 'liberado' ? 'Ativo' : 
                         client.situacao === 'pendente' ? 'Pendente' : 'Bloqueado'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEditClient(client)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => handleDeleteClient(client)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-gray-500">
            Mostrando {filteredClients.length} de {clients.length} clientes
          </div>
        </CardFooter>
      </Card>

      {/* Edit/Create Client Dialog */}
      <EditClienteDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        cliente={selectedClient}
        onSave={handleSaveClient}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteClient}
        title="Excluir Cliente"
        description="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
      />
    </AdminLayout>
  );
};

export default ClientesPage;
