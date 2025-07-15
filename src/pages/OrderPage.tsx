import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, payOrder } from '../store/slices/orderSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, CreditCard } from 'lucide-react';

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const { order, loading, error } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!order._id || order._id !== id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id, order]);

  const simulatePayment = async () => {
    setPaymentProcessing(true);
    
    // Simular processamento de pagamento
    setTimeout(() => {
      const paymentResult = {
        id: `pay_${Date.now()}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        payer: {
          email_address: userInfo.email,
        },
      };
      
      dispatch(payOrder({ orderId: id, paymentResult }));
      setPaymentProcessing(false);
    }, 2000);
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

  if (!order._id) {
    return (
      <Alert>
        <AlertDescription>Pedido não encontrado</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pedido #{order._id}</h1>
        <div className="flex space-x-2">
          <Badge variant={order.isPaid ? 'default' : 'secondary'}>
            {order.isPaid ? 'Pago' : 'Pendente'}
          </Badge>
          <Badge variant={order.isDelivered ? 'default' : 'secondary'}>
            {order.isDelivered ? 'Entregue' : 'Processando'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Endereço de Entrega
                {order.isDelivered ? (
                  <CheckCircle className="ml-2 h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="ml-2 h-5 w-5 text-red-600" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                <strong>Nome:</strong> {order.user.name}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {order.user.email}
              </p>
              <p className="mb-4">
                <strong>Endereço:</strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Entregue em {new Date(order.deliveredAt).toLocaleDateString('pt-BR')}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="secondary">
                  <AlertDescription>Não entregue</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Método de Pagamento
                {order.isPaid ? (
                  <CheckCircle className="ml-2 h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="ml-2 h-5 w-5 text-red-600" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                <strong>Método:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Pago em {new Date(order.paidAt).toLocaleDateString('pt-BR')}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="secondary">
                  <AlertDescription>Não pago</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Itens do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
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
                <span>R$ {order.itemsPrice?.toFixed(2) || '0.00'}</span>
              </div>

              <div className="flex justify-between">
                <span>Frete:</span>
                <span>R$ {order.shippingPrice?.toFixed(2) || '0.00'}</span>
              </div>

              <div className="flex justify-between">
                <span>Taxa:</span>
                <span>R$ {order.taxPrice?.toFixed(2) || '0.00'}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>R$ {order.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>

              {!order.isPaid && (
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={simulatePayment}
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando Pagamento...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pagar Agora
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-600 text-center">
                    * Simulação de pagamento para demonstração
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;

