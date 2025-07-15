import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, User, Edit, Trash2 } from 'lucide-react';

const AdminUsers = () => {
  // Para demonstração, vamos usar dados mockados
  // Em uma implementação real, você criaria actions para buscar usuários
  const { userInfo } = useSelector((state) => state.auth);
  
  // Dados mockados para demonstração
  const mockUsers = [
    {
      _id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      isAdmin: false,
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      _id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      isAdmin: false,
      createdAt: '2024-01-20T14:20:00Z',
    },
    {
      _id: '3',
      name: 'Admin User',
      email: 'admin@email.com',
      isAdmin: true,
      createdAt: '2024-01-01T08:00:00Z',
    },
  ];

  const deleteHandler = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      // Implementar lógica de deletar usuário
      console.log('Deletar usuário:', id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-mono text-sm">
                    {user._id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Shield className="mr-1 h-3 w-3" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <User className="mr-1 h-3 w-3" />
                        Usuário
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteHandler(user._id)}
                        disabled={user._id === userInfo?._id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;

