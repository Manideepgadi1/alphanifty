import { useState } from 'react';
import { Header } from './Header';
import { User, Basket, CartItem } from '../App';
import { mockBaskets } from '../data/mockData';
import { Filter, TrendingUp, Clock, Target, AlertCircle, Activity, BarChart3, ShoppingCart } from 'lucide-react';

interface BasketListPageProps {
  navigateTo: (page: any) => void;
  user: User | null;
  setSelectedBasket: (basket: Basket) => void;
  cart?: CartItem[];
  addToCart?: (item: CartItem) => void;
  onShowCalculator?: () => void;
  onShowHelp?: () => void;
}

export function BasketListPage({ navigateTo, user, setSelectedBasket, cart, addToCart, onShowCalculator, onShowHelp }: BasketListPageProps) {
  const [filters, setFilters] = useState({
    age: '',
    risk: '',
    amount: '',
    experience: '',
    goal: '',
    timeframe: '',
    minCAGR: 0,
    maxCAGR: 100,
    cagrPeriod: '1Y'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Function to extract minimum years from time horizon string
  const getTimeHorizonYears = (timeHorizon: string): number => {
    const match = timeHorizon.match(/(\d+)/);
    return match ? parseInt(match[0]) : 999;
  };

  // Function to check if basket is a dummy basket (to be shown at end)
  const isDummyBasket = (basket: Basket): boolean => {
    const dummyBasketIds = ['b4', 'b2', 'b1', 'b7']; // Yellow, Blue, Orange Basket, Child Education (dummy baskets without real data)
    return dummyBasketIds.includes(basket.id);
  };

  // Function to get color priority (lower number = higher priority)
  const getColorPriority = (color: string): number => {
    const colorOrder: { [key: string]: number } = {
      '#FF6B35': 1,  // Orange
      '#FF9933': 1,  // Orange variant
      '#E8C23A': 2,  // Yellow
      '#F59E0B': 2,  // Yellow variant
      '#2E89C4': 3,  // Blue
      '#3B9DD3': 3,  // Blue variant
      '#3BAF4A': 4,  // Green
      '#10B981': 4,  // Green variant
    };
    return colorOrder[color] || 999;
  };

  const filteredBaskets = mockBaskets
    .filter(basket => {
    // Risk level filter
    if (filters.risk && basket.riskLevel !== filters.risk) return false;
    
    // Min investment filter
    if (filters.amount && basket.minInvestment > parseInt(filters.amount)) return false;
    
    // CAGR filter based on selected period
    const cagrValue = filters.cagrPeriod === '1Y' ? basket.cagr1Y : 
                      filters.cagrPeriod === '3Y' ? basket.cagr3Y : 
                      basket.cagr5Y;
    if (filters.minCAGR && cagrValue < filters.minCAGR) return false;
    if (filters.maxCAGR < 100 && cagrValue > filters.maxCAGR) return false;
    
    // Goal filter
    if (filters.goal && !basket.goals.some(g => g.toLowerCase().includes(filters.goal.toLowerCase()))) return false;
    
    // Age filter (parse age range)
    if (filters.age) {
      const ageNum = parseInt(filters.age);
      if (!basket.ageRange.toLowerCase().includes('all')) {
        const ageMatch = basket.ageRange.match(/\d+/g);
        if (ageMatch) {
          const minAge = parseInt(ageMatch[0]);
          const maxAge = ageMatch[1] ? parseInt(ageMatch[1]) : 100;
          if (ageNum < minAge || ageNum > maxAge) return false;
        }
      }
    }
    
    // Experience level filter
    if (filters.experience && !basket.experienceLevel.toLowerCase().includes(filters.experience.toLowerCase())) return false;
    
    // Time horizon filter
    if (filters.timeframe) {
      const timeframeYears = parseInt(filters.timeframe);
      const horizonMatch = basket.timeHorizon.match(/(\d+)/);
      if (horizonMatch) {
        const basketMinYears = parseInt(horizonMatch[0]);
        if (timeframeYears < basketMinYears) return false;
      }
    }
    
    return true;
  })
  .sort((a, b) => {
    const isDummyA = isDummyBasket(a);
    const isDummyB = isDummyBasket(b);
    
    // Dummy baskets always go to the end
    if (isDummyA && !isDummyB) return 1;
    if (!isDummyA && isDummyB) return -1;
    
    // Both are regular baskets or both are dummy baskets
    const yearsA = getTimeHorizonYears(a.timeHorizon);
    const yearsB = getTimeHorizonYears(b.timeHorizon);
    
    // Primary sort: by time horizon (ascending)
    if (yearsA !== yearsB) {
      return yearsA - yearsB;
    }
    
    // Secondary sort: by color priority (orange, yellow, blue, green)
    return getColorPriority(a.color) - getColorPriority(b.color);
  });

  const handleViewBasket = (basket: Basket) => {
    setSelectedBasket(basket);
    navigateTo('basket-details');
  };

  return (
    <div className="min-h-screen">
      <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={cart.length} onShowCalculator={onShowCalculator} onShowHelp={onShowHelp} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#2E89C4] to-[#1B263B] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="mb-4">Curated Investment Baskets</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Choose from expertly curated baskets tailored to your goals, risk profile, and investment timeline
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-2 text-[#2E89C4] mb-4"
          >
            <Filter className="w-5 h-5" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>

          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-[#2E89C4]" />
                <h3 className="text-[#1B263B]">Advanced Filters</h3>
              </div>
              <button
                onClick={() => setFilters({ age: '', risk: '', amount: '', experience: '', goal: '', timeframe: '', minCAGR: 0, maxCAGR: 100, cagrPeriod: '1Y' })}
                className="text-[#2E89C4] hover:text-[#2576a8] text-sm"
              >
                Clear All
              </button>
            </div>

            {/* Personal Details Section */}
            <div className="mb-6">
              <h4 className="text-sm text-gray-700 mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-[#3BAF4A]" />
                Personal Details
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Your Age</label>
                  <input
                    type="number"
                    value={filters.age}
                    onChange={(e) => setFilters({ ...filters, age: e.target.value })}
                    placeholder="e.g., 30"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="experience-filter" className="block text-sm text-gray-700 mb-2">Experience Level</label>
                  <select
                    id="experience-filter"
                    value={filters.experience}
                    onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                  >
                    <option value="">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="risk-filter" className="block text-sm text-gray-700 mb-2">Risk Appetite</label>
                  <select
                    id="risk-filter"
                    value={filters.risk}
                    onChange={(e) => setFilters({ ...filters, risk: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                  >
                    <option value="">All Levels</option>
                    <option value="Low">Low - Conservative</option>
                    <option value="Medium">Medium - Balanced</option>
                    <option value="High">High - Aggressive</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="amount-filter" className="block text-sm text-gray-700 mb-2">Investment Capacity</label>
                  <select
                    id="amount-filter"
                    value={filters.amount}
                    onChange={(e) => setFilters({ ...filters, amount: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                  >
                    <option value="">Any Amount</option>
                    <option value="5000">₹5,000+</option>
                    <option value="10000">₹10,000+</option>
                    <option value="25000">₹25,000+</option>
                    <option value="50000">₹50,000+</option>
                    <option value="100000">₹1,00,000+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Investment Preferences Section */}
            <div className="mb-6">
              <h4 className="text-sm text-gray-700 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2 text-[#2E89C4]" />
                Investment Preferences
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="goal-filter" className="block text-sm text-gray-700 mb-2">Investment Goal</label>
                  <select
                    id="goal-filter"
                    value={filters.goal}
                    onChange={(e) => setFilters({ ...filters, goal: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                  >
                    <option value="">All Goals</option>
                    <option value="Retirement">Retirement Planning</option>
                    <option value="Child Education">Child Education</option>
                    <option value="Dream Home">Dream Home</option>
                    <option value="Wealth Creation">Wealth Creation</option>
                    <option value="Marriage">Marriage Planning</option>
                    <option value="Emergency">Emergency Fund</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="timeframe-filter" className="block text-sm text-gray-700 mb-2">Time Horizon (Years)</label>
                  <select
                    id="timeframe-filter"
                    value={filters.timeframe}
                    onChange={(e) => setFilters({ ...filters, timeframe: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                  >
                    <option value="">Any Duration</option>
                    <option value="1">1+ Years (Short Term)</option>
                    <option value="3">3+ Years (Medium Term)</option>
                    <option value="5">5+ Years (Long Term)</option>
                    <option value="10">10+ Years (Very Long Term)</option>
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">Expected Returns (CAGR %)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      id="cagr-period-filter"
                      aria-label="CAGR Period"
                      value={filters.cagrPeriod}
                      onChange={(e) => setFilters({ ...filters, cagrPeriod: e.target.value })}
                      className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                    >
                      <option value="1Y">1 Year</option>
                      <option value="3Y">3 Years</option>
                      <option value="5Y">5 Years</option>
                    </select>
                    <input
                      type="number"
                      value={filters.minCAGR || ''}
                      onChange={(e) => setFilters({ ...filters, minCAGR: parseFloat(e.target.value) || 0 })}
                      placeholder="Min %"
                      className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                    />
                    <input
                      type="number"
                      value={filters.maxCAGR === 100 ? '' : filters.maxCAGR}
                      onChange={(e) => setFilters({ ...filters, maxCAGR: parseFloat(e.target.value) || 100 })}
                      placeholder="Max %"
                      className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filters.age || filters.risk || filters.amount || filters.experience || filters.goal || filters.timeframe || filters.minCAGR > 0 || filters.maxCAGR < 100) && (
              <div className="mt-4 p-4 bg-[#F5F7FA] rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {filters.age && (
                    <span className="inline-flex items-center bg-[#2E89C4] text-white px-3 py-1 rounded-full text-sm">
                      Age: {filters.age}
                    </span>
                  )}
                  {filters.risk && (
                    <span className="inline-flex items-center bg-[#2E89C4] text-white px-3 py-1 rounded-full text-sm">
                      Risk: {filters.risk}
                    </span>
                  )}
                  {filters.amount && (
                    <span className="inline-flex items-center bg-[#2E89C4] text-white px-3 py-1 rounded-full text-sm">
                      Min: ₹{parseInt(filters.amount).toLocaleString()}
                    </span>
                  )}
                  {filters.experience && (
                    <span className="inline-flex items-center bg-[#2E89C4] text-white px-3 py-1 rounded-full text-sm">
                      Experience: {filters.experience}
                    </span>
                  )}
                  {filters.goal && (
                    <span className="inline-flex items-center bg-[#2E89C4] text-white px-3 py-1 rounded-full text-sm">
                      Goal: {filters.goal}
                    </span>
                  )}
                  {filters.timeframe && (
                    <span className="inline-flex items-center bg-[#2E89C4] text-white px-3 py-1 rounded-full text-sm">
                      Time: {filters.timeframe}+ years
                    </span>
                  )}
                  {filters.minCAGR > 0 && (
                    <span className="inline-flex items-center bg-[#2E89C4] text-white px-3 py-1 rounded-full text-sm">
                      Min CAGR: {filters.minCAGR}%
                    </span>
                  )}
                  {filters.maxCAGR < 100 && (
                    <span className="inline-flex items-center bg-[#2E89C4] text-white px-3 py-1 rounded-full text-sm">
                      Max CAGR: {filters.maxCAGR}%
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="text-[#2E89C4]">{filteredBaskets.length}</span> basket{filteredBaskets.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Basket Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBaskets.map((basket) => (
            <div
              key={basket.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden border-2 border-transparent hover:border-[#3BAF4A]"
            >
              {/* Basket Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-lg shadow-md"
                      style={{ 
                        backgroundColor: basket.color,
                        border: basket.color === '#FFFFFF' ? '2px solid #E5E7EB' : 'none'
                      }}
                    />
                    <div>
                      <h3 className="text-[#1B263B]">{basket.name}</h3>
                      <p className="text-sm text-gray-500">{basket.ageRange}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{basket.description}</p>
              </div>

              {/* Basket Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>Risk</span>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        basket.riskLevel === 'High'
                          ? 'bg-red-100 text-red-700'
                          : basket.riskLevel === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {basket.riskLevel}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                      <Clock className="w-4 h-4" />
                      <span>Timeline</span>
                    </div>
                    <p className="text-[#1B263B]">{basket.timeHorizon}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Returns (CAGR)</span>
                  </div>
                  <div className="flex space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">1Y</p>
                      <p className="text-[#3BAF4A]">{basket.cagr1Y}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">3Y</p>
                      <p className="text-[#3BAF4A]">{basket.cagr3Y}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">5Y</p>
                      <p className="text-[#3BAF4A]">{basket.cagr5Y}%</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <Target className="w-4 h-4" />
                    <span>Suitable Goals</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {basket.goals.slice(0, 3).map((goal, index) => (
                      <span
                        key={index}
                        className="text-xs bg-[#F5F7FA] text-gray-700 px-2 py-1 rounded"
                      >
                        {goal}
                      </span>
                    ))}
                    {basket.goals.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{basket.goals.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-1">Minimum SIP</p>
                  <p className="text-[#1B263B]">₹{basket.minInvestment.toLocaleString()}/month</p>
                </div>

                {/* New Risk and Sharpe Ratio Section */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                      <Activity className="w-4 h-4" />
                      <span>Risk %</span>
                    </div>
                    <p className="text-[#1B263B]">{basket.riskPercentage}%</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                      <BarChart3 className="w-4 h-4" />
                      <span>Sharpe Ratio</span>
                    </div>
                    <p className="text-[#1B263B]">{basket.sharpeRatio}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleViewBasket(basket)}
                    className="bg-[#2E89C4] hover:bg-[#2576a8] text-white py-3 rounded-lg transition-colors"
                  >
                    View Basket
                  </button>
                  <button
                    onClick={() => {
                      if (!user) {
                        navigateTo('auth-welcome');
                        return;
                      }
                      if (addToCart) {
                        addToCart({
                          basket,
                          amount: basket.minInvestment,
                          type: 'SIP',
                          frequency: 'Monthly'
                        });
                      }
                      navigateTo('cart');
                    }}
                    className="bg-[#3BAF4A] hover:bg-[#329940] text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBaskets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl mb-4">No baskets match your filters</p>
            <button
              onClick={() => setFilters({ age: '', risk: '', amount: '', experience: '', goal: '', timeframe: '', minCAGR: 0 })}
              className="text-[#2E89C4] hover:text-[#2576a8]"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}