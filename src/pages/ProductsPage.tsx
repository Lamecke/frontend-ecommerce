import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { listTopProducts } from '../store/slices/productSlice';
import ProductList from '../components/product/ProductList';

const ProductsPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listTopProducts());
  }, [dispatch]);

  return (
    <div className="space-y-12">
      {/* All Products Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Todos os Produtos</h2>
        <ProductList />
      </section>
    </div>
  );
};

export default ProductsPage;

