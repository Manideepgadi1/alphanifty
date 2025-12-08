import { useState } from 'react';
import { Header } from './Header';
import { User, Basket, CartItem } from '../App';
import { mockBaskets } from '../data/mockData';
import { ArrowLeft, TrendingUp, AlertCircle, Clock, Target, PieChart, RefreshCw, Star, Activity, BarChart3, Layers, Package, Building2, TrendingDown, Download, ShoppingCart, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BasketDetailsPageProps {
  basket: Basket | null;
  navigateTo: (page: any) => void;
  user: User | null;
  setSelectedBasket: (basket: Basket) => void;
  cart: CartItem[];
  addToCart?: (item: CartItem) => void;
}

export function BasketDetailsPage({ basket, navigateTo, user, setSelectedBasket, cart, addToCart }: BasketDetailsPageProps) {
  // Fallback to first basket if none selected
  const currentBasket = basket || mockBaskets[0];

  // State for comparison timeline
  const [selectedTimeline, setSelectedTimeline] = useState<3 | 5 | 10>(3);
  
  // State for editable investment amount
  const [investmentAmount, setInvestmentAmount] = useState(currentBasket.minInvestment);
  const [amountError, setAmountError] = useState('');
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // State for comparison amount in Returns Comparison graph
  const [comparisonAmount, setComparisonAmount] = useState(investmentAmount);
  const [comparisonAmountError, setComparisonAmountError] = useState('');

  const handleInvestNow = () => {
    if (!user) {
      navigateTo('auth-welcome');
      return;
    }
    setSelectedBasket(currentBasket);
    navigateTo('transaction');
  };

  const handleAssignGoal = () => {
    if (!user) {
      navigateTo('auth-welcome');
      return;
    }
    setSelectedBasket(currentBasket);
    navigateTo('goal-calculator');
  };

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    setInvestmentAmount(amount);
    
    if (amount < currentBasket.minInvestment) {
      setAmountError(`Minimum investment is ₹${currentBasket.minInvestment.toLocaleString()}`);
    } else {
      setAmountError('');
    }
  };

  const handleComparisonAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    setComparisonAmount(amount);
    
    if (amount < 1000) {
      setComparisonAmountError(`Minimum comparison amount is ₹1,000`);
    } else {
      setComparisonAmountError('');
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigateTo('auth-welcome');
      return;
    }

    if (investmentAmount < currentBasket.minInvestment) {
      setAmountError(`Minimum investment is ₹${currentBasket.minInvestment.toLocaleString()}`);
      return;
    }

    if (addToCart) {
      const cartItem: CartItem = {
        basket: currentBasket,
        amount: investmentAmount,
        type: 'SIP',
        frequency: 'Monthly'
      };
      addToCart(cartItem);
      setIsAddedToCart(true);
      
      // Reset the "added" state after 3 seconds
      setTimeout(() => {
        setIsAddedToCart(false);
      }, 3000);
    }
  };

  // Calculate basket-level metrics
  const totalEquity = currentBasket.funds
    .filter(f => f.category === 'Equity')
    .reduce((sum, f) => sum + f.allocation, 0);
  const totalDebt = currentBasket.funds
    .filter(f => f.category === 'Debt')
    .reduce((sum, f) => sum + f.allocation, 0);
  const totalHybrid = currentBasket.funds
    .filter(f => f.category === 'Hybrid')
    .reduce((sum, f) => sum + f.allocation, 0);

  // Mock sector allocation
  const sectorAllocation = [
    { sector: 'Financial Services', allocation: 28.5 },
    { sector: 'Information Technology', allocation: 22.3 },
    { sector: 'Consumer Goods', allocation: 15.7 },
    { sector: 'Healthcare', allocation: 12.4 },
    { sector: 'Automobile', allocation: 8.6 },
    { sector: 'Energy', allocation: 7.2 },
    { sector: 'Others', allocation: 5.3 }
  ];

  // Mock top holdings
  const topHoldings = [
    { name: 'HDFC Bank Ltd', allocation: 4.8 },
    { name: 'Reliance Industries Ltd', allocation: 4.5 },
    { name: 'Infosys Ltd', allocation: 4.2 },
    { name: 'ICICI Bank Ltd', allocation: 3.9 },
    { name: 'TCS Ltd', allocation: 3.7 },
    { name: 'Kotak Mahindra Bank', allocation: 3.5 },
    { name: 'Axis Bank Ltd', allocation: 3.2 },
    { name: 'Bharti Airtel Ltd', allocation: 2.9 },
    { name: 'HUL Ltd', allocation: 2.7 },
    { name: 'Larsen & Toubro Ltd', allocation: 2.5 }
  ];

  // Calculate weighted average metrics
  const avgPE = 24.5;
  const avgPB = 3.8;
  const avgMarketCap = 85000;
  const portfolioTurnover = 42;
  const expenseRatio = currentBasket.funds.reduce((sum, f) => sum + (f.expenseRatio * f.allocation / 100), 0);

  // Comparison calculations
  const initialInvestment = 100000;
  const niftyCagr3Y = 11.5;
  const niftyCagr5Y = 12.2;
  const niftyCagr10Y = 13.5;
  
  // Estimate 10Y CAGR for basket (slightly lower than 5Y for realistic projections)
  const basketCagr10Y = currentBasket.cagr5Y * 0.95;

  const calculateFutureValue = (principal: number, rate: number, years: number) => {
    return principal * Math.pow((1 + rate / 100), years);
  };

  const basketValue3Y = calculateFutureValue(initialInvestment, currentBasket.cagr3Y, 3);
  const niftyValue3Y = calculateFutureValue(initialInvestment, niftyCagr3Y, 3);
  const basketValue5Y = calculateFutureValue(initialInvestment, currentBasket.cagr5Y, 5);
  const niftyValue5Y = calculateFutureValue(initialInvestment, niftyCagr5Y, 5);
  const basketValue10Y = calculateFutureValue(initialInvestment, basketCagr10Y, 10);
  const niftyValue10Y = calculateFutureValue(initialInvestment, niftyCagr10Y, 10);

  // Generate chart data
  const generateChartData = (years: number) => {
    const data = [];
    const basketRate = years === 3 ? currentBasket.cagr3Y : years === 5 ? currentBasket.cagr5Y : basketCagr10Y;
    const niftyRate = years === 3 ? niftyCagr3Y : years === 5 ? niftyCagr5Y : niftyCagr10Y;
    
    for (let year = 0; year <= years; year++) {
      data.push({
        year: year === 0 ? 'Today' : `Year ${year}`,
        yearNum: year,
        basket: Math.round(calculateFutureValue(comparisonAmount, basketRate, year)),
        nifty: Math.round(calculateFutureValue(comparisonAmount, niftyRate, year))
      });
    }
    return data;
  };

  const chartData = generateChartData(selectedTimeline);

  // Generate table data
  const generateTableData = () => {
    const data = [];
    for (let year = 1; year <= selectedTimeline; year++) {
      const basketRate = selectedTimeline === 3 ? currentBasket.cagr3Y : selectedTimeline === 5 ? currentBasket.cagr5Y : basketCagr10Y;
      const niftyRate = selectedTimeline === 3 ? niftyCagr3Y : selectedTimeline === 5 ? niftyCagr5Y : niftyCagr10Y;
      
      data.push({
        year,
        basketValue: Math.round(calculateFutureValue(comparisonAmount, basketRate, year)),
        niftyValue: Math.round(calculateFutureValue(comparisonAmount, niftyRate, year))
      });
    }
    return data;
  };

  const tableData = generateTableData();

  const handleDownloadData = () => {
    const csvContent = `Year,${currentBasket.name} Returns (₹),Nifty Index Returns (₹)\\n` +
      tableData.map(row => `${row.year},${row.basketValue},${row.niftyValue}`).join('\\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentBasket.name}-vs-Nifty-Comparison.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const currentBasketValue = calculateFutureValue(comparisonAmount, selectedTimeline === 3 ? currentBasket.cagr3Y : selectedTimeline === 5 ? currentBasket.cagr5Y : basketCagr10Y, selectedTimeline);
  const currentNiftyValue = calculateFutureValue(comparisonAmount, selectedTimeline === 3 ? niftyCagr3Y : selectedTimeline === 5 ? niftyCagr5Y : niftyCagr10Y, selectedTimeline);

  return (
    <div className="min-h-screen">
      <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={cart.length} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigateTo('basket-list')}
          className="flex items-center space-x-2 text-[#2E89C4] hover:text-[#2576a8] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Baskets</span>
        </button>

        {/* Basket Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div
                  className="w-20 h-20 rounded-xl shadow-lg"
                  style={{ 
                    backgroundColor: currentBasket.color,
                    border: currentBasket.color === '#FFFFFF' ? '2px solid #E5E7EB' : 'none'
                  }}
                />
                <div>
                  <h1 className="text-[#1B263B] mb-2">{currentBasket.name}</h1>
                  <p className="text-gray-600">{currentBasket.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Risk Level</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        currentBasket.riskLevel === 'High'
                          ? 'bg-red-100 text-red-700'
                          : currentBasket.riskLevel === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {currentBasket.riskLevel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Time Horizon</p>
                    <p className="text-[#1B263B]">{currentBasket.timeHorizon}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Rebalancing</p>
                    <p className="text-[#1B263B]">{currentBasket.rebalancingFrequency}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#3BAF4A]/10 to-[#2E89C4]/10 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#2E89C4]" />
                <h3 className="text-[#1B263B]">Performance (CAGR)</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">3 Years</p>
                  <p className="text-2xl text-[#3BAF4A]">{currentBasket.cagr3Y}%</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">5 Years</p>
                  <p className="text-2xl text-[#3BAF4A]">{currentBasket.cagr5Y}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-500">Sharpe Ratio</p>
                  </div>
                  <p className="text-xl text-[#1B263B]">{currentBasket.sharpeRatio}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-500">Std Dev (%)</p>
                  </div>
                  <p className="text-xl text-[#1B263B]">{currentBasket.riskPercentage}%</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <label className="text-sm text-gray-600 block mb-2">Investment Amount (₹/month)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    min={currentBasket.minInvestment}
                    className={`w-full text-2xl text-[#1B263B] border-2 rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                      amountError 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:border-[#2E89C4]'
                    }`}
                  />
                </div>
                {amountError && (
                  <p className="text-red-500 text-sm mt-2">{amountError}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Minimum: ₹{currentBasket.minInvestment.toLocaleString()}/month
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <button
              onClick={handleInvestNow}
              className="bg-[#3BAF4A] hover:bg-[#329940] text-white py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg"
            >
              Invest Now
            </button>
            <button
              onClick={handleAddToCart}
              disabled={investmentAmount < currentBasket.minInvestment}
              className={`flex items-center justify-center space-x-2 py-4 rounded-lg transition-all transform shadow-lg ${
                isAddedToCart 
                  ? 'bg-[#3BAF4A] text-white'
                  : investmentAmount < currentBasket.minInvestment
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#2E89C4] hover:bg-[#2576a8] text-white hover:scale-[1.02]'
              }`}
            >
              {isAddedToCart ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
            <button
              onClick={handleAssignGoal}
              className="bg-[#E8C23A] hover:bg-[#d4b034] text-[#1B263B] py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg"
            >
              Assign Goal & Calculate
            </button>
          </div>
        </div>

        {/* Goals & Basket Composition - Side by Side */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Goals */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-2 mb-6">
              <Target className="w-6 h-6 text-[#2E89C4]" />
              <h2 className="text-[#1B263B]">Suitable Goals</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {currentBasket.goals.map((goal, index) => (
                <span
                  key={index}
                  className="bg-[#2E89C4]/10 text-[#2E89C4] px-4 py-2 rounded-full"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>

          {/* Basket Composition */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-2 mb-6">
              <Layers className="w-6 h-6 text-[#2E89C4]" />
              <h2 className="text-[#1B263B]">Basket Composition</h2>
            </div>
            <div className="space-y-4">
              {currentBasket.funds.map((fund) => (
                <div key={fund.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-[#1B263B] mb-1">{fund.category}</p>
                    <p className="text-sm text-gray-500">{fund.fundHouse}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl text-[#3BAF4A]">{fund.allocation}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fund Allocation */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="w-6 h-6 text-[#2E89C4]" />
            <h2 className="text-[#1B263B]">Fund Allocation</h2>
          </div>
          <div className="space-y-4">
            {currentBasket.funds.map((fund, index) => (
              <div key={fund.id} className="border border-gray-200 rounded-lg p-6 hover:border-[#2E89C4] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-[#1B263B] mb-1">{fund.name}</h3>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="text-gray-500">{fund.category}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">{fund.fundHouse}</span>
                      <span className="text-gray-300">•</span>
                      <span className={`${
                        fund.risk === 'High' ? 'text-red-600' :
                        fund.risk === 'Medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {fund.risk} Risk
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl text-[#2E89C4]">{fund.allocation}%</p>
                    <p className="text-sm text-gray-500">Allocation</p>
                    <p className="text-lg text-[#3BAF4A] mt-1">₹{((investmentAmount * fund.allocation) / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    <p className="text-xs text-gray-400">Amount</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">NAV</p>
                    <p className="text-[#1B263B]">₹{fund.nav.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">3Y Returns</p>
                    <p className="text-[#3BAF4A]">{fund.returns3Y}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">5Y Returns</p>
                    <p className="text-[#3BAF4A]">{fund.returns5Y}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Sharpe Ratio</p>
                    <p className="text-[#1B263B]">{fund.sharpeRatio}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Std Dev</p>
                    <p className="text-[#1B263B]">{fund.standardDeviation}%</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-[#E8C23A] fill-current" />
                    <span className="text-[#1B263B]">{fund.rating}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Basket Composition */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-2 mb-6">
              <Layers className="w-6 h-6 text-[#2E89C4]" />
              <h2 className="text-[#1B263B]">Asset Allocation</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Equity</span>
                  <span className="text-[#1B263B]">{totalEquity}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${totalEquity}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Debt</span>
                  <span className="text-[#1B263B]">{totalDebt}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: `${totalDebt}%` }}></div>
                </div>
              </div>
              {totalHybrid > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Hybrid</span>
                    <span className="text-[#1B263B]">{totalHybrid}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-purple-500 h-3 rounded-full" style={{ width: `${totalHybrid}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-2 mb-6">
              <Activity className="w-6 h-6 text-[#2E89C4]" />
              <h2 className="text-[#1B263B]">Portfolio Metrics</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm mb-1">Fund Count</span>
                  <span className="text-[#1B263B] text-xl">{currentBasket.funds.length}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm mb-1">Total Stocks</span>
                  <span className="text-[#1B263B] text-xl">142</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm mb-1">Beta</span>
                  <span className="text-[#1B263B] text-xl">1.08</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm mb-1">Top 10</span>
                  <span className="text-[#1B263B] text-xl">35.9%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm mb-1">Alpha</span>
                  <span className="text-[#3BAF4A] text-xl">2.3%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm mb-1">Max Drawdown</span>
                  <span className="text-red-600 text-xl">-18.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fundamentals & Portfolio Aggregates */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-2 mb-6">
              <Package className="w-6 h-6 text-[#2E89C4]" />
              <h2 className="text-[#1B263B]">Fundamentals</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Weighted Avg P/E Ratio</span>
                <span className="text-[#1B263B]">{avgPE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Weighted Avg P/B Ratio</span>
                <span className="text-[#1B263B]">{avgPB.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Avg Market Cap</span>
                <span className="text-[#1B263B]">₹{avgMarketCap.toLocaleString()} Cr</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Dividend Yield</span>
                <span className="text-[#1B263B]">1.2%</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-600">ROE</span>
                <span className="text-[#1B263B]">16.8%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-2 mb-6">
              <BarChart3 className="w-6 h-6 text-[#2E89C4]" />
              <h2 className="text-[#1B263B]">Portfolio Aggregates</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Total AUM</span>
                <span className="text-[#1B263B]">₹{(currentBasket.funds.reduce((sum, f) => {
                  const aum = parseFloat(f.aum.replace(/[₹,Cr]/g, '').trim());
                  return sum + (aum * f.allocation / 100);
                }, 0)).toFixed(0)} Cr</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Avg Expense Ratio</span>
                <span className="text-[#1B263B]">{expenseRatio.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Portfolio Turnover</span>
                <span className="text-[#1B263B]">{portfolioTurnover}%</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Avg Fund Age</span>
                <span className="text-[#1B263B]">8.5 years</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-600">Exit Load</span>
                <span className="text-[#1B263B]">1% (if redeemed within 1 year)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sector Allocation & Top 10 Holdings - Side by Side */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Sector Allocation */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-2 mb-6">
              <Building2 className="w-6 h-6 text-[#2E89C4]" />
              <h2 className="text-[#1B263B]">Sector Wise Allocation</h2>
            </div>
            <div className="space-y-4">
              {sectorAllocation.map((sector, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">{sector.sector}</span>
                    <span className="text-[#1B263B]">{sector.allocation}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-[#3BAF4A] to-[#2E89C4] h-3 rounded-full transition-all" 
                      style={{ width: `${sector.allocation}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Holdings */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-6 h-6 text-[#2E89C4]" />
              <h2 className="text-[#1B263B]">Top Holdings</h2>
            </div>
            <div className="space-y-3">
              {topHoldings.slice(0, 8).map((holding, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-[#2E89C4]/10 text-[#2E89C4] rounded-full text-sm">
                      {index + 1}
                    </span>
                    <span className="text-[#1B263B] text-sm">{holding.name}</span>
                  </div>
                  <span className="text-[#3BAF4A]">{holding.allocation}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t-2 border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-700">Total Top 8</span>
                <span className="text-[#2E89C4]">{topHoldings.slice(0, 8).reduce((sum, h) => sum + h.allocation, 0).toFixed(1)}%</span>
              </div>
            </div>
        </div>
        </div>

        {/* Basket vs Nifty Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <TrendingUp className="w-6 h-6 text-[#2E89C4]" />
              <h2 className="text-[#1B263B]">Returns Comparison - {currentBasket.name} vs Nifty Index</h2>
            </div>
            <div className="w-full sm:w-auto">
              <label className="text-sm text-gray-600 block mb-2">Comparison Amount (₹)</label>
              <input
                type="number"
                value={comparisonAmount}
                onChange={(e) => handleComparisonAmountChange(e.target.value)}
                min={1000}
                className={`w-full sm:w-48 text-lg text-[#1B263B] border-2 rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                  comparisonAmountError 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:border-[#2E89C4]'
                }`}
                placeholder="Enter amount"
              />
              {comparisonAmountError && (
                <p className="text-red-500 text-xs mt-1">{comparisonAmountError}</p>
              )}
            </div>
          </div>

          {/* Investment Projection Text */}
          <div className="bg-gradient-to-r from-[#3BAF4A]/10 to-[#2E89C4]/10 rounded-xl p-6 mb-6">
            <p className="text-[#1B263B] text-center text-lg">
              If you invest <span className="text-[#3BAF4A]">₹{comparisonAmount.toLocaleString()}</span> today, it grows to{' '}
              <span className="text-[#3BAF4A]">₹{Math.round(currentBasketValue).toLocaleString()}</span> in{' '}
              <span className="text-[#2E89C4]">{selectedTimeline} years</span>
            </p>
            <p className="text-gray-600 text-center mt-2 text-sm">
              Compared to Nifty Index: ₹{Math.round(currentNiftyValue).toLocaleString()} | 
              Outperformance: <span className="text-[#3BAF4A]">₹{Math.round(currentBasketValue - currentNiftyValue).toLocaleString()}</span>
            </p>
          </div>

          {/* Timeline Selector */}
          <div className="flex justify-center space-x-3 mb-8">
            {[3, 5, 10].map((years) => (
              <button
                key={years}
                onClick={() => setSelectedTimeline(years as 3 | 5 | 10)}
                className={`px-6 py-3 rounded-lg transition-all ${
                  selectedTimeline === years
                    ? 'bg-[#2E89C4] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {years} Years
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="mb-8">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="year" 
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, '']}
                  labelStyle={{ color: '#1B263B', fontWeight: 'bold' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="basket" 
                  stroke="#3BAF4A" 
                  strokeWidth={3}
                  name={currentBasket.name}
                  dot={{ fill: '#3BAF4A', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="nifty" 
                  stroke="#2E89C4" 
                  strokeWidth={3}
                  name="Nifty Index"
                  dot={{ fill: '#2E89C4', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-4 px-6 text-sm text-gray-600 rounded-tl-lg">Years</th>
                  <th className="text-right py-4 px-6 text-sm text-gray-600">{currentBasket.name} Returns</th>
                  <th className="text-right py-4 px-6 text-sm text-gray-600 rounded-tr-lg">Nifty Index Returns</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={row.year} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="py-4 px-6 text-[#1B263B]">Year {row.year}</td>
                    <td className="py-4 px-6 text-right text-[#3BAF4A]">₹{row.basketValue.toLocaleString()}</td>
                    <td className="py-4 px-6 text-right text-[#2E89C4]">₹{row.niftyValue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100">
                  <td className="py-4 px-6 text-[#1B263B]">Total</td>
                  <td className="py-4 px-6 text-right text-[#3BAF4A]">₹{Math.round(currentBasketValue).toLocaleString()}</td>
                  <td className="py-4 px-6 text-right text-[#2E89C4]">₹{Math.round(currentNiftyValue).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => {
                if (!user) {
                  navigateTo('auth-welcome');
                  return;
                }
                setSelectedBasket(currentBasket);
                navigateTo('transaction');
              }}
              className="bg-[#3BAF4A] hover:bg-[#329940] text-white py-4 rounded-lg transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Start SIP</span>
            </button>
            <button
              onClick={() => {
                if (!user) {
                  navigateTo('auth-welcome');
                  return;
                }
                setSelectedBasket(currentBasket);
                navigateTo('transaction');
              }}
              className="bg-[#2E89C4] hover:bg-[#2576a8] text-white py-4 rounded-lg transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Start Lumpsum</span>
            </button>
            <button
              onClick={handleDownloadData}
              className="bg-[#E8C23A] hover:bg-[#d4b034] text-[#1B263B] py-4 rounded-lg transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Data</span>
            </button>
          </div>
        </div>

        {/* Rationale & Suitability */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-[#1B263B] mb-6">Investment Rationale</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{currentBasket.rationale}</p>
            
            {/* Philosophy Section */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-5 h-5 text-[#3BAF4A]" />
                <h3 className="text-[#1B263B]">Basket Philosophy</h3>
              </div>
              <div className="bg-gradient-to-r from-[#3BAF4A]/5 to-[#2E89C4]/5 rounded-lg p-4 border-l-4 border-[#3BAF4A]">
                <p className="text-gray-700 leading-relaxed italic">{currentBasket.philosophy}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-[#1B263B] mb-4">Suitable For</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{currentBasket.suitableFor}</p>
            
            {/* Investor Profile Suitability */}
            <div className="space-y-4">
              <div className="bg-[#F5F7FA] rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-4 h-4 text-[#2E89C4]" />
                  <p className="text-sm text-gray-600">Age Range</p>
                </div>
                <p className="text-[#1B263B]">{currentBasket.ageRange}</p>
              </div>

              <div className="bg-[#F5F7FA] rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-[#2E89C4]" />
                  <p className="text-sm text-gray-600">Risk Tolerance</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    currentBasket.riskLevel === 'High'
                      ? 'bg-red-100 text-red-700'
                      : currentBasket.riskLevel === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {currentBasket.riskLevel}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {currentBasket.riskLevel === 'High' 
                      ? '(Can handle significant market volatility)' 
                      : currentBasket.riskLevel === 'Medium'
                      ? '(Comfortable with moderate fluctuations)'
                      : '(Prefer stable returns with minimal risk)'}
                  </span>
                </div>
              </div>

              <div className="bg-[#F5F7FA] rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-4 h-4 text-[#2E89C4]" />
                  <p className="text-sm text-gray-600">Investment Experience</p>
                </div>
                <p className="text-[#1B263B]">{currentBasket.experienceLevel}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {currentBasket.experienceLevel === 'Beginner' 
                    ? 'New to mutual fund investments or prefer guided strategies' 
                    : currentBasket.experienceLevel === 'Intermediate'
                    ? 'Have basic understanding of markets and investment products'
                    : 'Experienced investors with deep market knowledge'}
                </p>
              </div>

              <div className="bg-[#F5F7FA] rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-[#2E89C4]" />
                  <p className="text-sm text-gray-600">Investment Horizon</p>
                </div>
                <p className="text-[#1B263B]">{currentBasket.timeHorizon}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {currentBasket.timeHorizon.includes('10+') 
                    ? 'Patient investors planning for long-term wealth creation' 
                    : currentBasket.timeHorizon.includes('5-10')
                    ? 'Medium-term goals with flexibility to ride market cycles'
                    : 'Shorter-term goals with need for liquidity'}
                </p>
              </div>

              <div className="bg-[#F5F7FA] rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="w-4 h-4 text-[#2E89C4]" />
                  <p className="text-sm text-gray-600">Investment Capacity</p>
                </div>
                <p className="text-[#1B263B]">Minimum ₹{currentBasket.minInvestment.toLocaleString()}/month</p>
                <p className="text-sm text-gray-500 mt-1">
                  {currentBasket.minInvestment <= 10000 
                    ? 'Ideal for those starting their investment journey' 
                    : currentBasket.minInvestment <= 25000
                    ? 'Suitable for regular income earners'
                    : 'For investors with higher investment capacity'}
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#3BAF4A]/10 to-[#2E89C4]/10 rounded-lg p-4 border-l-4 border-[#3BAF4A]">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-[#3BAF4A]" />
                  <p className="text-sm text-gray-700">Financial Goals Alignment</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentBasket.goals.map((goal, index) => (
                    <span
                      key={index}
                      className="bg-white text-[#2E89C4] px-3 py-1 rounded-full text-sm border border-[#2E89C4]/20"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Framework */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Layers className="w-6 h-6 text-[#2E89C4]" />
            <h2 className="text-[#1B263B]">Investment Framework</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Market Cap Allocation */}
            <div>
              <h3 className="text-[#1B263B] mb-4">Market Cap Allocation</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Large Cap</span>
                    </div>
                    <span className="text-[#1B263B]">{currentBasket.riskLevel === 'High' ? '45%' : currentBasket.riskLevel === 'Medium' ? '60%' : '75%'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all" 
                      style={{ width: currentBasket.riskLevel === 'High' ? '45%' : currentBasket.riskLevel === 'Medium' ? '60%' : '75%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Mid Cap</span>
                    </div>
                    <span className="text-[#1B263B]">{currentBasket.riskLevel === 'High' ? '35%' : currentBasket.riskLevel === 'Medium' ? '30%' : '20%'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-purple-500 h-3 rounded-full transition-all" 
                      style={{ width: currentBasket.riskLevel === 'High' ? '35%' : currentBasket.riskLevel === 'Medium' ? '30%' : '20%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">Small Cap</span>
                    </div>
                    <span className="text-[#1B263B]">{currentBasket.riskLevel === 'High' ? '20%' : currentBasket.riskLevel === 'Medium' ? '10%' : '5%'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-orange-500 h-3 rounded-full transition-all" 
                      style={{ width: currentBasket.riskLevel === 'High' ? '20%' : currentBasket.riskLevel === 'Medium' ? '10%' : '5%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Style */}
            <div>
              <h3 className="text-[#1B263B] mb-4">Investment Style</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Growth Oriented</span>
                    <span className="text-[#1B263B]">{currentBasket.riskLevel === 'High' ? '70%' : currentBasket.riskLevel === 'Medium' ? '50%' : '30%'}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Focus on capital appreciation and high-growth companies
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Value Oriented</span>
                    <span className="text-[#1B263B]">{currentBasket.riskLevel === 'High' ? '30%' : currentBasket.riskLevel === 'Medium' ? '50%' : '70%'}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Undervalued stocks with strong fundamentals
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Investment Horizon</span>
                    <span className="text-[#1B263B]">{currentBasket.timeHorizon}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Recommended holding period for optimal returns
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Cap Definitions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-900 mb-1">Large Cap</p>
                <p className="text-blue-700 text-xs">Top 100 companies by market capitalization. Lower risk, stable returns.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-purple-900 mb-1">Mid Cap</p>
                <p className="text-purple-700 text-xs">Rank 101-250 companies. Moderate risk, higher growth potential.</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-orange-900 mb-1">Small Cap</p>
                <p className="text-orange-700 text-xs">Beyond rank 250. Higher risk, maximum growth opportunity.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-yellow-900 mb-2">Investment Disclaimer</h3>
              <p className="text-yellow-800 text-sm">
                Mutual fund investments are subject to market risks. Past performance is not indicative of future returns. 
                Please read all scheme related documents carefully before investing. The performance data shown is based on 
                historical returns and may not be sustained in the future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}