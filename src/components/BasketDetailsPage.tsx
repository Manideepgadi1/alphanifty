import { useState, useEffect } from 'react';
import { Header } from './Header';
import { User, Basket, CartItem } from '../App';
import { mockBaskets } from '../data/mockData';
import { basketAPI, BasketAPIResponse } from '../services/api';
import { ArrowLeft, TrendingUp, AlertCircle, Clock, Target, PieChart, RefreshCw, Star, Activity, BarChart3, Layers, Package, Building2, TrendingDown, Download, ShoppingCart, Check, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

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

  // Helper function to check if graphData is DualGraphData
  const isDualGraphData = (data: any): data is { absoluteReturns: any; rollingReturns: any } => {
    return data && 'absoluteReturns' in data && 'rollingReturns' in data;
  };

  // Helper function to check if graphData is simple GraphData
  const isSimpleGraphData = (data: any): data is { labels: string[]; basketData: number[]; niftyData: number[] } => {
    return data && 'labels' in data && 'basketData' in data && 'niftyData' in data;
  };

  // State for API data
  const [apiData, setApiData] = useState<BasketAPIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for comparison timeline
  const [selectedTimeline, setSelectedTimeline] = useState<3 | 5 | 10>(3);
  
  // State for graph type (Absolute or Rolling Returns)
  const [graphType, setGraphType] = useState<'absolute' | 'rolling'>('absolute');
  
  // State for editable investment amount
  const [investmentAmount, setInvestmentAmount] = useState(currentBasket.minInvestment);
  const [amountError, setAmountError] = useState('');
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // State for comparison amount in Returns Comparison graph
  const [comparisonAmount, setComparisonAmount] = useState(investmentAmount);
  const [comparisonAmountError, setComparisonAmountError] = useState('');

  // Fetch backend data for Conservative Balanced or Aggressive Hybrid baskets
  useEffect(() => {
    const fetchBasketData = async () => {
      if (currentBasket.id === 'b14') {
        // Great India Basket
        setLoading(true);
        setError(null);
        try {
          const data = await basketAPI.getGreatIndiaBasket(selectedTimeline);
          setApiData(data);
        } catch (err) {
          console.error('Failed to fetch basket data:', err);
          setError('Failed to load basket data from backend');
        } finally {
          setLoading(false);
        }
      } else if (currentBasket.id === 'b9') {
        // Aggressive Hybrid Basket
        setLoading(true);
        setError(null);
        try {
          const data = await basketAPI.getAggressiveHybridBasket(selectedTimeline);
          setApiData(data);
        } catch (err) {
          console.error('Failed to fetch basket data:', err);
          setError('Failed to load basket data from backend');
        } finally {
          setLoading(false);
        }
      } else if (currentBasket.id === 'b11') {
        // White Basket
        setLoading(true);
        setError(null);
        try {
          const data = await basketAPI.getWhiteBasket(selectedTimeline);
          setApiData(data);
        } catch (err) {
          console.error('Failed to fetch basket data:', err);
          setError('Failed to load basket data from backend');
        } finally {
          setLoading(false);
        }
      } else if (currentBasket.id === 'b12') {
        // Every Common India Basket
        setLoading(true);
        setError(null);
        try {
          const data = await basketAPI.getEveryCommonIndiaBasket(selectedTimeline);
          setApiData(data);
        } catch (err) {
          console.error('Failed to fetch basket data:', err);
          setError('Failed to load basket data from backend');
        } finally {
          setLoading(false);
        }
      } else if (currentBasket.id === 'b13') {
        // Raising India Basket
        setLoading(true);
        setError(null);
        try {
          const data = await basketAPI.getRaisingIndiaBasket(selectedTimeline);
          setApiData(data);
        } catch (err) {
          console.error('Failed to fetch basket data:', err);
          setError('Failed to load basket data from backend');
        } finally {
          setLoading(false);
        }
      } else {
        // Reset API data for other baskets
        setApiData(null);
      }
    };

    fetchBasketData();
  }, [currentBasket.id, selectedTimeline]);

  // Use API data if available, otherwise use currentBasket data
  const actualMetrics = apiData && apiData.metrics ? {
    cagr1Y: apiData.metrics.cagr1Y ?? currentBasket.cagr1Y,
    cagr3Y: apiData.metrics.cagr3Y ?? currentBasket.cagr3Y,
    cagr5Y: apiData.metrics.cagr5Y ?? currentBasket.cagr5Y,
    risk: apiData.metrics.risk ?? currentBasket.riskPercentage,
    sharpe: (apiData.metrics.sharpe ?? apiData.metrics.sharpeRatio) ?? currentBasket.sharpeRatio,
    riskPercentage: apiData.metrics.riskPercentage ?? apiData.metrics.risk ?? currentBasket.riskPercentage
  } : {
    cagr1Y: currentBasket.cagr1Y ?? 0,
    cagr3Y: currentBasket.cagr3Y ?? 0,
    cagr5Y: currentBasket.cagr5Y ?? 0,
    risk: currentBasket.riskPercentage ?? 0,
    sharpe: currentBasket.sharpeRatio ?? 0,
    riskPercentage: currentBasket.riskPercentage ?? 0
  };

  // Use API funds if available, otherwise use currentBasket funds
  const displayFunds = (apiData && apiData.funds && apiData.funds.length > 0) ? apiData.funds : currentBasket.funds;

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
    <div className="min-h-screen bg-gray-50">
      <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={cart.length} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigateTo('basket-list')}
          className="flex items-center space-x-2 text-[#2E89C4] hover:text-[#2576a8] mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back to Baskets</span>
        </button>

        {/* Compact Basket Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          {/* Top Section: Icon, Title, and Investment Amount */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center space-x-4 flex-1">
              <div
                className="w-20 h-20 rounded-2xl shadow-sm flex-shrink-0"
                style={{ 
                  backgroundColor: currentBasket.color,
                  border: currentBasket.color === '#FFFFFF' ? '2px solid #E5E7EB' : 'none'
                }}
              />
              <div>
                <h1 className="text-2xl font-semibold mb-1" style={{ color: '#1B263B' }}>{currentBasket.name}</h1>
                <p className="text-sm" style={{ color: '#6B7280' }}>{currentBasket.description}</p>
              </div>
            </div>
            
            {/* Investment Amount Card - Right Side */}
            <div className="ml-6 flex items-start space-x-4">
              <div className="border border-gray-300 rounded-lg p-4 w-64">
                <label htmlFor="investment-amount" className="text-sm block mb-2" style={{ color: '#4B5563' }}>Investment Amount (₹/month)</label>
                <input
                  id="investment-amount"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  min={currentBasket.minInvestment}
                  className="w-full text-3xl font-normal bg-transparent focus:outline-none mb-2"
                  style={{ color: '#1B263B' }}
                />
                <p className="text-sm" style={{ color: '#6B7280' }}>Min: ₹{currentBasket.minInvestment.toLocaleString()}</p>
                {amountError && <p className="text-xs text-red-500 mt-1">{amountError}</p>}
              </div>
              
              {/* Basket NAV */}
              <div className="bg-[#3B9DD3] text-white rounded-lg p-4 w-40 text-center">
                <div className="text-sm mb-2">Basket NAV</div>
                <div className="text-2xl font-semibold">₹{(investmentAmount * 0.00717).toFixed(2)}</div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 mb-8" />

          {/* Metrics Grid - Horizontal Layout */}
          <div className="grid grid-cols-4 gap-x-8 gap-y-6 mb-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Risk</p>
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                  currentBasket.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                  (currentBasket.riskLevel.includes('Medium')) ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {currentBasket.riskLevel}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 mb-1">3Y CAGR</p>
                <p className="text-lg font-semibold text-green-600">
                  {actualMetrics.cagr3Y.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 mb-1">5Y CAGR</p>
                <p className="text-lg font-semibold text-green-600">
                  {actualMetrics.cagr5Y.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Std Dev (%)</p>
                <p className="text-lg font-semibold text-[#1B263B]">
                  {actualMetrics.riskPercentage.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Time Horizon</p>
                <p className="text-base text-[#1B263B]">{currentBasket.timeHorizon}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <BarChart3 className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Sharpe Ratio</p>
                <p className="text-lg font-semibold text-[#1B263B]">{actualMetrics.sharpe.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Compact */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleAddToCart}
              disabled={investmentAmount < currentBasket.minInvestment}
              className="py-4 rounded-lg transition-all flex items-center justify-center space-x-2 disabled:cursor-not-allowed text-base font-medium"
              style={{
                backgroundColor: investmentAmount < currentBasket.minInvestment ? '#D1D5DB' : '#3B9DD3',
                color: '#FFFFFF'
              }}
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
              className="py-4 rounded-lg transition-all text-base font-medium"
              style={{
                backgroundColor: '#E8B839',
                color: '#1B263B'
              }}
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

        {/* Fund Allocation - Simplified Table */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="w-5 h-5 text-[#2E89C4]" />
            <h2 className="text-lg font-semibold text-[#1B263B]">Fund Allocation</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Fund Name</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Allocation</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayFunds.slice(0, 4).map((fund, index) => (
                  <tr key={fund.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-2">
                      <div>
                        <p className="text-sm font-medium text-[#1B263B]">{fund.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            fund.category === 'Equity' ? 'bg-blue-100 text-blue-700' :
                            fund.category === 'Debt' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {fund.category}
                          </span>
                          <span className="text-xs text-gray-500">{fund.fundHouse}</span>
                          <span className={`text-xs ${
                            fund.risk === 'High' ? 'text-red-600' :
                            fund.risk === 'Medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {fund.risk} Risk
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <span className="text-base font-semibold text-[#2E89C4]">{fund.allocation}%</span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <span className="text-base font-semibold text-[#3BAF4A]">
                        ₹{((investmentAmount * fund.allocation) / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <button className="text-[#2E89C4] hover:text-[#2576a8] text-sm flex items-center justify-center w-full space-x-1">
                        <span>View More</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compact Allocation Sections in Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Asset Allocation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Layers className="w-5 h-5 text-[#2E89C4]" />
              <h3 className="text-base font-semibold text-[#1B263B]">Assets Allocation</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Equity</span>
                  <span className="text-sm font-semibold text-[#1B263B]">{totalEquity}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${totalEquity}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Debt</span>
                  <span className="text-sm font-semibold text-[#1B263B]">{totalDebt}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${totalDebt}%` }}></div>
                </div>
              </div>
              {totalHybrid > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">Hybrid</span>
                    <span className="text-sm font-semibold text-[#1B263B]">{totalHybrid}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${totalHybrid}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Investment Framework */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-[#2E89C4]" />
              <h3 className="text-base font-semibold text-[#1B263B]">Investment Framework</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Large Cap</span>
                  <span className="text-sm font-semibold text-[#1B263B]">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Mid Cap</span>
                  <span className="text-sm font-semibold text-[#1B263B]">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Small Cap</span>
                  <span className="text-sm font-semibold text-[#1B263B]">10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sector and Holdings in Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Sector Wise Allocation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="w-5 h-5 text-[#2E89C4]" />
              <h3 className="text-base font-semibold text-[#1B263B]">Sector Wise Allocation</h3>
            </div>
            <div className="space-y-2">
              {sectorAllocation.slice(0, 4).map((sector, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">{sector.sector}</span>
                  <span className="text-sm font-semibold text-[#1B263B]">{sector.allocation}%</span>
                </div>
              ))}
              <button className="text-[#2E89C4] hover:text-[#2576a8] text-sm mt-2 flex items-center space-x-1">
                <span>View More (3 more)</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Top Holdings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#2E89C4]" />
              <h3 className="text-base font-semibold text-[#1B263B]">Top Holdings</h3>
            </div>
            <div className="space-y-2">
              {topHoldings.slice(0, 5).map((holding, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500 w-6">{index + 1}</span>
                    <span className="text-sm text-gray-700">{holding.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{holding.allocation}%</span>
                </div>
              ))}
              <button className="text-[#2E89C4] hover:text-[#2576a8] text-sm mt-2 flex items-center space-x-1">
                <span>View More (5 more)</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="pt-3 mt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Top 5</span>
                  <span className="text-sm font-bold text-[#2E89C4]">21.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Returns Comparison - Simplified */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#2E89C4]" />
              <h2 className="text-lg font-semibold text-[#1B263B]">
                Returns Comparison - {currentBasket.name} vs Nifty Index
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="comparison-amount" className="text-xs text-gray-600">Comparison Amount (₹)</label>
              <input
                id="comparison-amount"
                type="number"
                value={comparisonAmount}
                onChange={(e) => handleComparisonAmountChange(e.target.value)}
                min={1000}
                className="w-32 text-sm text-[#1B263B] border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-[#2E89C4]"
              />
            </div>
          </div>

          {/* Graph Type Toggle */}
          {isDualGraphData(apiData?.graphData) && (
            <div className="flex justify-center space-x-2 mb-4">
              <button
                onClick={() => setGraphType('absolute')}
                className={`px-6 py-2 rounded-lg text-sm transition-all ${
                  graphType === 'absolute'
                    ? 'bg-[#2E89C4] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Absolute Returns
              </button>
              <button
                onClick={() => setGraphType('rolling')}
                className={`px-6 py-2 rounded-lg text-sm transition-all ${
                  graphType === 'rolling'
                    ? 'bg-[#2E89C4] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rolling Returns
              </button>
            </div>
          )}

          {/* Timeline Selector - Compact */}
          <div className="flex justify-center space-x-2 mb-6">
            {[3, 5, 10].map((years) => (
              <button
                key={years}
                onClick={() => setSelectedTimeline(years as 3 | 5 | 10)}
                className={`px-8 py-2 rounded-lg text-sm transition-all ${
                  selectedTimeline === years
                    ? 'bg-[#2E89C4] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {years} Years
              </button>
            ))}
          </div>

          {/* Investment Summary - Compact */}
          {!loading && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-center text-[#1B263B]">
                If you invest <span className="font-semibold text-[#3BAF4A]">₹{comparisonAmount.toLocaleString()}</span> today, 
                it grows to <span className="font-semibold text-[#3BAF4A]">₹{Math.round(currentBasketValue).toLocaleString()}</span> in{' '}
                <span className="font-semibold text-[#2E89C4]">{selectedTimeline} years</span>
              </p>
              <p className="text-xs text-center text-gray-600 mt-1">
                Compared to Nifty Index: ₹{Math.round(currentNiftyValue).toLocaleString()} | 
                Outperformance: <span className="text-[#3BAF4A] font-medium">₹{Math.round(currentBasketValue - currentNiftyValue).toLocaleString()}</span>
              </p>
            </div>
          )}

          {/* Chart - Responsive */}
          <div className="mb-6">
            {loading ? (
              <div className="flex justify-center items-center h-[350px]">
                <div className="text-[#2E89C4]">Loading chart data...</div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-[350px] text-red-500">
                {error}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={apiData?.graphData ? 
                  (isDualGraphData(apiData.graphData) ? 
                    (() => {
                      const dataToUse = graphType === 'absolute' ? apiData.graphData.absoluteReturns : apiData.graphData.rollingReturns;
                      return dataToUse.labels.map((label: string, index: number) => ({
                        year: label,
                        basket: dataToUse.basketData[index],
                        nifty: dataToUse.niftyData[index]
                      }));
                    })() :
                    isSimpleGraphData(apiData.graphData) ? (() => {
                      const simpleData = apiData.graphData;
                      return simpleData.labels.map((label: string, index: number) => ({
                        year: label,
                        basket: simpleData.basketData[index],
                        nifty: simpleData.niftyData[index]
                      }));
                    })() : []
                  ) : chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="year" 
                    stroke="#6B7280"
                    style={{ fontSize: '10px' }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    interval={selectedTimeline === 3 ? (graphType === 'rolling' ? 2 : 2) : selectedTimeline === 5 ? (graphType === 'rolling' ? 4 : 3) : (graphType === 'rolling' ? 8 : 6)}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    style={{ fontSize: '11px' }}
                    tickFormatter={(value) => graphType === 'rolling' ? `${value}%` : `₹${(value / 1000).toFixed(0)}k`}
                    domain={graphType === 'rolling' ? ['auto', 'auto'] : [0, 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: any) => graphType === 'rolling' ? [`${value}%`, ''] : [`₹${value.toLocaleString()}`, '']}
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
                    strokeWidth={2.5}
                    name={currentBasket.name}
                    dot={false}
                    activeDot={{ r: 6, fill: '#3BAF4A' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="nifty" 
                    stroke="#2E89C4" 
                    strokeWidth={2.5}
                    name="Nifty 50"
                    dot={false}
                    activeDot={{ r: 6, fill: '#2E89C4' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
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

        {/* Additional Information Section with Accordions */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-[#1B263B] text-xl font-semibold mb-6">Additional Information</h2>
          
          <Accordion type="single" collapsible className="w-full space-y-2">
            {/* Suitable Goals */}
            <AccordionItem value="goals" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-[#2E89C4] hover:no-underline">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Suitable Goals</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pb-4">
                <div className="space-y-3">
                  <p className="mb-3">This basket is ideally suited for the following financial goals:</p>
                  <div className="grid gap-2">
                    {currentBasket.goals.map((goal, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-[#3BAF4A] mt-1 flex-shrink-0" />
                        <span>{goal}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-4 italic">
                    Align your investment with clear financial objectives for optimal results.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Basket Composition */}
            <AccordionItem value="composition" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-[#2E89C4] hover:no-underline">
                <div className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>Basket Composition</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pb-4">
                <div className="space-y-4">
                  <p className="mb-3">This basket contains {displayFunds.length} carefully selected mutual funds:</p>
                  {displayFunds.map((fund, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[#1B263B]">{fund.name}</span>
                        <span className="text-[#3BAF4A] font-semibold">{fund.allocation}%</span>
                      </div>
                      <p className="text-sm text-gray-600">{fund.category}</p>
                    </div>
                  ))}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-blue-900">
                      <strong>Note:</strong> Each fund is selected based on consistent performance, fund manager expertise, 
                      and alignment with the basket's investment strategy.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Portfolio Metrics */}
            <AccordionItem value="metrics" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-[#2E89C4] hover:no-underline">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Portfolio Metrics</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pb-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                    <p className="text-sm text-blue-900 mb-1">1-Year CAGR</p>
                    <p className="text-2xl font-bold text-blue-700">{actualMetrics.cagr1Y.toFixed(1)}%</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                    <p className="text-sm text-green-900 mb-1">3-Year CAGR</p>
                    <p className="text-2xl font-bold text-green-700">{actualMetrics.cagr3Y.toFixed(1)}%</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                    <p className="text-sm text-purple-900 mb-1">5-Year CAGR</p>
                    <p className="text-2xl font-bold text-purple-700">{actualMetrics.cagr5Y.toFixed(1)}%</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                    <p className="text-sm text-orange-900 mb-1">Sharpe Ratio</p>
                    <p className="text-2xl font-bold text-orange-700">{actualMetrics.sharpe.toFixed(2)}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>CAGR:</strong> Compound Annual Growth Rate measures the annual growth rate over a specified period.
                  <br />
                  <strong>Sharpe Ratio:</strong> Measures risk-adjusted returns. Higher is better (&gt;1.0 is good).
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Investment Style */}
            <AccordionItem value="style" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-[#2E89C4] hover:no-underline">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Investment Style</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pb-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div>
                      <p className="font-medium text-[#1B263B]">Growth Oriented</p>
                      <p className="text-sm text-gray-600">Focus on capital appreciation</p>
                    </div>
                    <span className="text-2xl font-bold text-blue-700">
                      {currentBasket.riskLevel === 'High' ? '70%' : currentBasket.riskLevel === 'Medium' ? '50%' : '30%'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <div>
                      <p className="font-medium text-[#1B263B]">Value Oriented</p>
                      <p className="text-sm text-gray-600">Undervalued stocks with strong fundamentals</p>
                    </div>
                    <span className="text-2xl font-bold text-green-700">
                      {currentBasket.riskLevel === 'High' ? '30%' : currentBasket.riskLevel === 'Medium' ? '50%' : '70%'}
                    </span>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-sm text-purple-900">
                      The investment style balances growth and value strategies to optimize returns while managing risk 
                      based on your {currentBasket.riskLevel.toLowerCase()} risk profile.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Fundamentals */}
            <AccordionItem value="fundamentals" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-[#2E89C4] hover:no-underline">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span>Fundamentals</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pb-4">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        currentBasket.riskLevel === 'High'
                          ? 'bg-red-100 text-red-700'
                          : currentBasket.riskLevel === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {currentBasket.riskLevel}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Time Horizon</p>
                      <p className="text-[#1B263B] font-medium">{currentBasket.timeHorizon}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Min. Investment</p>
                      <p className="text-[#1B263B] font-medium">₹{currentBasket.minInvestment.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#3BAF4A]/10 to-[#2E89C4]/10 rounded-lg p-4 border-l-4 border-[#3BAF4A]">
                    <p className="text-sm text-gray-700">
                      <strong>Risk Volatility:</strong> {actualMetrics.risk.toFixed(1)}% annualized standard deviation
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      This measures the basket's price fluctuation. Lower volatility indicates more stable returns.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Portfolio Aggregates */}
            <AccordionItem value="aggregates" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-[#2E89C4] hover:no-underline">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Portfolio Aggregates</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pb-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-[#1B263B] mb-3">Market Cap Allocation</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">Large Cap (Top 100)</span>
                        <span className="text-sm font-medium text-[#1B263B]">
                          {currentBasket.riskLevel === 'High' ? '45%' : currentBasket.riskLevel === 'Medium' ? '60%' : '75%'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all" 
                          style={{ width: currentBasket.riskLevel === 'High' ? '45%' : currentBasket.riskLevel === 'Medium' ? '60%' : '75%' }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">Mid Cap (101-250)</span>
                        <span className="text-sm font-medium text-[#1B263B]">
                          {currentBasket.riskLevel === 'High' ? '35%' : currentBasket.riskLevel === 'Medium' ? '30%' : '20%'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all" 
                          style={{ width: currentBasket.riskLevel === 'High' ? '35%' : currentBasket.riskLevel === 'Medium' ? '30%' : '20%' }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">Small Cap (250+)</span>
                        <span className="text-sm font-medium text-[#1B263B]">
                          {currentBasket.riskLevel === 'High' ? '20%' : currentBasket.riskLevel === 'Medium' ? '10%' : '5%'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all" 
                          style={{ width: currentBasket.riskLevel === 'High' ? '20%' : currentBasket.riskLevel === 'Medium' ? '10%' : '5%' }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-blue-900 mb-1">Large Cap</p>
                      <p className="text-xs text-blue-700">Stable, low risk</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-purple-900 mb-1">Mid Cap</p>
                      <p className="text-xs text-purple-700">Balanced growth</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-orange-900 mb-1">Small Cap</p>
                      <p className="text-xs text-orange-700">High growth</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Investment Rationale & Philosophy */}
            <AccordionItem value="rationale" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-[#2E89C4] hover:no-underline">
                <div className="flex items-center space-x-2">
                  <Layers className="w-5 h-5" />
                  <span>Investment Rationale & Philosophy</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pb-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-[#1B263B] mb-2 flex items-center space-x-2">
                      <Target className="w-4 h-4 text-[#3BAF4A]" />
                      <span>Investment Rationale</span>
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{currentBasket.rationale}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-[#1B263B] mb-2 flex items-center space-x-2">
                      <Star className="w-4 h-4 text-[#2E89C4]" />
                      <span>Basket Philosophy</span>
                    </h4>
                    <div className="bg-gradient-to-r from-[#3BAF4A]/5 to-[#2E89C4]/5 rounded-lg p-4 border-l-4 border-[#3BAF4A]">
                      <p className="text-gray-700 leading-relaxed italic">{currentBasket.philosophy}</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Investor Suitability Profile */}
            <AccordionItem value="suitability" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-[#2E89C4] hover:no-underline">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Investor Suitability Profile</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pb-4">
                <div className="space-y-4">
                  <p className="mb-4">{currentBasket.suitableFor}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-900 mb-2 font-medium">Age Range</p>
                      <p className="text-[#1B263B]">{currentBasket.ageRange}</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-900 mb-2 font-medium">Experience Level</p>
                      <p className="text-[#1B263B]">{currentBasket.experienceLevel}</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-purple-900 mb-2 font-medium">Risk Tolerance</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                        currentBasket.riskLevel === 'High'
                          ? 'bg-red-100 text-red-700'
                          : currentBasket.riskLevel === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {currentBasket.riskLevel}
                      </span>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4">
                      <p className="text-sm text-orange-900 mb-2 font-medium">Investment Horizon</p>
                      <p className="text-[#1B263B]">{currentBasket.timeHorizon}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#3BAF4A]/10 to-[#2E89C4]/10 rounded-lg p-4 border-l-4 border-[#2E89C4] mt-4">
                    <p className="text-sm text-gray-700">
                      <strong>Rebalancing:</strong> {currentBasket.rebalancingFrequency}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Regular rebalancing ensures your portfolio stays aligned with target allocations.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Investment Disclaimer */}
            <AccordionItem value="disclaimer" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-[#2E89C4] hover:no-underline">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Investment Disclaimer</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pb-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-900 leading-relaxed">
                    <strong>Risk Warning:</strong> Mutual fund investments are subject to market risks. 
                    Past performance is not indicative of future returns. Please read all scheme related 
                    documents carefully before investing. The performance data shown is based on historical 
                    returns and may not be sustained in the future.
                  </p>
                  <p className="text-xs text-yellow-800 mt-3">
                    Investors should consult with their financial advisor before making investment decisions. 
                    The information provided is for educational purposes only and should not be considered 
                    as financial advice.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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