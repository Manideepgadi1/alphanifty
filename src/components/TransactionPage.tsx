import { useState } from 'react';
import { Header } from './Header';
import { User, Basket, CartItem } from '../App';
import { mockBaskets } from '../data/mockData';
import { ArrowLeft, Calendar, CreditCard, ShoppingCart } from 'lucide-react';

interface TransactionPageProps {
  basket: Basket | null;
  navigateTo: (page: any) => void;
  user: User | null;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
}

export function TransactionPage({ basket, navigateTo, user, cart, addToCart }: TransactionPageProps) {
  const currentBasket = basket || mockBaskets[0];
  
  const [investmentType, setInvestmentType] = useState<'SIP' | 'Lumpsum'>('SIP');
  const [amount, setAmount] = useState(currentBasket.minInvestment.toString());
  const [frequency, setFrequency] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      basket: currentBasket,
      amount: parseFloat(amount),
      type: investmentType,
      frequency: investmentType === 'SIP' ? frequency : undefined
    };
    addToCart(cartItem);
    navigateTo('cart');
  };

  const handleProceedToPayment = () => {
    const cartItem: CartItem = {
      basket: currentBasket,
      amount: parseFloat(amount),
      type: investmentType,
      frequency: investmentType === 'SIP' ? frequency : undefined
    };
    addToCart(cartItem);
    navigateTo('checkout');
  };

  return (
    <div className="min-h-screen">
      <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={cart.length} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigateTo(basket ? 'basket-details' : 'basket-list')}
          className="flex items-center space-x-2 text-[#2E89C4] hover:text-[#2576a8] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{basket ? 'Back to Basket Details' : 'Back to Baskets'}</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-[#1B263B] mb-8">Complete Your Investment</h1>

          {/* Basket Info */}
          <div className="bg-[#F5F7FA] rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div
                className="w-16 h-16 rounded-xl shadow-md"
                style={{ 
                  backgroundColor: currentBasket.color,
                  border: currentBasket.color === '#FFFFFF' ? '2px solid #E5E7EB' : 'none'
                }}
              />
              <div className="flex-1">
                <h2 className="text-[#1B263B] mb-2">{currentBasket.name}</h2>
                <p className="text-gray-600">{currentBasket.description}</p>
              </div>
            </div>
          </div>

          {/* Investment Type */}
          <div className="mb-8">
            <label className="block text-gray-700 mb-4">Select Investment Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setInvestmentType('SIP')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  investmentType === 'SIP'
                    ? 'border-[#2E89C4] bg-[#2E89C4] text-white shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Calendar className="w-8 h-8 mx-auto mb-3" />
                <h3 className="mb-2">SIP</h3>
                <p className={`text-sm ${investmentType === 'SIP' ? 'text-white/80' : 'text-gray-600'}`}>
                  Systematic Investment Plan
                </p>
              </button>
              <button
                onClick={() => setInvestmentType('Lumpsum')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  investmentType === 'Lumpsum'
                    ? 'border-[#2E89C4] bg-[#2E89C4] text-white shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="w-8 h-8 mx-auto mb-3" />
                <h3 className="mb-2">Lumpsum</h3>
                <p className={`text-sm ${investmentType === 'Lumpsum' ? 'text-white/80' : 'text-gray-600'}`}>
                  One-time Investment
                </p>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-8">
            <label className="block text-gray-700 mb-2">
              {investmentType === 'SIP' ? 'Monthly Investment Amount (₹)' : 'Investment Amount (₹)'}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none text-xl"
              min={currentBasket.minInvestment}
            />
            {investmentType === 'SIP' && (
              <p className="text-sm text-gray-500 mt-2">
                Minimum: ₹{currentBasket.minInvestment.toLocaleString()}/month
              </p>
            )}
          </div>

          {/* Frequency (for SIP) */}
          {investmentType === 'SIP' && (
            <div className="mb-8">
              <label className="block text-gray-700 mb-4">Payment Frequency</label>
              <div className="grid grid-cols-3 gap-4">
                {(['Monthly', 'Quarterly', 'Yearly'] as const).map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setFrequency(freq)}
                    className={`py-3 rounded-lg border-2 transition-all ${
                      frequency === freq
                        ? 'border-[#2E89C4] bg-[#2E89C4] text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Start Date */}
          <div className="mb-8">
            <label className="block text-gray-700 mb-2">
              {investmentType === 'SIP' ? 'SIP Start Date' : 'Investment Date'}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-[#3BAF4A]/10 to-[#2E89C4]/10 rounded-xl p-6 mb-8">
            <h3 className="text-[#1B263B] mb-4">Investment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Basket:</span>
                <span className="text-[#1B263B]">{currentBasket.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="text-[#1B263B]">{investmentType}</span>
              </div>
              {investmentType === 'SIP' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="text-[#1B263B]">{frequency}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="text-2xl text-[#3BAF4A]">₹{parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Funds:</span>
                <span className="text-[#1B263B]">{currentBasket.funds.length}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#E8C23A] hover:bg-[#d4b034] text-[#1B263B] py-4 rounded-lg transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleProceedToPayment}
              className="flex-1 bg-[#3BAF4A] hover:bg-[#329940] text-white py-4 rounded-lg transition-all shadow-lg"
            >
              Proceed to Payment
            </button>
          </div>

          {/* Terms */}
          <div className="mt-6 text-sm text-gray-600 text-center">
            <label className="flex items-center justify-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" required />
              <span>I agree to the terms and conditions and have read all scheme documents</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
