import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CreditCard, Smartphone } from 'lucide-react';

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shippingAddress, paymentMethod } = useSelector((state) => state.cart);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethod || 'Cartão de Crédito'
  );

  // Redirecionar se não houver endereço de entrega
  if (!shippingAddress.address) {
    navigate('/shipping');
    return null;
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(selectedPaymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="max-w-md mx-auto">
      <Button variant="ghost" onClick={() => navigate('/shipping')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar ao Endereço
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Método de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="space-y-6">
            <RadioGroup
              value={selectedPaymentMethod}
              onValueChange={setSelectedPaymentMethod}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="Cartão de Crédito" id="credit-card" />
                <CreditCard className="h-5 w-5 text-gray-600" />
                <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                  Cartão de Crédito
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="Cartão de Débito" id="debit-card" />
                <CreditCard className="h-5 w-5 text-gray-600" />
                <Label htmlFor="debit-card" className="flex-1 cursor-pointer">
                  Cartão de Débito
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="PIX" id="pix" />
                <Smartphone className="h-5 w-5 text-gray-600" />
                <Label htmlFor="pix" className="flex-1 cursor-pointer">
                  PIX
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="Boleto Bancário" id="boleto" />
                <CreditCard className="h-5 w-5 text-gray-600" />
                <Label htmlFor="boleto" className="flex-1 cursor-pointer">
                  Boleto Bancário
                </Label>
              </div>
            </RadioGroup>

            <Button type="submit" className="w-full">
              Continuar para Revisão
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;

