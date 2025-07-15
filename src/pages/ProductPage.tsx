import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Star, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);

  const { product, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  const addToCartHandler = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty: Number(qty),
    }));
    navigate('/cart');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-5 w-5 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      );
    }

    return stars;
  };

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

  if (!product._id) {
    return (
      <Alert>
        <AlertDescription>Produto não encontrado</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                {renderStars(product.rating)}
              </div>
              <span className="text-gray-600">
                {product.numReviews} avaliações
              </span>
            </div>
            <p className="text-gray-700 text-lg">{product.description}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-600">Marca:</span>
              <span className="ml-2 font-medium">{product.brand}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Categoria:</span>
              <span className="ml-2 font-medium">{product.category}</span>
            </div>
          </div>

          <Separator />

          {/* Purchase Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                R$ {product.price?.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`ml-2 font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {product.countInStock > 0 ? 'Em estoque' : 'Fora de estoque'}
                </span>
              </div>

              {product.countInStock > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="qty">Quantidade:</Label>
                  <Select value={qty.toString()} onValueChange={(value) => setQty(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                        <SelectItem key={x + 1} value={(x + 1).toString()}>
                          {x + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                className="w-full"
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.countInStock === 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Avaliações</h2>
        {product.reviews && product.reviews.length === 0 ? (
          <p className="text-gray-600">Nenhuma avaliação ainda.</p>
        ) : (
          <div className="space-y-4">
            {product.reviews?.map((review) => (
              <Card key={review._id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.name}</span>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;

