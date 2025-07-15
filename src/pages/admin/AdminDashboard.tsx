import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listOrders } from '../../store/slices/orderSlice';
import { listProducts } from '../../store/slices/productSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  Eye
} from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  
  const { orders } = useSelector((state) => state.order);
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(listOrders());
    dispatch(listProducts({}));
  }, [dispatch]);

  // Calcular estatísticas
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalRevenue = orders
    .filter(order => order.isPaid)
    .reduce((acc, order) => acc + order.totalPrice, 0);
  const pendingOrders = orders.filter(order => !order.isPaid).length;

  const stats = [
    {
      title: 'Total de Pedidos',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total de Produtos',
      value: totalProducts,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Receita Total',
      value: `R$ ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Pedidos Pendentes',
      value: pendingOrders,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Gerenciar Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Visualize e gerencie todos os usuários da plataforma.
            </p>
            <Button asChild className="w-full">
              <Link to="/admin/users">
                <Eye className="mr-2 h-4 w-4" />
                Ver Usuários
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Gerenciar Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Adicione, edite ou remova produtos do catálogo.
            </p>
            <Button asChild className="w-full">
              <Link to="/admin/products">
                <Eye className="mr-2 h-4 w-4" />
                Ver Produtos
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Gerenciar Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Acompanhe e gerencie todos os pedidos realizados.
            </p>
            <Button asChild className="w-full">
              <Link to="/admin/orders">
                <Eye className="mr-2 h-4 w-4" />
                Ver Pedidos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-gray-600">Nenhum pedido encontrado.</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Pedido #{order._id.slice(-8)}</p>
                    <p className="text-sm text-gray-600">
                      {order.user?.name} - {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">R$ {order.totalPrice.toFixed(2)}</p>
                    <p className={`text-sm ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                      {order.isPaid ? 'Pago' : 'Pendente'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

