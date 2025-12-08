import { Header } from './Header';
import { User, Basket } from '../App';
import { ArrowLeft, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, IndianRupee, Download, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BasketInvestmentJourneyProps {
  basket: Basket;
  navigateTo: (page: any) => void;
  user: User | null;
  cartCount: number;
}

interface MonthlyInvestment {
  month: string;
  invested: number;
  currentValue: number;
  profit: number;
  sipAmount: number;
}

interface TransactionHistory {
  id: string;
  date: string;
  type: 'SIP' | 'Lumpsum' | 'Redemption';
  amount: number;
  units: number;
  nav: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

export function BasketInvestmentJourney({ basket, navigateTo, user, cartCount }: BasketInvestmentJourneyProps) {
  // Calculate investment details
  const monthlyInvestment = basket.minInvestment;
  const totalInvested = monthlyInvestment * 12;
  const growthRate = basket.cagr1Y / 100;
  const currentValue = totalInvested * (1 + growthRate);
  const profitLoss = currentValue - totalInvested;
  const profitLossPercentage = (profitLoss / totalInvested) * 100;
  const unitsHeld = totalInvested / 10; // Assuming ₹10 initial NAV
  const currentNAV = currentValue / unitsHeld;
  const isProfitable = profitLoss >= 0;

  // Generate monthly investment journey data
  const monthlyData: MonthlyInvestment[] = [
    { month: 'Dec 2024', invested: monthlyInvestment, currentValue: monthlyInvestment * 1.02, profit: monthlyInvestment * 0.02, sipAmount: monthlyInvestment },
    { month: 'Jan 2025', invested: monthlyInvestment * 2, currentValue: monthlyInvestment * 2 * 1.04, profit: monthlyInvestment * 2 * 0.04, sipAmount: monthlyInvestment },
    { month: 'Feb', invested: monthlyInvestment * 3, currentValue: monthlyInvestment * 3 * 1.06, profit: monthlyInvestment * 3 * 0.06, sipAmount: monthlyInvestment },
    { month: 'Mar', invested: monthlyInvestment * 4, currentValue: monthlyInvestment * 4 * 1.07, profit: monthlyInvestment * 4 * 0.07, sipAmount: monthlyInvestment },
    { month: 'Apr', invested: monthlyInvestment * 5, currentValue: monthlyInvestment * 5 * 1.09, profit: monthlyInvestment * 5 * 0.09, sipAmount: monthlyInvestment },
    { month: 'May', invested: monthlyInvestment * 6, currentValue: monthlyInvestment * 6 * 1.10, profit: monthlyInvestment * 6 * 0.10, sipAmount: monthlyInvestment },
    { month: 'Jun', invested: monthlyInvestment * 7, currentValue: monthlyInvestment * 7 * 1.11, profit: monthlyInvestment * 7 * 0.11, sipAmount: monthlyInvestment },
    { month: 'Jul', invested: monthlyInvestment * 8, currentValue: monthlyInvestment * 8 * 1.12, profit: monthlyInvestment * 8 * 0.12, sipAmount: monthlyInvestment },
    { month: 'Aug', invested: monthlyInvestment * 9, currentValue: monthlyInvestment * 9 * 1.13, profit: monthlyInvestment * 9 * 0.13, sipAmount: monthlyInvestment },
    { month: 'Sep', invested: monthlyInvestment * 10, currentValue: monthlyInvestment * 10 * 1.14, profit: monthlyInvestment * 10 * 0.14, sipAmount: monthlyInvestment },
    { month: 'Oct', invested: monthlyInvestment * 11, currentValue: monthlyInvestment * 11 * 1.145, profit: monthlyInvestment * 11 * 0.145, sipAmount: monthlyInvestment },
    { month: 'Nov', invested: totalInvested, currentValue: currentValue, profit: profitLoss, sipAmount: monthlyInvestment },
  ];

  // Generate transaction history
  const transactionHistory: TransactionHistory[] = monthlyData.map((data, idx) => ({
    id: `TXN${String(idx + 1).padStart(3, '0')}`,
    date: data.month,
    type: 'SIP' as const,
    amount: data.sipAmount,
    units: data.sipAmount / (10 + idx * 0.1), // Mock units calculation
    nav: 10 + idx * 0.1, // Mock NAV progression
    status: 'Completed' as const
  }));

  // Fund allocation data for pie chart
  const fundAllocationData = basket.funds.map(fund => ({
    name: fund.name,
    value: fund.allocation,
    color: fund.allocation > 30 ? '#3BAF4A' : fund.allocation > 20 ? '#2E89C4' : fund.allocation > 10 ? '#E8C23A' : '#1B263B'
  }));

  // Download investment journey data
  const downloadJourneyData = () => {
    const csvHeaders = 'Month,Invested Amount,Current Value,Profit/Loss,SIP Amount\n';
    const csvRows = monthlyData.map(data => 
      `"${data.month}",${data.invested.toFixed(2)},${data.currentValue.toFixed(2)},${data.profit.toFixed(2)},${data.sipAmount}`
    ).join('\n');
    
    const transactionHeaders = '\n\nTransaction History\nID,Date,Type,Amount,Units,NAV,Status\n';
    const transactionRows = transactionHistory.map(txn =>
      `${txn.id},"${txn.date}",${txn.type},${txn.amount},${txn.units.toFixed(2)},${txn.nav.toFixed(2)},${txn.status}`
    ).join('\n');
    
    const csvContent = `Investment Journey - ${basket.name}\n\n` +
      `Summary\n` +
      `Total Invested,₹${totalInvested.toLocaleString()}\n` +
      `Current Value,₹${currentValue.toLocaleString()}\n` +
      `Profit/Loss,₹${profitLoss.toLocaleString()}\n` +
      `Returns,${profitLossPercentage.toFixed(2)}%\n\n` +
      csvHeaders + csvRows + transactionHeaders + transactionRows;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${basket.name.replace(/\s+/g, '_')}_investment_journey.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={cartCount} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <button
            onClick={() => navigateTo('dashboard')}
            className="flex items-center space-x-2 text-[#2E89C4] hover:text-[#2576a8] mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-16 h-16 rounded-xl shadow-lg"
                style={{ 
                  backgroundColor: basket.color,
                  border: basket.color === '#FFFFFF' ? '2px solid #E5E7EB' : 'none'
                }}
              />
              <div>
                <h1 className="text-[#1B263B] mb-1">{basket.name}</h1>
                <p className="text-gray-600">Investment Journey & Performance</p>
              </div>
            </div>
            
            <button
              onClick={downloadJourneyData}
              className="flex items-center space-x-2 px-6 py-3 bg-[#3BAF4A] hover:bg-[#329940] text-white rounded-lg transition-colors shadow-lg"
            >
              <Download className="w-5 h-5" />
              <span>Download Journey</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#2E89C4]/20">
            <div className="flex items-center space-x-2 mb-2">
              <IndianRupee className="w-5 h-5 text-[#2E89C4]" />
              <p className="text-sm text-gray-600">Total Invested</p>
            </div>
            <p className="text-3xl text-[#2E89C4] mb-1">₹{totalInvested.toLocaleString()}</p>
            <p className="text-xs text-gray-500">SIP: ₹{monthlyInvestment.toLocaleString()}/month</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#3BAF4A]/20">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-[#3BAF4A]" />
              <p className="text-sm text-gray-600">Current Value</p>
            </div>
            <p className="text-3xl text-[#3BAF4A] mb-1">₹{currentValue.toLocaleString()}</p>
            <p className="text-xs text-gray-500">NAV: ₹{currentNAV.toFixed(2)}</p>
          </div>

          <div className={`rounded-xl shadow-lg p-6 border-2 ${
            isProfitable ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {isProfitable ? (
                <ArrowUpRight className="w-5 h-5 text-green-600" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-600" />
              )}
              <p className="text-sm text-gray-600">Profit/Loss</p>
            </div>
            <p className={`text-3xl mb-1 ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              {isProfitable ? '+' : ''}₹{profitLoss.toLocaleString()}
            </p>
            <p className={`text-xs ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              {isProfitable ? '+' : ''}{profitLossPercentage.toFixed(2)}%
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#E8C23A]/20">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-[#E8C23A]" />
              <p className="text-sm text-gray-600">Investment Period</p>
            </div>
            <p className="text-3xl text-[#1B263B] mb-1">12</p>
            <p className="text-xs text-gray-500">Months</p>
          </div>
        </div>

        {/* Investment Growth Chart */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-[#1B263B] mb-6">Investment Growth Over Time</h2>
          
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorInvestedJourney" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E89C4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2E89C4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCurrentJourney" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3BAF4A" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3BAF4A" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8C23A" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#E8C23A" stopOpacity={0}/>
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
                fill="url(#colorInvestedJourney)"
                strokeWidth={2}
                name="Invested Amount"
              />
              <Area 
                type="monotone" 
                dataKey="currentValue" 
                stroke="#3BAF4A" 
                fill="url(#colorCurrentJourney)"
                strokeWidth={2}
                name="Current Value"
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#E8C23A" 
                fill="url(#colorProfit)"
                strokeWidth={2}
                name="Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly SIP Contributions */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-[#1B263B] mb-6">Monthly SIP Contributions</h2>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
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
                <Bar dataKey="sipAmount" fill="#2E89C4" name="SIP Amount" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fund Allocation Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-[#1B263B] mb-6">Fund Allocation Breakdown</h2>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fundAllocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fundAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #E5E7EB', 
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                  formatter={(value: number) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {fundAllocationData.map((fund, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: fund.color }} />
                    <span className="text-gray-700">{fund.name}</span>
                  </div>
                  <span className="text-[#1B263B]">{fund.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-[#1B263B] mb-6">Transaction History</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Transaction ID</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Type</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-600">Amount</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-600">Units</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-600">NAV</th>
                  <th className="text-center py-3 px-4 text-sm text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="text-sm text-[#2E89C4]">{txn.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-[#1B263B]">{txn.date}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm bg-[#2E89C4]/10 text-[#2E89C4] px-2 py-1 rounded">
                        {txn.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm text-[#1B263B]">₹{txn.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm text-gray-600">{txn.units.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm text-gray-600">₹{txn.nav.toFixed(2)}</span>
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

        {/* Key Insights */}
        <div className="bg-gradient-to-br from-[#2E89C4]/10 to-[#3BAF4A]/10 rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-[#1B263B] mb-4">Investment Insights</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-[#1B263B] text-sm mb-2">Average Monthly Return</h3>
              <p className="text-2xl text-[#3BAF4A]">+{(profitLossPercentage / 12).toFixed(2)}%</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-[#1B263B] text-sm mb-2">Total Units Accumulated</h3>
              <p className="text-2xl text-[#2E89C4]">{unitsHeld.toFixed(2)}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-[#1B263B] text-sm mb-2">Best Performing Month</h3>
              <p className="text-2xl text-[#E8C23A]">Nov 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
