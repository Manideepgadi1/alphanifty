import { useState } from 'react';
import { Header } from './Header';
import { User, Basket, CartItem } from '../App';
import { mockFunds } from '../data/mockData';
import { Filter, Star, TrendingUp, Search, Plus, Eye, AlertTriangle, X } from 'lucide-react';

interface ExploreMutualFundsPageProps {
  navigateTo: (page: any) => void;
  user: User | null;
  cart?: CartItem[];
  addToCart?: (item: CartItem) => void;
  setSelectedBasket?: (basket: Basket) => void;
}

export function ExploreMutualFundsPage({ navigateTo, user, cart, addToCart, setSelectedBasket }: ExploreMutualFundsPageProps) {
  const [filters, setFilters] = useState({
    category: '',
    risk: '',
    minRating: 0,
    fundHouse: '',
    searchTerm: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [selectedFund, setSelectedFund] = useState<any>(null);
  const [acknowledgmentChecked, setAcknowledgmentChecked] = useState(false);

  const filteredFunds = mockFunds.filter(fund => {
    if (filters.category && fund.category !== filters.category) return false;
    if (filters.risk && fund.risk !== filters.risk) return false;
    if (filters.minRating && fund.rating < filters.minRating) return false;
    if (filters.fundHouse && fund.fundHouse !== filters.fundHouse) return false;
    if (filters.searchTerm && !fund.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    return true;
  });

  const uniqueFundHouses = Array.from(new Set(mockFunds.map(f => f.fundHouse)));

  // Create a single-fund basket from a fund
  const createBasketFromFund = (fund: any): Basket => {
    const fundWithAllocation = { ...fund, allocation: 100 };
    return {
      id: `custom-${fund.id}`,
      name: fund.name,
      color: fund.category === 'Equity' ? '#3BAF4A' : fund.category === 'Debt' ? '#2E89C4' : '#E8C23A',
      description: `Single fund investment in ${fund.name}`,
      ageRange: 'All ages',
      riskLevel: fund.risk,
      minInvestment: 5000,
      timeHorizon: fund.category === 'Equity' ? '5+ years' : fund.category === 'Debt' ? '1-3 years' : '3-5 years',
      goals: ['Wealth Creation'],
      experienceLevel: 'Beginner to Expert',
      cagr1Y: fund.returns1Y,
      cagr3Y: fund.returns3Y,
      cagr5Y: fund.returns5Y,
      funds: [fundWithAllocation],
      rationale: `Direct investment in ${fund.name} from ${fund.fundHouse}`,
      suitableFor: 'Investors looking for focused exposure to this specific fund',
      rebalancingFrequency: 'Not applicable',
      riskPercentage: fund.standardDeviation,
      sharpeRatio: fund.sharpeRatio
    };
  };

  const handleAddToCart = (fund: any) => {
    if (!user) {
      navigateTo('login');
      return;
    }
    // Show disclaimer modal before adding to cart
    setSelectedFund(fund);
    setShowDisclaimerModal(true);
    setAcknowledgmentChecked(false);
  };

  const confirmAddToCart = () => {
    if (!acknowledgmentChecked || !selectedFund) return;
    
    if (addToCart) {
      const basket = createBasketFromFund(selectedFund);
      addToCart({
        basket,
        amount: 5000,
        type: 'SIP',
        frequency: 'Monthly'
      });
      setShowDisclaimerModal(false);
      setSelectedFund(null);
      setAcknowledgmentChecked(false);
      navigateTo('cart');
    }
  };

  const closeDisclaimerModal = () => {
    setShowDisclaimerModal(false);
    setSelectedFund(null);
    setAcknowledgmentChecked(false);
  };

  const handleViewBasket = (fund: any) => {
    const basket = createBasketFromFund(fund);
    if (setSelectedBasket) {
      setSelectedBasket(basket);
    }
    navigateTo('basket-details');
  };

  return (
    <div className="min-h-screen">
      <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={cart?.length || 0} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#2E89C4] to-[#1B263B] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="mb-4">Explore Mutual Funds</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Browse through our comprehensive list of mutual funds and create your custom basket
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              placeholder="Search for mutual funds..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
            />
          </div>
        </div>

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
            <div className="flex items-center space-x-2 mb-6">
              <Filter className="w-5 h-5 text-[#2E89C4]" />
              <h3 className="text-[#1B263B]">Filter Funds</h3>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="Equity">Equity</option>
                  <option value="Debt">Debt</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Risk Level</label>
                <select
                  value={filters.risk}
                  onChange={(e) => setFilters({ ...filters, risk: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                >
                  <option value="">All Levels</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Min Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                >
                  <option value="0">All Ratings</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Fund House</label>
                <select
                  value={filters.fundHouse}
                  onChange={(e) => setFilters({ ...filters, fundHouse: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                >
                  <option value="">All Fund Houses</option>
                  {uniqueFundHouses.map(house => (
                    <option key={house} value={house}>{house}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setFilters({ category: '', risk: '', minRating: 0, fundHouse: '', searchTerm: '' })}
              className="mt-4 text-[#2E89C4] hover:text-[#2576a8] text-sm"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="text-[#2E89C4]">{filteredFunds.length}</span> mutual fund{filteredFunds.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Fund Cards */}
        <div className="space-y-4">
          {filteredFunds.map((fund) => (
            <div
              key={fund.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border-2 border-transparent hover:border-[#3BAF4A]"
            >
              <div className="grid md:grid-cols-12 gap-6">
                {/* Fund Info */}
                <div className="md:col-span-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-[#1B263B] mb-2">{fund.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-[#2E89C4]/10 text-[#2E89C4] px-2 py-1 rounded">
                          {fund.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          fund.risk === 'High' ? 'bg-red-100 text-red-700' :
                          fund.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {fund.risk} Risk
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Fund House:</span>
                      <span className="text-[#1B263B]">{fund.fundHouse}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">AUM:</span>
                      <span className="text-[#1B263B]">{fund.aum}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Expense Ratio:</span>
                      <span className="text-[#1B263B]">{fund.expenseRatio}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(fund.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-[#E8C23A] fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Returns */}
                <div className="md:col-span-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[#3BAF4A]" />
                    <span className="text-sm text-gray-600">Returns (CAGR)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#F5F7FA] rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">1 Year</p>
                      <p className="text-lg text-[#3BAF4A]">{fund.returns1Y}%</p>
                    </div>
                    <div className="bg-[#F5F7FA] rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">3 Years</p>
                      <p className="text-lg text-[#3BAF4A]">{fund.returns3Y}%</p>
                    </div>
                    <div className="bg-[#F5F7FA] rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">5 Years</p>
                      <p className="text-lg text-[#3BAF4A]">{fund.returns5Y}%</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="md:col-span-3 flex flex-col justify-center space-y-3">
                  <button
                    onClick={() => handleAddToCart(fund)}
                    className="w-full bg-[#3BAF4A] hover:bg-[#329940] text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add to Basket</span>
                  </button>
                  <button
                    onClick={() => handleViewBasket(fund)}
                    className="w-full border-2 border-[#2E89C4] text-[#2E89C4] hover:bg-[#2E89C4] hover:text-white py-3 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFunds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl mb-4">No funds match your filters</p>
            <button
              onClick={() => setFilters({ category: '', risk: '', minRating: 0, fundHouse: '', searchTerm: '' })}
              className="text-[#2E89C4] hover:text-[#2576a8]"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Disclaimer Modal */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6" />
                <h2 className="text-xl">Investment Disclaimer & Acknowledgment</h2>
              </div>
              <button
                onClick={closeDisclaimerModal}
                className="hover:bg-white/20 p-1 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Fund Details */}
              {selectedFund && (
                <div className="bg-[#F5F7FA] rounded-lg p-4 border-2 border-[#2E89C4]">
                  <p className="text-sm text-gray-600 mb-1">You are about to invest in:</p>
                  <h3 className="text-[#1B263B] mb-2">{selectedFund.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-[#2E89C4]/10 text-[#2E89C4] px-2 py-1 rounded">
                      {selectedFund.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      selectedFund.risk === 'High' ? 'bg-red-100 text-red-700' :
                      selectedFund.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {selectedFund.risk} Risk
                    </span>
                  </div>
                </div>
              )}

              {/* Disclaimer Text */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-900 mb-2">Important Notice - Self-Directed Investment</h4>
                    <p className="text-sm text-yellow-800 leading-relaxed">
                      I confirm that I have independently selected this mutual fund based on my knowledge and understanding. 
                      I acknowledge that this fund may involve <span className="font-semibold">market risk, volatility, potential loss of capital</span>, and 
                      returns are not guaranteed. I take full responsibility for this investment decision and agree that 
                      <span className="font-semibold"> VS Fintech or its representatives will not be liable for any financial loss</span> arising from this choice. 
                      I have understood the Riskometer level, investment objective, and suitability of this scheme before confirming.
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Risk Points */}
              <div className="space-y-3">
                <h4 className="text-[#1B263B]">Key Points to Remember:</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">Market risks apply to all investments</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">Returns are not guaranteed</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">Past performance doesn't guarantee future results</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">You are solely responsible for this decision</p>
                  </div>
                </div>
              </div>

              {/* Acknowledgment Checkbox */}
              <div className="bg-[#F5F7FA] rounded-lg p-4 border-2 border-gray-200">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acknowledgmentChecked}
                    onChange={(e) => setAcknowledgmentChecked(e.target.checked)}
                    className="w-5 h-5 text-[#3BAF4A] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3BAF4A] mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-[#1B263B]">
                    <span className="font-semibold">I have read and understood</span> the disclaimer above. I acknowledge all risks involved and 
                    take full responsibility for this self-directed investment decision.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={closeDisclaimerModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAddToCart}
                  disabled={!acknowledgmentChecked}
                  className={`flex-1 px-6 py-3 rounded-lg transition-all ${
                    acknowledgmentChecked
                      ? 'bg-[#3BAF4A] hover:bg-[#329940] text-white shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {acknowledgmentChecked ? 'Confirm & Add to Cart' : 'Please Acknowledge to Continue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}