import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { listProducts } from '../../store/slices/productSlice';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { RootState, AppDispatch } from '@/store/store';
import type { Product } from '@/types';

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { keyword } = useParams<{ keyword?: string }>();

  const { products, loading, error } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(listProducts({ keyword: keyword || '', pageNumber: '' }));
  }, [dispatch, keyword]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Nenhum produto encontrado
        </h2>
        <p className="text-gray-500">
          {keyword
            ? `Não encontramos produtos para "${keyword}"`
            : 'Não há produtos disponíveis no momento'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {keyword && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            Resultados para "{keyword}"
          </h2>
          <p className="text-gray-600">
            {products.length} produto(s) encontrado(s)
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
