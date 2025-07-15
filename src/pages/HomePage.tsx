import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listTopProducts } from '../store/slices/productSlice';
import ProductList from '../components/product/ProductList';
import ProductCard from '../components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingBag, Truck, Shield, Headphones } from 'lucide-react';

const HomePage = () => {
  const dispatch = useDispatch();
  const { topProducts, loading: topProductsLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(listTopProducts());
  }, [dispatch]);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bem-vindo ao E-Shop
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Descubra os melhores produtos com qualidade garantida e entrega rápida
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
          <p className="text-gray-600">
            Entrega gratuita para compras acima de R$ 100
          </p>
        </div>

        <div className="text-center p-6">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Compra Segura</h3>
          <p className="text-gray-600">
            Seus dados protegidos com criptografia de ponta
          </p>
        </div>

        <div className="text-center p-6">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Headphones className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Suporte 24/7</h3>
          <p className="text-gray-600">
            Atendimento especializado sempre que precisar
          </p>
        </div>
      </section>

      {/* Top Products Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Produtos em Destaque</h2>
          <Button variant="outline" asChild>
            <Link to="/products">Ver Todos</Link>
          </Button>
        </div>

        {topProductsLoading ? (
          <div className="flex justify-center items-center min-h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {topProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* All Products Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Todos os Produtos</h2>
        <ProductList />
      </section>
    </div>
  );
};

export default HomePage;

