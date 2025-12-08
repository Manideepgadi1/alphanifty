import { useState } from 'react';
import { Header } from './Header';
import { User, CartItem, Basket } from '../App';
import { CreditCard, Building, Smartphone, CheckCircle, ArrowLeft, FileText, Info } from 'lucide-react';

interface CheckoutPageProps {
  cart: CartItem[];
  navigateTo: (page: any) => void;
  user: User | null;
  clearCart: () => void;
  setMyBaskets: React.Dispatch<React.SetStateAction<Basket[]>>;
}

export function CheckoutPage({ cart, navigateTo, user, clearCart, setMyBaskets }: CheckoutPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'netbanking' | 'upi'>('upi');
  const [cardPaymentMode, setCardPaymentMode] = useState<'one-time' | 'mandate'>('one-time');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + item.amount, 0);

  // Mock mandate details - in real app, these would come from backend/API
  const mandateDetails = {
    mandateId: 'MND' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    bankName: 'HDFC Bank',
    accountNumber: '****7890',
    maxAmount: totalAmount,
    frequency: 'Monthly',
    startDate: new Date().toLocaleDateString('en-IN'),
    status: 'Active'
  };

  const handlePayment = () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      
      // Add baskets to user's portfolio with unique IDs to avoid duplicates
      const newBaskets = cart.map((item, index) => ({
        ...item.basket,
        id: `${item.basket.id}-${Date.now()}-${index}` // Make unique ID for each purchase
      }));
      setMyBaskets(prev => [...prev, ...newBaskets]);
      
      // Clear cart and redirect to dashboard after 3 seconds
      setTimeout(() => {
        clearCart();
        navigateTo('dashboard');
      }, 3000);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen">
        <Header navigateTo={navigateTo} user={user} />
        
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-xl shadow-2xl p-12">
            <div className="w-20 h-20 bg-[#3BAF4A] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-[#1B263B] mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your investment has been processed successfully
            </p>
            <div className="bg-[#F5F7FA] rounded-lg p-6 mb-8">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Invested:</span>
                  <span className="text-2xl text-[#3BAF4A]">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Baskets:</span>
                  <span className="text-[#1B263B]">{cart.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="text-[#1B263B] font-mono">TXN{Date.now()}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-6">Redirecting to dashboard...</p>
            <button
              onClick={() => {
                clearCart();
                navigateTo('dashboard');
              }}
              className="bg-[#2E89C4] hover:bg-[#2576a8] text-white px-8 py-3 rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    navigateTo('cart');
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header navigateTo={navigateTo} user={user} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigateTo('cart')}
          className="flex items-center space-x-2 text-[#2E89C4] hover:text-[#2576a8] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-[#1B263B] mb-8">Complete Your Payment</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-[#1B263B] mb-6">Select Payment Method</h2>

              <div className="space-y-4">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === 'upi'
                      ? 'border-[#2E89C4] bg-[#2E89C4]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Smartphone className={`w-8 h-8 ${paymentMethod === 'upi' ? 'text-[#2E89C4]' : 'text-gray-400'}`} />
                    <div>
                      <h3 className="text-[#1B263B] mb-1">UPI</h3>
                      <p className="text-sm text-gray-600">Pay using Google Pay, PhonePe, Paytm etc.</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === 'card'
                      ? 'border-[#2E89C4] bg-[#2E89C4]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <CreditCard className={`w-8 h-8 ${paymentMethod === 'card' ? 'text-[#2E89C4]' : 'text-gray-400'}`} />
                    <div>
                      <h3 className="text-[#1B263B] mb-1">Mandate</h3>
                      <p className="text-sm text-gray-600">One-time or recurring card payments</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#2E89C4] bg-[#2E89C4]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Building className={`w-8 h-8 ${paymentMethod === 'netbanking' ? 'text-[#2E89C4]' : 'text-gray-400'}`} />
                    <div>
                      <h3 className="text-[#1B263B] mb-1">Net Banking</h3>
                      <p className="text-sm text-gray-600">All major banks supported</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Details Form */}
            {paymentMethod === 'upi' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-[#1B263B] mb-4">Enter UPI ID</h3>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none mb-4"
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-[#1B263B] mb-6">Payment Mode</h3>
                <div className="flex items-center space-x-4 mb-6">
                  <button
                    onClick={() => setCardPaymentMode('one-time')}
                    className={`flex-1 py-3 rounded-lg transition-all ${
                      cardPaymentMode === 'one-time'
                        ? 'bg-[#2E89C4] text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    One-Time
                  </button>
                  <button
                    onClick={() => setCardPaymentMode('mandate')}
                    className={`flex-1 py-3 rounded-lg transition-all ${
                      cardPaymentMode === 'mandate'
                        ? 'bg-[#2E89C4] text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    Mandate
                  </button>
                </div>

                {cardPaymentMode === 'mandate' && (
                  <div>
                    <h4 className="text-[#1B263B] mb-3">Mandate Details</h4>
                    <div className="bg-[#F5F7FA] rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-300">
                          <span className="text-gray-600">Mandate ID:</span>
                          <span className="text-[#1B263B] font-mono">{mandateDetails.mandateId}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-300">
                          <span className="text-gray-600">Bank Name:</span>
                          <span className="text-[#1B263B]">{mandateDetails.bankName}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-300">
                          <span className="text-gray-600">Account Number:</span>
                          <span className="text-[#1B263B]">{mandateDetails.accountNumber}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-300">
                          <span className="text-gray-600">Max Amount:</span>
                          <span className="text-[#1B263B]">₹{mandateDetails.maxAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-300">
                          <span className="text-gray-600">Frequency:</span>
                          <span className="text-[#1B263B]">{mandateDetails.frequency}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-300">
                          <span className="text-gray-600">Start Date:</span>
                          <span className="text-[#1B263B]">{mandateDetails.startDate}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Status:</span>
                          <span className="px-3 py-1 bg-green-100 text-[#3BAF4A] rounded-full text-sm">{mandateDetails.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-[#1B263B] mb-4">Select Bank</h3>
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none">
                  <option>Select your bank</option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-[#1B263B] mb-6">Payment Summary</h3>

              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className="w-8 h-8 rounded"
                        style={{ 
                          backgroundColor: item.basket.color,
                          border: item.basket.color === '#FFFFFF' ? '2px solid #E5E7EB' : 'none'
                        }}
                      />
                      <p className="text-sm text-[#1B263B]">{item.basket.name}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.type}</span>
                      <span className="text-[#1B263B]">₹{item.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t-2 border-gray-200">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-600">Total Amount:</span>
                    <div className="text-right">
                      <p className="text-3xl text-[#3BAF4A]">₹{totalAmount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">
                        {cart.some(item => item.type === 'SIP') ? 'per month' : 'one-time'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className={`w-full py-4 rounded-lg transition-all shadow-lg ${
                  processing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#3BAF4A] hover:bg-[#329940] text-white'
                }`}
              >
                {processing ? 'Processing...' : 'Pay Now'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By proceeding, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}