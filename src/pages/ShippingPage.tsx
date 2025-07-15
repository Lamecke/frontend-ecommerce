import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const ShippingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shippingAddress } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || 'Brasil');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className="max-w-md mx-auto">
      <Button variant="ghost" onClick={() => navigate('/cart')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar ao Carrinho
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Endereço de Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                type="text"
                placeholder="Digite seu endereço completo"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                type="text"
                placeholder="Digite sua cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="postalCode">CEP</Label>
              <Input
                id="postalCode"
                type="text"
                placeholder="Digite seu CEP"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                type="text"
                placeholder="Digite seu país"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Continuar para Pagamento
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingPage;

