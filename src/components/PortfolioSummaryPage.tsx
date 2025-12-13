import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3 } from 'lucide-react';
import { mockBaskets } from '../data/mockData';
import { Header } from './Header';
import { User, Basket } from '../App';

interface PortfolioSummaryPageProps {
  navigateTo: (page: string, basketId?: string) => void;
  user: User | null;
  onShowCalculator?: () => void;
  onShowHelp?: () => void;
}

export function PortfolioSummaryPage({ navigateTo, user, onShowCalculator, onShowHelp }: PortfolioSummaryPageProps) {
  // Calculate portfolio metrics
  const totalBaskets = mockBaskets.length;
  const avgCAGR = mockBaskets.reduce((sum: number, b: Basket) => sum + (b.cagr5Y || 0), 0) / totalBaskets;
  const avgRisk = mockBaskets.reduce((sum: number, b: Basket) => sum + b.riskPercentage, 0) / totalBaskets;
  const bestPerformer = mockBaskets.reduce((best: Basket, current: Basket) => 
    (current.cagr5Y || 0) > (best.cagr5Y || 0) ? current : best
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigateTo={navigateTo} user={user} onShowCalculator={onShowCalculator} onShowHelp={onShowHelp} />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#2E89C4] to-[#1B6EA1] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigateTo('basket-list')}
            className="flex items-center space-x-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Baskets</span>
          </button>
          
          <h1 className="text-4xl font-bold mb-2">Portfolio Summary</h1>
          <p className="text-blue-100">Complete overview of all your investment baskets</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Total Baskets</h3>
              <PieChart className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalBaskets}</p>
            <p className="text-sm text-green-600 mt-2">Active & Ready</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Avg. CAGR (5Y)</h3>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{avgCAGR.toFixed(2)}%</p>
            <p className="text-sm text-gray-500 mt-2">Across all baskets</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Avg. Risk</h3>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{avgRisk.toFixed(1)}%</p>
            <p className="text-sm text-gray-500 mt-2">Portfolio volatility</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Best Performer</h3>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-xl font-bold text-gray-900">{bestPerformer.name}</p>
            <p className="text-sm text-green-600 mt-2">{bestPerformer.cagr5Y}% CAGR</p>
          </div>
        </div>

        {/* Baskets Overview Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">All Baskets Overview</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Basket Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    CAGR (3Y)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    CAGR (5Y)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sharpe Ratio
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Funds
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockBaskets.map((basket: Basket) => (
                  <tr key={basket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: basket.color }}
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{basket.name}</div>
                          <div className="text-sm text-gray-500">{basket.ageRange}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${basket.riskPercentage < 30 ? 'bg-green-100 text-green-800' :
                          basket.riskPercentage < 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}
                      `}>
                        {basket.riskPercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        {basket.cagr3Y && basket.cagr3Y > 10 ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className="font-semibold">{basket.cagr3Y || 'N/A'}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        {basket.cagr5Y && basket.cagr5Y > 12 ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className="font-semibold">{basket.cagr5Y || 'N/A'}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-gray-900">
                        {basket.sharpeRatio || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-600">{basket.funds.length}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => navigateTo('basket-details', basket.id)}
                        className="text-[#2E89C4] hover:text-[#1B6EA1] font-semibold transition-colors"
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Distribution</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Low Risk (&lt;30%)</span>
                  <span className="font-semibold">{mockBaskets.filter((b: Basket) => b.riskPercentage < 30).length} baskets</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(mockBaskets.filter((b: Basket) => b.riskPercentage < 30).length / totalBaskets) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Medium Risk (30-60%)</span>
                  <span className="font-semibold">{mockBaskets.filter((b: Basket) => b.riskPercentage >= 30 && b.riskPercentage < 60).length} baskets</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(mockBaskets.filter((b: Basket) => b.riskPercentage >= 30 && b.riskPercentage < 60).length / totalBaskets) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">High Risk (&gt;60%)</span>
                  <span className="font-semibold">{mockBaskets.filter((b: Basket) => b.riskPercentage >= 60).length} baskets</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(mockBaskets.filter((b: Basket) => b.riskPercentage >= 60).length / totalBaskets) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Experience Level Distribution</h3>
            <div className="space-y-4">
              {['Beginner', 'Intermediate', 'Expert'].map((level) => {
                const count = mockBaskets.filter((b: Basket) => b.experienceLevel.includes(level)).length;
                return (
                  <div key={level} className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{level}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#2E89C4] h-2 rounded-full" 
                          style={{ width: `${(count / totalBaskets) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-600 w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
