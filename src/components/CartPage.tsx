import { Header } from './Header';
import { User, CartItem } from '../App';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, TrendingUp, PieChart } from 'lucide-react';
import { useState } from 'react';

interface CartPageProps {
  cart: CartItem[];
  navigateTo: (page: any) => void;
  user: User | null;
  removeFromCart: (index: number) => void;
  updateCartItem?: (index: number, updates: Partial<CartItem>) => void;
}

export function CartPage({ cart, navigateTo, user, removeFromCart, updateCartItem }: CartPageProps) {
  // State to manage lumpsum and SIP amounts for each cart item
  const [lumpsumAmounts, setLumpsumAmounts] = useState<number[]>(
    cart.map(item => item.type === 'Lumpsum' ? item.amount : 0)
  );
  const [sipAmounts, setSipAmounts] = useState<number[]>(
    cart.map(item => item.type === 'SIP' ? item.amount : 0)
  );

  // State for SIP date range
  const [sipStartDates, setSipStartDates] = useState<string[]>(
    cart.map(() => {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);
      return nextMonth.toISOString().split('T')[0];
    })
  );
  const [sipEndDates, setSipEndDates] = useState<string[]>(
    cart.map(() => {
      const fiveYears = new Date();
      fiveYears.setFullYear(fiveYears.getFullYear() + 5);
      return fiveYears.toISOString().split('T')[0];
    })
  );
  const [sipDates, setSipDates] = useState<number[]>(
    cart.map(() => 1) // Default SIP date is 1st of every month
  );

  const handleLumpsumChange = (index: number, value: string) => {
    const amount = parseFloat(value) || 0;
    const newAmounts = [...lumpsumAmounts];
    newAmounts[index] = amount;
    setLumpsumAmounts(newAmounts);
    
    if (updateCartItem) {
      updateCartItem(index, { amount: amount + sipAmounts[index], type: amount > 0 ? 'Lumpsum' : 'SIP' });
    }
  };

  const handleSipChange = (index: number, value: string) => {
    const amount = parseFloat(value) || 0;
    const newAmounts = [...sipAmounts];
    newAmounts[index] = amount;
    setSipAmounts(newAmounts);
    
    if (updateCartItem) {
      updateCartItem(index, { amount: lumpsumAmounts[index] + amount, type: 'SIP' });
    }
  };

  const handleSipStartDateChange = (index: number, date: string) => {
    const newDates = [...sipStartDates];
    newDates[index] = date;
    setSipStartDates(newDates);
  };

  const handleSipEndDateChange = (index: number, date: string) => {
    const newDates = [...sipEndDates];
    newDates[index] = date;
    setSipEndDates(newDates);
  };

  const handleSipDateChange = (index: number, date: number) => {
    const newDates = [...sipDates];
    newDates[index] = date;
    setSipDates(newDates);
  };

  const calculateSipDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return Math.max(0, months);
  };

  const totalAmount = cart.reduce((sum, item, index) => 
    sum + lumpsumAmounts[index] + sipAmounts[index], 0
  );
  const totalLumpsum = lumpsumAmounts.reduce((sum, amt) => sum + amt, 0);
  const totalSip = sipAmounts.reduce((sum, amt) => sum + amt, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen">
        <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={cart.length} />
        
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h2 className="text-[#1B263B] mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some baskets to your cart to get started</p>
          <button
            onClick={() => navigateTo('basket-list')}
            className="bg-[#2E89C4] hover:bg-[#2576a8] text-white px-8 py-3 rounded-lg transition-colors"
          >
            Explore Baskets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={cart.length} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigateTo('basket-list')}
          className="flex items-center space-x-2 text-[#2E89C4] hover:text-[#1B263B] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Continue Shopping</span>
        </button>

        <h1 className="text-[#1B263B] mb-8">Your Investment Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item, index) => {
              const currentLumpsum = lumpsumAmounts[index];
              const currentSip = sipAmounts[index];
              const totalInvestment = currentLumpsum + currentSip;
              
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div
                        className="w-16 h-16 rounded-lg shadow-md flex-shrink-0"
                        style={{ 
                          backgroundColor: item.basket.color,
                          border: item.basket.color === '#FFFFFF' ? '2px solid #E5E7EB' : 'none'
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-[#1B263B] mb-2">{item.basket.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{item.basket.description}</p>
                        {item.goal && (
                          <span className="inline-block text-xs bg-[#2E89C4]/10 text-[#2E89C4] px-3 py-1 rounded-full">
                            Goal: {item.goal}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 hover:text-red-700 transition-colors ml-4"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Investment Amount Inputs */}
                  <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-100">
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">Lumpsum Amount (₹)</label>
                      <input
                        type="number"
                        value={currentLumpsum || ''}
                        onChange={(e) => handleLumpsumChange(index, e.target.value)}
                        min={0}
                        placeholder="0"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">SIP Amount (₹/month)</label>
                      <input
                        type="number"
                        value={currentSip || ''}
                        onChange={(e) => handleSipChange(index, e.target.value)}
                        min={0}
                        placeholder="0"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                      />
                    </div>
                  </div>

                  {/* SIP Date Range Configuration */}
                  {currentSip > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="text-sm text-[#1B263B] mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-[#2E89C4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        SIP Schedule Configuration
                      </h5>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* SIP Date */}
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">SIP Date (Day of Month)</label>
                          <select
                            value={sipDates[index]}
                            onChange={(e) => handleSipDateChange(index, parseInt(e.target.value))}
                            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                          >
                            {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                              <option key={day} value={day}>
                                {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Start Date */}
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">Start Date</label>
                          <input
                            type="date"
                            value={sipStartDates[index]}
                            onChange={(e) => handleSipStartDateChange(index, e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                          />
                        </div>

                        {/* End Date */}
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">End Date</label>
                          <input
                            type="date"
                            value={sipEndDates[index]}
                            onChange={(e) => handleSipEndDateChange(index, e.target.value)}
                            min={sipStartDates[index]}
                            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                          />
                        </div>
                      </div>

                      {/* SIP Summary */}
                      <div className="mt-3 pt-3 border-t border-blue-200 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-4">
                          <div>
                            <span className="text-gray-600">Duration: </span>
                            <span className="text-[#1B263B]">
                              {calculateSipDuration(sipStartDates[index], sipEndDates[index])} months
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Investment: </span>
                            <span className="text-[#3BAF4A]">
                              ₹{(currentSip * calculateSipDuration(sipStartDates[index], sipEndDates[index])).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-600">Every </span>
                          <span className="text-[#2E89C4]">{sipDates[index]}{sipDates[index] === 1 ? 'st' : sipDates[index] === 2 ? 'nd' : sipDates[index] === 3 ? 'rd' : 'th'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Total Investment Summary */}
                  <div className="bg-gradient-to-r from-[#3BAF4A]/10 to-[#2E89C4]/10 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Total Investment:</span>
                      <span className="text-2xl text-[#3BAF4A]">₹{totalInvestment.toLocaleString()}</span>
                    </div>
                    {currentLumpsum > 0 && currentSip > 0 && (
                      <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-gray-300">
                        <span className="text-gray-600">Lumpsum: ₹{currentLumpsum.toLocaleString()}</span>
                        <span className="text-gray-600">SIP: ₹{currentSip.toLocaleString()}/month</span>
                      </div>
                    )}
                  </div>

                  {/* Fund Allocation */}
                  {totalInvestment > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2 mb-4">
                        <PieChart className="w-5 h-5 text-[#2E89C4]" />
                        <h4 className="text-[#1B263B]">Fund Allocation Breakdown</h4>
                      </div>
                      
                      <div className="space-y-3">
                        {item.basket.funds.map((fund, fundIndex) => {
                          const fundLumpsumAmount = (currentLumpsum * fund.allocation) / 100;
                          const fundSipAmount = (currentSip * fund.allocation) / 100;
                          const fundTotalAmount = fundLumpsumAmount + fundSipAmount;

                          return (
                            <div key={fund.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <p className="text-sm text-[#1B263B] mb-1">{fund.name}</p>
                                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <span>{fund.category}</span>
                                    <span>•</span>
                                    <span>{fund.fundHouse}</span>
                                  </div>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="text-sm text-[#2E89C4]">{fund.allocation}%</p>
                                </div>
                              </div>

                              <div className="space-y-1 mt-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Total Allocation:</span>
                                  <span className="text-[#3BAF4A]">₹{fundTotalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                </div>
                                {currentLumpsum > 0 && (
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Lumpsum:</span>
                                    <span className="text-gray-700">₹{fundLumpsumAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                  </div>
                                )}
                                {currentSip > 0 && (
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">SIP/month:</span>
                                    <span className="text-gray-700">₹{fundSipAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                  </div>
                                )}
                              </div>

                              {/* Progress bar */}
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                <div
                                  className="bg-gradient-to-r from-[#3BAF4A] to-[#2E89C4] h-2 rounded-full transition-all"
                                  style={{ width: `${fund.allocation}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Fund Summary */}
                      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Total Funds</p>
                          <p className="text-lg text-[#1B263B]">{item.basket.funds.length}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Risk Level</p>
                          <p className="text-lg text-[#1B263B]">{item.basket.riskLevel}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {totalInvestment === 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                        <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <p className="text-sm text-yellow-800">
                          Enter a lumpsum or SIP amount to see fund allocation
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-[#1B263B] mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Baskets:</span>
                  <span className="text-[#1B263B]">{cart.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Funds:</span>
                  <span className="text-[#1B263B]">
                    {cart.reduce((sum, item) => sum + item.basket.funds.length, 0)}
                  </span>
                </div>
                
                {/* Investment Breakdown */}
                {totalLumpsum > 0 && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Lumpsum Investment:</span>
                      <span className="text-xl text-[#2E89C4]">₹{totalLumpsum.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500">One-time investment</p>
                  </div>
                )}
                
                {totalSip > 0 && (
                  <div className={totalLumpsum > 0 ? 'pt-3' : 'pt-3 border-t border-gray-200'}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">SIP Investment:</span>
                      <span className="text-xl text-[#3BAF4A]">₹{totalSip.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500">Monthly investment</p>
                  </div>
                )}
                
                <div className="border-t-2 border-gray-300 pt-4 mt-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-700">Total Investment:</span>
                    <div className="text-right">
                      <p className="text-3xl text-[#3BAF4A]">₹{totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  {totalLumpsum > 0 && totalSip > 0 && (
                    <p className="text-xs text-gray-500 text-right">
                      ₹{totalLumpsum.toLocaleString()} lumpsum + ₹{totalSip.toLocaleString()}/month SIP
                    </p>
                  )}
                  {totalLumpsum > 0 && totalSip === 0 && (
                    <p className="text-xs text-gray-500 text-right">One-time investment</p>
                  )}
                  {totalSip > 0 && totalLumpsum === 0 && (
                    <p className="text-xs text-gray-500 text-right">Monthly SIP</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigateTo('checkout')}
                disabled={totalAmount === 0}
                className={`w-full py-4 rounded-lg transition-all shadow-lg flex items-center justify-center space-x-2 ${
                  totalAmount === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#3BAF4A] hover:bg-[#329940] text-white'
                }`}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {totalAmount === 0 && (
                <p className="text-xs text-red-500 text-center mt-2">
                  Please enter investment amounts to proceed
                </p>
              )}

              <button
                onClick={() => navigateTo('basket-list')}
                className="w-full mt-3 border-2 border-gray-200 hover:border-gray-300 text-gray-700 py-3 rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}