import { useState } from 'react';
import { Header } from './Header';
import { User, Basket } from '../App';
import { TrendingUp, History, RefreshCw, PieChart, Calendar, ArrowUpRight, ArrowDownRight, Download, X, FileText, BarChart3 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardPageProps {
  myBaskets: Basket[];
  navigateTo: (page: any) => void;
  user: User | null;
  setSelectedBasket: (basket: Basket) => void;
  cartCount: number;
}

interface Transaction {
  id: string;
  date: string;
  basket: string;
  type: 'SIP' | 'Lumpsum';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

interface RebalanceHistory {
  id: string;
  date: string;
  basket: string;
  changes: string;
}

const mockTransactions: Transaction[] = [
  { id: 'TXN001', date: '2025-11-20', basket: 'Orange Basket', type: 'SIP', amount: 25000, status: 'Completed' },
  { id: 'TXN002', date: '2025-11-15', basket: 'Blue Basket', type: 'Lumpsum', amount: 50000, status: 'Completed' },
  { id: 'TXN003', date: '2025-11-10', basket: 'Retirement Basket', type: 'SIP', amount: 30000, status: 'Completed' },
  { id: 'TXN004', date: '2025-11-05', basket: 'Green Basket', type: 'SIP', amount: 10000, status: 'Completed' },
];

const mockRebalanceHistory: RebalanceHistory[] = [
  { id: 'REB001', date: '2025-11-01', basket: 'Orange Basket', changes: 'Increased allocation to Mid-cap funds by 5%' },
  { id: 'REB002', date: '2025-10-01', basket: 'Blue Basket', changes: 'Rebalanced equity-debt ratio to 60:40' },
  { id: 'REB003', date: '2025-09-15', basket: 'Retirement Basket', changes: 'Added new large-cap fund, reduced small-cap exposure' },
];

export function DashboardPage({ myBaskets, navigateTo, user, setSelectedBasket, cartCount }: DashboardPageProps) {
  const [selectedBasketForDetails, setSelectedBasketForDetails] = useState<Basket | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const totalInvested = myBaskets.reduce((sum, basket) => sum + basket.minInvestment, 0) * 12; // Assuming SIP for 12 months
  const totalReturns = totalInvested * 0.15; // Mock 15% returns
  const currentValue = totalInvested + totalReturns;

  // Generate mock portfolio performance data
  const portfolioPerformanceData = [
    { month: 'Jun', invested: totalInvested * 0.5, current: totalInvested * 0.52, profit: totalInvested * 0.02 },
    { month: 'Jul', invested: totalInvested * 0.6, current: totalInvested * 0.64, profit: totalInvested * 0.04 },
    { month: 'Aug', invested: totalInvested * 0.7, current: totalInvested * 0.76, profit: totalInvested * 0.06 },
    { month: 'Sep', invested: totalInvested * 0.8, current: totalInvested * 0.88, profit: totalInvested * 0.08 },
    { month: 'Oct', invested: totalInvested * 0.9, current: totalInvested * 1.01, profit: totalInvested * 0.11 },
    { month: 'Nov', invested: totalInvested, current: currentValue, profit: totalReturns }
  ];

  const handleViewBasket = (basket: Basket) => {
    setSelectedBasket(basket);
    navigateTo('basket-details');
  };

  const handleViewDetailsModal = (basket: Basket) => {
    setSelectedBasketForDetails(basket);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedBasketForDetails(null);
  };

  // Calculate basket-specific details
  const getBasketDetails = (basket: Basket) => {
    const invested = basket.minInvestment * 12; // Assuming SIP for 12 months
    const growthRate = basket.cagr1Y / 100;
    const currentValue = invested * (1 + growthRate);
    const profitLoss = currentValue - invested;
    const profitLossPercentage = (profitLoss / invested) * 100;
    
    // Calculate NAV (Net Asset Value per unit)
    const unitsHeld = invested / 10; // Assuming ₹10 initial NAV
    const currentNAV = currentValue / unitsHeld;
    
    return {
      invested,
      currentValue,
      profitLoss,
      profitLossPercentage,
      unitsHeld,
      currentNAV
    };
  };

  // Download portfolio data as CSV
  const downloadPortfolioData = () => {
    const csvHeaders = 'Basket Name,Invested Amount,Current Value,Profit/Loss,Profit/Loss %,NAV,Units Held,Risk Level,CAGR 1Y\n';
    const csvRows = myBaskets.map(basket => {
      const details = getBasketDetails(basket);
      return `"${basket.name}",${details.invested},${details.currentValue.toFixed(2)},${details.profitLoss.toFixed(2)},${details.profitLossPercentage.toFixed(2)}%,${details.currentNAV.toFixed(2)},${details.unitsHeld.toFixed(2)},${basket.riskLevel},${basket.cagr1Y}%`;
    }).join('\n');
    
    const csvContent = csvHeaders + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `alphanifty_portfolio_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download individual basket details
  const downloadBasketDetails = (basket: Basket) => {
    const details = getBasketDetails(basket);
    const csvContent = `Alphanifty - ${basket.name} Details\n\n` +
      `Basket Information\n` +
      `Name,${basket.name}\n` +
      `Risk Level,${basket.riskLevel}\n` +
      `Time Horizon,${basket.timeHorizon}\n\n` +
      `Investment Details\n` +
      `Invested Amount,₹${details.invested.toLocaleString()}\n` +
      `Current Value,₹${details.currentValue.toLocaleString()}\n` +
      `Profit/Loss,₹${details.profitLoss.toLocaleString()}\n` +
      `Profit/Loss %,${details.profitLossPercentage.toFixed(2)}%\n` +
      `NAV,₹${details.currentNAV.toFixed(2)}\n` +
      `Units Held,${details.unitsHeld.toFixed(2)}\n` +
      `CAGR 1Y,${basket.cagr1Y}%\n` +
      `CAGR 3Y,${basket.cagr3Y}%\n` +
      `CAGR 5Y,${basket.cagr5Y}%\n\n` +
      `Fund Allocation\n` +
      `Fund Name,Allocation %\n` +
      basket.funds.map(f => `"${f.name}",${f.allocation}%`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${basket.name.replace(/\s+/g, '_')}_details.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen">
      <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={cartCount} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-[#1B263B] mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Here's an overview of your investment portfolio</p>
        </div>

        {/* Portfolio Performance Graph */}
        {myBaskets.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-[#2E89C4]" />
                <h2 className="text-[#1B263B]">Portfolio Performance</h2>
              </div>
              <button
                onClick={downloadPortfolioData}
                className="flex items-center space-x-2 px-4 py-2 bg-[#3BAF4A] hover:bg-[#329940] text-white rounded-lg transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Data</span>
              </button>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={portfolioPerformanceData}>
                <defs>
                  <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E89C4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2E89C4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3BAF4A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3BAF4A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #E5E7EB', 
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="invested" 
                  stroke="#2E89C4" 
                  fill="url(#colorInvested)"
                  strokeWidth={2}
                  name="Invested Amount"
                />
                <Area 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#3BAF4A" 
                  fill="url(#colorCurrent)"
                  strokeWidth={2}
                  name="Current Value"
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Invested</p>
                <p className="text-lg text-[#2E89C4]">₹{totalInvested.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Current Value</p>
                <p className="text-lg text-[#3BAF4A]">₹{currentValue.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Profit</p>
                <p className="text-lg text-[#3BAF4A]">₹{totalReturns.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#3BAF4A] to-[#2E89C4] text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Current Value</h3>
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-4xl mb-2">₹{currentValue.toLocaleString()}</p>
            <div className="flex items-center space-x-2 text-sm text-white/80">
              <ArrowUpRight className="w-4 h-4" />
              <span>+15.2% overall</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#1B263B]">Total Invested</h3>
              <PieChart className="w-6 h-6 text-[#2E89C4]" />
            </div>
            <p className="text-4xl text-[#1B263B] mb-2">₹{totalInvested.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Across {myBaskets.length} basket{myBaskets.length !== 1 ? 's' : ''}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#1B263B]">Total Returns</h3>
              <TrendingUp className="w-6 h-6 text-[#3BAF4A]" />
            </div>
            <p className="text-4xl text-[#3BAF4A] mb-2">₹{totalReturns.toLocaleString()}</p>
            <p className="text-sm text-gray-600">+15.0% CAGR</p>
          </div>
        </div>

        {/* My Baskets */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#1B263B]">My Baskets</h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigateTo('my-baskets')}
                className="text-[#3BAF4A] hover:text-[#329940] text-sm flex items-center space-x-1"
              >
                <span>+ Create Custom Basket</span>
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => navigateTo('basket-list')}
                className="text-[#2E89C4] hover:text-[#2576a8] text-sm"
              >
                + Add New Basket
              </button>
            </div>
          </div>

          {myBaskets.length === 0 ? (
            <div className="text-center py-12">
              <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-6">You haven't invested in any baskets yet</p>
              <button
                onClick={() => navigateTo('basket-list')}
                className="bg-[#2E89C4] hover:bg-[#2576a8] text-white px-6 py-3 rounded-lg transition-colors"
              >
                Explore Baskets
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBaskets.map((basket, index) => (
                <div
                  key={`${basket.id}-${index}`}
                  className="border-2 border-gray-100 rounded-xl p-6 hover:border-[#2E89C4] transition-all hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-lg shadow-md"
                      style={{ 
                        backgroundColor: basket.color,
                        border: basket.color === '#FFFFFF' ? '2px solid #E5E7EB' : 'none'
                      }}
                    />
                    <div>
                      <h3 className="text-[#1B263B]">{basket.name}</h3>
                      <p className="text-sm text-gray-500">{basket.funds.length} funds</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Invested:</span>
                      <span className="text-[#1B263B]">₹{(basket.minInvestment * 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current Value:</span>
                      <span className="text-[#3BAF4A]">₹{(basket.minInvestment * 12 * 1.15).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Returns:</span>
                      <div className="flex items-center space-x-1 text-[#3BAF4A]">
                        <ArrowUpRight className="w-4 h-4" />
                        <span>{basket.cagr1Y}%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewDetailsModal(basket)}
                    className="w-full bg-[#2E89C4] hover:bg-[#2576a8] text-white py-2 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <History className="w-6 h-6 text-[#2E89C4]" />
            <h2 className="text-[#1B263B]">Transaction History</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Basket</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Type</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-600">Amount</th>
                  <th className="text-center py-3 px-4 text-sm text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-[#1B263B]">{txn.date}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-[#1B263B]">{txn.basket}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm bg-[#2E89C4]/10 text-[#2E89C4] px-2 py-1 rounded">
                        {txn.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm text-[#1B263B]">₹{txn.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        txn.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rebalance History */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-2 mb-6">
            <RefreshCw className="w-6 h-6 text-[#2E89C4]" />
            <h2 className="text-[#1B263B]">Rebalance History</h2>
          </div>

          <div className="space-y-4">
            {mockRebalanceHistory.map((rebalance) => (
              <div
                key={rebalance.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-[#2E89C4] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-[#1B263B]">{rebalance.basket}</h3>
                  <span className="text-sm text-gray-500">{rebalance.date}</span>
                </div>
                <p className="text-sm text-gray-600">{rebalance.changes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigateTo('basket-list')}
            className="flex-1 bg-[#3BAF4A] hover:bg-[#329940] text-white py-4 rounded-lg transition-all shadow-lg"
          >
            Invest More
          </button>
          <button
            onClick={() => navigateTo('explore-funds')}
            className="flex-1 bg-[#E8C23A] hover:bg-[#d4b034] text-[#1B263B] py-4 rounded-lg transition-all shadow-lg"
          >
            Explore Funds
          </button>
        </div>
      </div>

      {/* Basket Details Modal */}
      {showDetailsModal && selectedBasketForDetails && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#2E89C4] to-[#1B263B] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-lg shadow-md"
                  style={{ 
                    backgroundColor: selectedBasketForDetails.color,
                    border: selectedBasketForDetails.color === '#FFFFFF' ? '2px solid white' : 'none'
                  }}
                />
                <div>
                  <h2 className="text-xl">{selectedBasketForDetails.name}</h2>
                  <p className="text-sm text-white/80">{selectedBasketForDetails.funds.length} funds</p>
                </div>
              </div>
              <button
                onClick={closeDetailsModal}
                className="hover:bg-white/20 p-1 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {(() => {
                const details = getBasketDetails(selectedBasketForDetails);
                const isProfitable = details.profitLoss >= 0;
                
                return (
                  <>
                    {/* Key Metrics Grid */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-[#2E89C4]/10 to-[#2E89C4]/5 rounded-lg p-4 border-2 border-[#2E89C4]/20">
                        <p className="text-sm text-gray-600 mb-1">Invested Amount</p>
                        <p className="text-2xl text-[#2E89C4]">₹{details.invested.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">SIP for 12 months</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-[#3BAF4A]/10 to-[#3BAF4A]/5 rounded-lg p-4 border-2 border-[#3BAF4A]/20">
                        <p className="text-sm text-gray-600 mb-1">Current Value</p>
                        <p className="text-2xl text-[#3BAF4A]">₹{details.currentValue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">As of today</p>
                      </div>
                      
                      <div className={`rounded-lg p-4 border-2 ${
                        isProfitable 
                          ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
                          : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
                      }`}>
                        <p className="text-sm text-gray-600 mb-1">Profit/Loss</p>
                        <p className={`text-2xl ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                          {isProfitable ? '+' : ''}₹{details.profitLoss.toLocaleString()}
                        </p>
                        <div className="flex items-center space-x-1 text-xs mt-1">
                          {isProfitable ? (
                            <ArrowUpRight className="w-3 h-3 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-600" />
                          )}
                          <span className={isProfitable ? 'text-green-600' : 'text-red-600'}>
                            {details.profitLossPercentage.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* NAV and Units Information */}
                    <div className="bg-[#F5F7FA] rounded-lg p-6">
                      <h3 className="text-[#1B263B] mb-4">Investment Details</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-600">Net Asset Value (NAV)</span>
                            <span className="text-lg text-[#1B263B]">₹{details.currentNAV.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Units Held</span>
                            <span className="text-lg text-[#1B263B]">{details.unitsHeld.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-600">Risk Level</span>
                            <span className={`px-3 py-1 rounded text-sm ${
                              selectedBasketForDetails.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                              selectedBasketForDetails.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {selectedBasketForDetails.riskLevel}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Time Horizon</span>
                            <span className="text-sm text-[#1B263B]">{selectedBasketForDetails.timeHorizon}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Returns Performance */}
                    <div className="bg-white border-2 border-gray-100 rounded-lg p-6">
                      <h3 className="text-[#1B263B] mb-4">Returns Performance</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">1 Year CAGR</p>
                          <div className="flex items-center justify-center space-x-1">
                            <TrendingUp className="w-4 h-4 text-[#3BAF4A]" />
                            <p className="text-xl text-[#3BAF4A]">{selectedBasketForDetails.cagr1Y}%</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">3 Year CAGR</p>
                          <div className="flex items-center justify-center space-x-1">
                            <TrendingUp className="w-4 h-4 text-[#3BAF4A]" />
                            <p className="text-xl text-[#3BAF4A]">{selectedBasketForDetails.cagr3Y}%</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">5 Year CAGR</p>
                          <div className="flex items-center justify-center space-x-1">
                            <TrendingUp className="w-4 h-4 text-[#3BAF4A]" />
                            <p className="text-xl text-[#3BAF4A]">{selectedBasketForDetails.cagr5Y}%</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fund Allocation */}
                    <div className="bg-white border-2 border-gray-100 rounded-lg p-6">
                      <h3 className="text-[#1B263B] mb-4">Fund Allocation</h3>
                      <div className="space-y-3">
                        {selectedBasketForDetails.funds.map((fund, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-[#1B263B]">{fund.name}</p>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div
                                  className="bg-[#3BAF4A] h-2 rounded-full"
                                  style={{ width: `${fund.allocation}%` }}
                                />
                              </div>
                            </div>
                            <div className="ml-4 text-right">
                              <span className="text-sm text-gray-600">{fund.allocation}%</span>
                              <p className="text-xs text-[#3BAF4A]">₹{((details.invested * fund.allocation) / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => downloadBasketDetails(selectedBasketForDetails)}
                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-[#3BAF4A] hover:bg-[#329940] text-white rounded-lg transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        <span>Download Details</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBasket(selectedBasketForDetails);
                          closeDetailsModal();
                          navigateTo('basket-investment-journey');
                        }}
                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border-2 border-[#2E89C4] text-[#2E89C4] hover:bg-[#2E89C4] hover:text-white rounded-lg transition-colors"
                      >
                        <FileText className="w-5 h-5" />
                        <span>View Investment Journey</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}