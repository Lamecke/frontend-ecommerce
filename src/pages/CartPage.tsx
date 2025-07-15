import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateCartPrices } from '../store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(updateCartPrices());
  }, [cartItems, dispatch]);

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=/shipping');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Seu carrinho está vazio
        </h2>
        <p className="text-gray-500 mb-6">
          Adicione alguns produtos ao seu carrinho para continuar
        </p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuar Comprando
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Carrinho de Compras</h1>
        <Button variant="ghost" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuar Comprando
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.product}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product}`}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xl font-bold text-primary mt-1">
                      R$ {item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-2">
                    <Select
                      value={item.qty.toString()}
                      onValueChange={(value) =>
                        addToCartHandler(item, Number(value))
                      }
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(Math.min(item.countInStock, 10)).keys()].map((x) => (
                          <SelectItem key={x + 1} value={(x + 1).toString()}>
                            {x + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} itens):</span>
                <span>R$ {itemsPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Frete:</span>
                <span>
                  {shippingPrice === 0 ? 'Grátis' : `R$ ${shippingPrice.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Taxa:</span>
                <span>R$ {taxPrice.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
              </div>

              {shippingPrice === 0 && (
                <Alert>
                  <AlertDescription>
                    🎉 Você ganhou frete grátis!
                  </AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full"
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
              >
                Finalizar Compra
              </Button>

              <p className="text-sm text-gray-600 text-center">
                Frete grátis para compras acima de R$ 100
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

