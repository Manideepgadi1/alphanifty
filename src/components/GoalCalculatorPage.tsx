import { useState } from 'react';
import { Header } from './Header';
import { User, Basket, CartItem } from '../App';
import { ArrowLeft, GraduationCap, Home, Heart, Palmtree, TrendingUp, Baby, Briefcase, DollarSign, Calculator, ShoppingCart } from 'lucide-react';
import { mockBaskets } from '../data/mockData';

interface GoalCalculatorPageProps {
  basket: Basket | null;
  navigateTo: (page: any) => void;
  user: User | null;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
}

const goalIcons = {
  'Child Education': <GraduationCap className="w-6 h-6" />,
  'Dream Home': <Home className="w-6 h-6" />,
  'Marriage': <Heart className="w-6 h-6" />,
  'Retirement': <Palmtree className="w-6 h-6" />,
  'Wealth Creation': <TrendingUp className="w-6 h-6" />,
  'Business': <Briefcase className="w-6 h-6" />,
  'Other': <DollarSign className="w-6 h-6" />
};

export function GoalCalculatorPage({ basket, navigateTo, user, cart, addToCart }: GoalCalculatorPageProps) {
  const currentBasket = basket || mockBaskets[0];
  
  const [selectedGoal, setSelectedGoal] = useState('');
  const [investmentType, setInvestmentType] = useState<'SIP' | 'Lumpsum'>('SIP');
  const [monthlyAmount, setMonthlyAmount] = useState(currentBasket.minInvestment.toString());
  const [lumpsum, setLumpsum] = useState('100000');
  const [years, setYears] = useState('10');
  const [expectedReturn, setExpectedReturn] = useState(currentBasket.cagr1Y.toString());
  const [calculated, setCalculated] = useState(false);
  const [futureValue, setFutureValue] = useState(0);
  const [invested, setInvested] = useState(0);
  const [returns, setReturns] = useState(0);

  const calculateSIP = () => {
    const P = parseFloat(monthlyAmount);
    const r = parseFloat(expectedReturn) / 100 / 12;
    const n = parseInt(years) * 12;
    
    const FV = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const totalInvested = P * n;
    const totalReturns = FV - totalInvested;
    
    setFutureValue(Math.round(FV));
    setInvested(Math.round(totalInvested));
    setReturns(Math.round(totalReturns));
    setCalculated(true);
  };

  const calculateLumpsum = () => {
    const P = parseFloat(lumpsum);
    const r = parseFloat(expectedReturn) / 100;
    const n = parseInt(years);
    
    const FV = P * Math.pow(1 + r, n);
    const totalReturns = FV - P;
    
    setFutureValue(Math.round(FV));
    setInvested(Math.round(P));
    setReturns(Math.round(totalReturns));
    setCalculated(true);
  };

  const handleCalculate = () => {
    if (investmentType === 'SIP') {
      calculateSIP();
    } else {
      calculateLumpsum();
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigateTo('login');
      return;
    }

    const cartItem: CartItem = {
      basket: currentBasket,
      amount: investmentType === 'SIP' ? parseFloat(monthlyAmount) : parseFloat(lumpsum),
      type: investmentType,
      frequency: investmentType === 'SIP' ? 'Monthly' : undefined,
      goal: selectedGoal || undefined
    };

    addToCart(cartItem);
    navigateTo('cart');
  };

  const handleInvestNow = () => {
    if (!user) {
      navigateTo('login');
      return;
    }
    navigateTo('transaction');
  };

  return (
    <div className="min-h-screen">
      <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={cart.length} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigateTo('basket-details')}
          className="flex items-center space-x-2 text-[#2E89C4] hover:text-[#2576a8] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Basket Details</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Calculator */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="flex items-center space-x-2 mb-6">
                <Calculator className="w-6 h-6 text-[#2E89C4]" />
                <h2 className="text-[#1B263B]">Goal Calculator</h2>
              </div>

              {/* Basket Info */}
              <div className="bg-[#F5F7FA] rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-lg"
                    style={{ 
                      backgroundColor: currentBasket.color,
                      border: currentBasket.color === '#FFFFFF' ? '2px solid #E5E7EB' : 'none'
                    }}
                  />
                  <div>
                    <h3 className="text-[#1B263B]">{currentBasket.name}</h3>
                    <p className="text-sm text-gray-500">Selected Basket</p>
                  </div>
                </div>
              </div>

              {/* Goal Selection */}
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-3">Select Goal (Optional)</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(goalIcons).map(([goal, icon]) => (
                    <button
                      key={goal}
                      onClick={() => setSelectedGoal(goal)}
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                        selectedGoal === goal
                          ? 'border-[#2E89C4] bg-[#2E89C4]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={selectedGoal === goal ? 'text-[#2E89C4]' : 'text-gray-400'}>
                        {icon}
                      </div>
                      <span className="text-sm">{goal}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Investment Type */}
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-3">Investment Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setInvestmentType('SIP')}
                    className={`py-3 rounded-lg border-2 transition-all ${
                      investmentType === 'SIP'
                        ? 'border-[#2E89C4] bg-[#2E89C4] text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    SIP (Monthly)
                  </button>
                  <button
                    onClick={() => setInvestmentType('Lumpsum')}
                    className={`py-3 rounded-lg border-2 transition-all ${
                      investmentType === 'Lumpsum'
                        ? 'border-[#2E89C4] bg-[#2E89C4] text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Lumpsum
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              {investmentType === 'SIP' ? (
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-2">Monthly Investment (₹)</label>
                  <input
                    type="number"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                    min={currentBasket.minInvestment}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum: ₹{currentBasket.minInvestment.toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-2">Lumpsum Amount (₹)</label>
                  <input
                    type="number"
                    value={lumpsum}
                    onChange={(e) => setLumpsum(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                  />
                </div>
              )}

              {/* Investment Period */}
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2">Investment Period (Years)</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                  min="1"
                />
              </div>

              {/* Expected Return */}
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2">
                  Expected Return (% p.a.)
                </label>
                <input
                  type="range"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  className="w-full"
                  min="5"
                  max="30"
                  step="0.5"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>5%</span>
                  <span className="text-[#2E89C4]">{expectedReturn}%</span>
                  <span>30%</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Suggested: {currentBasket.cagr1Y}% (based on basket's 1Y returns)
                </p>
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                className="w-full bg-[#E8C23A] hover:bg-[#d4b034] text-[#1B263B] py-4 rounded-lg transition-all shadow-lg"
              >
                Calculate Returns
              </button>
            </div>

            {/* Results */}
            {calculated && (
              <div className="bg-gradient-to-br from-[#3BAF4A] to-[#2E89C4] text-white rounded-xl shadow-lg p-8">
                <h3 className="mb-6">Projected Returns</h3>
                <div className="space-y-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white/80 text-sm mb-1">Total Invested</p>
                    <p className="text-3xl">₹{invested.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white/80 text-sm mb-1">Estimated Returns</p>
                    <p className="text-3xl">₹{returns.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white/80 text-sm mb-1">Future Value</p>
                    <p className="text-4xl">₹{futureValue.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={handleInvestNow}
                    className="w-full bg-white text-[#2E89C4] py-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Invest Now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#E8C23A] hover:bg-[#d4b034] text-[#1B263B] py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Basket Details */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h3 className="text-[#1B263B] mb-6">Basket Performance</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-[#F5F7FA] rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">1 Year</p>
                  <p className="text-xl text-[#3BAF4A]">{currentBasket.cagr1Y}%</p>
                </div>
                <div className="text-center p-4 bg-[#F5F7FA] rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">3 Years</p>
                  <p className="text-xl text-[#3BAF4A]">{currentBasket.cagr3Y}%</p>
                </div>
                <div className="text-center p-4 bg-[#F5F7FA] rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">5 Years</p>
                  <p className="text-xl text-[#3BAF4A]">{currentBasket.cagr5Y}%</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Risk Level</span>
                  <span className="text-[#1B263B]">{currentBasket.riskLevel}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Time Horizon</span>
                  <span className="text-[#1B263B]">{currentBasket.timeHorizon}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">No. of Funds</span>
                  <span className="text-[#1B263B]">{currentBasket.funds.length}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Rebalancing</span>
                  <span className="text-[#1B263B]">{currentBasket.rebalancingFrequency}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-[#1B263B] mb-4">Fund Constituents</h3>
              <div className="space-y-3">
                {currentBasket.funds.map((fund) => (
                  <div key={fund.id} className="flex items-center justify-between p-3 bg-[#F5F7FA] rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-[#1B263B] mb-1">{fund.name}</p>
                      <p className="text-xs text-gray-500">{fund.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#2E89C4]">{fund.allocation}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
