import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../store/slices/orderSlice';
import { clearCartItems, updateCartPrices } from '../store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2 } from 'lucide-react';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useSelector((state) => state.cart);

  const { order, success, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(updateCartPrices());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
      dispatch(clearCartItems());
    }
  }, [navigate, success, order, dispatch]);

  // Redirecionar se não houver itens no carrinho
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  // Redirecionar se não houver endereço ou método de pagamento
  if (!shippingAddress.address || !paymentMethod) {
    navigate('/shipping');
    return null;
  }

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => navigate('/payment')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar ao Pagamento
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping */}
          <Card>
            <CardHeader>
              <CardTitle>Endereço de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Endereço:</strong> {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </p>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Método de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Método:</strong> {paymentMethod}
              </p>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Itens do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <Alert>
                  <AlertDescription>Seu carrinho está vazio</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product} className="flex items-center space-x-4">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          {item.qty} x R$ {item.price.toFixed(2)} = R${' '}
                          {(item.qty * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Itens:</span>
                <span>R$ {itemsPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Frete:</span>
                <span>R$ {shippingPrice.toFixed(2)}</span>
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

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full"
                onClick={placeOrderHandler}
                disabled={cartItems.length === 0 || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Finalizar Pedido'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;

