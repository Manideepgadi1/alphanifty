import { Header } from './Header';
import { User } from '../App';
import { ArrowLeft, ArrowRight, Search, Plus, Check, TrendingUp, Info } from 'lucide-react';
import { useState } from 'react';

interface FundSelectionPageProps {
  navigateTo: (page: any, data?: any) => void;
  user: User | null;
  basketData?: any;
}

interface MutualFund {
  id: string;
  name: string;
  category: string;
  fundHouse: string;
  aum: number;
  expenseRatio: number;
  cagr3Y: number;
  riskLevel: string;
}

const availableFunds: MutualFund[] = [
  { id: 'MF001', name: 'HDFC Top 100 Fund', category: 'Large Cap', fundHouse: 'HDFC Mutual Fund', aum: 25000, expenseRatio: 1.05, cagr3Y: 14.5, riskLevel: 'Moderate' },
  { id: 'MF002', name: 'ICICI Prudential Bluechip Fund', category: 'Large Cap', fundHouse: 'ICICI Prudential', aum: 32000, expenseRatio: 0.95, cagr3Y: 15.2, riskLevel: 'Moderate' },
  { id: 'MF003', name: 'SBI Equity Hybrid Fund', category: 'Hybrid', fundHouse: 'SBI Mutual Fund', aum: 18500, expenseRatio: 1.15, cagr3Y: 12.8, riskLevel: 'Moderate' },
  { id: 'MF004', name: 'Axis Bluechip Fund', category: 'Large Cap', fundHouse: 'Axis Mutual Fund', aum: 28000, expenseRatio: 0.85, cagr3Y: 16.1, riskLevel: 'Moderate' },
  { id: 'MF005', name: 'Kotak Emerging Equity Fund', category: 'Mid Cap', fundHouse: 'Kotak Mahindra', aum: 12000, expenseRatio: 1.35, cagr3Y: 18.5, riskLevel: 'High' },
  { id: 'MF006', name: 'Mirae Asset Large Cap Fund', category: 'Large Cap', fundHouse: 'Mirae Asset', aum: 22000, expenseRatio: 0.92, cagr3Y: 15.8, riskLevel: 'Moderate' },
  { id: 'MF007', name: 'Parag Parikh Flexi Cap Fund', category: 'Flexi Cap', fundHouse: 'PPFAS Mutual Fund', aum: 35000, expenseRatio: 1.08, cagr3Y: 17.2, riskLevel: 'Moderate-High' },
  { id: 'MF008', name: 'DSP Equity Opportunities Fund', category: 'Flexi Cap', fundHouse: 'DSP Mutual Fund', aum: 16000, expenseRatio: 1.22, cagr3Y: 14.9, riskLevel: 'Moderate-High' },
  { id: 'MF009', name: 'UTI Nifty Index Fund', category: 'Index Fund', fundHouse: 'UTI Mutual Fund', aum: 28000, expenseRatio: 0.25, cagr3Y: 13.5, riskLevel: 'Moderate' },
  { id: 'MF010', name: 'Franklin India Equity Fund', category: 'Large Cap', fundHouse: 'Franklin Templeton', aum: 14000, expenseRatio: 1.12, cagr3Y: 13.8, riskLevel: 'Moderate' },
  { id: 'MF011', name: 'Nippon India Small Cap Fund', category: 'Small Cap', fundHouse: 'Nippon India', aum: 9500, expenseRatio: 1.52, cagr3Y: 20.5, riskLevel: 'High' },
  { id: 'MF012', name: 'L&T Midcap Fund', category: 'Mid Cap', fundHouse: 'L&T Mutual Fund', aum: 11000, expenseRatio: 1.28, cagr3Y: 19.2, riskLevel: 'High' },
  { id: 'MF013', name: 'Tata Digital India Fund', category: 'Thematic', fundHouse: 'Tata Mutual Fund', aum: 7500, expenseRatio: 1.45, cagr3Y: 21.5, riskLevel: 'High' },
  { id: 'MF014', name: 'HDFC Balanced Advantage Fund', category: 'Hybrid', fundHouse: 'HDFC Mutual Fund', aum: 42000, expenseRatio: 0.98, cagr3Y: 11.5, riskLevel: 'Moderate' },
  { id: 'MF015', name: 'Quant Active Fund', category: 'Flexi Cap', fundHouse: 'Quant Mutual Fund', aum: 6800, expenseRatio: 1.65, cagr3Y: 24.2, riskLevel: 'High' },
];

export function FundSelectionPage({ navigateTo, user, basketData }: FundSelectionPageProps) {
  const [selectedFunds, setSelectedFunds] = useState<MutualFund[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  const categories = ['All', 'Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Hybrid', 'Index Fund', 'Thematic'];
  const riskLevels = ['All', 'Moderate', 'Moderate-High', 'High'];

  const toggleFund = (fund: MutualFund) => {
    if (selectedFunds.find(f => f.id === fund.id)) {
      setSelectedFunds(selectedFunds.filter(f => f.id !== fund.id));
    } else {
      if (selectedFunds.length < 15) {
        setSelectedFunds([...selectedFunds, fund]);
      }
    }
  };

  const filteredFunds = availableFunds.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fund.fundHouse.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || fund.category === categoryFilter;
    const matchesRisk = riskFilter === 'All' || fund.riskLevel === riskFilter;
    return matchesSearch && matchesCategory && matchesRisk;
  });

  const handleNext = () => {
    if (selectedFunds.length < 3) {
      alert('Please select at least 3 funds to create a basket');
      return;
    }
    navigateTo('fund-allocation', { 
      ...basketData, 
      selectedFunds 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={0} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigateTo('create-basket')}
          className="flex items-center space-x-2 text-[#2E89C4] hover:text-[#1B263B] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-[#1B263B] mb-2">Add Funds to Basket</h1>
                <p className="text-gray-600">
                  Creating: <span className="text-[#2E89C4]">{basketData?.basketName || 'My Basket'}</span>
                </p>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#3BAF4A]">Step 2 of 4</span>
                  <span className="text-sm text-gray-500">Select Funds</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-[#3BAF4A] to-[#2E89C4] h-2 rounded-full" style={{ width: '50%' }} />
                </div>
              </div>

              {/* Search and Filters */}
              <div className="space-y-4 mb-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by fund name or fund house..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-2">Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-2">Risk Level</label>
                    <select
                      value={riskFilter}
                      onChange={(e) => setRiskFilter(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                    >
                      {riskLevels.map(risk => (
                        <option key={risk} value={risk}>{risk}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Fund List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#1B263B]">Available Funds ({filteredFunds.length})</h3>
                  <span className="text-sm text-gray-600">
                    {selectedFunds.length}/15 selected
                  </span>
                </div>

                {filteredFunds.map(fund => {
                  const isSelected = selectedFunds.find(f => f.id === fund.id);
                  
                  return (
                    <div
                      key={fund.id}
                      onClick={() => toggleFund(fund)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-[#3BAF4A] bg-[#3BAF4A]/5' 
                          : 'border-gray-200 hover:border-[#2E89C4] hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-[#1B263B] mb-1">{fund.name}</h4>
                              <p className="text-sm text-gray-600">{fund.fundHouse}</p>
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              isSelected 
                                ? 'bg-[#3BAF4A] text-white' 
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              {isSelected ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4 mt-3">
                            <div>
                              <p className="text-xs text-gray-500">Category</p>
                              <p className="text-sm text-[#1B263B]">{fund.category}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">3Y CAGR</p>
                              <p className="text-sm text-[#3BAF4A]">{fund.cagr3Y}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Risk</p>
                              <p className="text-sm text-[#1B263B]">{fund.riskLevel}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Expense</p>
                              <p className="text-sm text-[#1B263B]">{fund.expenseRatio}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredFunds.length === 0 && (
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No funds match your search criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Selected Funds */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-[#1B263B] mb-4">Selected Funds</h3>

              {selectedFunds.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No funds selected yet</p>
                  <p className="text-xs text-gray-400 mt-1">Select 3-15 funds</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                    {selectedFunds.map((fund, index) => (
                      <div key={fund.id} className="bg-gray-50 rounded-lg p-3 flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-[#1B263B] mb-1">{fund.name}</p>
                          <p className="text-xs text-gray-500">{fund.category}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFund(fund);
                          }}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200 mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Total Funds:</span>
                      <span className="text-[#1B263B]">{selectedFunds.length}</span>
                    </div>
                    {selectedFunds.length < 3 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                        <p className="text-xs text-yellow-800">
                          <Info className="w-3 h-3 inline mr-1" />
                          Select at least {3 - selectedFunds.length} more fund{3 - selectedFunds.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={selectedFunds.length < 3}
                    className={`w-full py-3 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                      selectedFunds.length >= 3
                        ? 'bg-[#3BAF4A] hover:bg-[#329940] text-white shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Next: Set Allocation</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
