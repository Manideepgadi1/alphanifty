import { Header } from './Header';
import { User } from '../App';
import { ArrowLeft, ArrowRight, Search, Plus, Check, TrendingUp, Info } from 'lucide-react';
import { useState } from 'react';

interface AdminFundSelectionPageProps {
  navigateTo: (page: any, data?: any) => void;
  user: User | null;
  basketData?: any;
}

interface MutualFund {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  fundHouse: string;
  aum: number;
  expenseRatio: number;
  cagr1Y: number;
  cagr3Y: number;
  cagr5Y: number;
  riskLevel: string;
  nav: number;
  sharpeRatio: number;
  standardDeviation: number;
  rating: number;
}

const availableFunds: MutualFund[] = [
  { id: 'MF001', name: 'HDFC Top 100 Fund - Growth', category: 'Equity', subCategory: 'Large Cap Fund', fundHouse: 'HDFC Mutual Fund', aum: 25000, expenseRatio: 1.05, cagr1Y: 13.5, cagr3Y: 14.5, cagr5Y: 15.2, riskLevel: 'Medium', nav: 745.23, sharpeRatio: 1.45, standardDeviation: 12.3, rating: 4 },
  { id: 'MF002', name: 'ICICI Prudential Bluechip Fund - Direct', category: 'Equity', subCategory: 'Large Cap Fund', fundHouse: 'ICICI Prudential', aum: 32000, expenseRatio: 0.95, cagr1Y: 14.2, cagr3Y: 15.2, cagr5Y: 16.1, riskLevel: 'Medium', nav: 89.45, sharpeRatio: 1.52, standardDeviation: 11.8, rating: 5 },
  { id: 'MF003', name: 'SBI Equity Hybrid Fund - Regular', category: 'Hybrid', subCategory: 'Aggressive Hybrid Fund', fundHouse: 'SBI Mutual Fund', aum: 18500, expenseRatio: 1.15, cagr1Y: 11.8, cagr3Y: 12.8, cagr5Y: 13.5, riskLevel: 'Medium', nav: 156.78, sharpeRatio: 1.32, standardDeviation: 9.5, rating: 4 },
  { id: 'MF004', name: 'Axis Bluechip Fund - Growth', category: 'Equity', subCategory: 'Large Cap Fund', fundHouse: 'Axis Mutual Fund', aum: 28000, expenseRatio: 0.85, cagr1Y: 15.1, cagr3Y: 16.1, cagr5Y: 17.2, riskLevel: 'Medium', nav: 52.34, sharpeRatio: 1.58, standardDeviation: 12.1, rating: 5 },
  { id: 'MF005', name: 'Kotak Emerging Equity Fund - Direct', category: 'Equity', subCategory: 'Mid Cap Fund', fundHouse: 'Kotak Mahindra', aum: 12000, expenseRatio: 1.35, cagr1Y: 17.5, cagr3Y: 18.5, cagr5Y: 19.8, riskLevel: 'High', nav: 78.92, sharpeRatio: 1.28, standardDeviation: 15.2, rating: 4 },
  { id: 'MF006', name: 'Mirae Asset Large Cap Fund - Regular', category: 'Equity', subCategory: 'Large Cap Fund', fundHouse: 'Mirae Asset', aum: 22000, expenseRatio: 0.92, cagr1Y: 14.8, cagr3Y: 15.8, cagr5Y: 16.5, riskLevel: 'Medium', nav: 67.89, sharpeRatio: 1.48, standardDeviation: 11.9, rating: 5 },
  { id: 'MF007', name: 'Parag Parikh Flexi Cap Fund - Direct', category: 'Equity', subCategory: 'Flexi Cap Fund', fundHouse: 'PPFAS Mutual Fund', aum: 35000, expenseRatio: 1.08, cagr1Y: 16.2, cagr3Y: 17.2, cagr5Y: 18.5, riskLevel: 'Medium', nav: 45.67, sharpeRatio: 1.55, standardDeviation: 13.2, rating: 5 },
  { id: 'MF008', name: 'DSP Equity Opportunities Fund - Growth', category: 'Equity', subCategory: 'Flexi Cap Fund', fundHouse: 'DSP Mutual Fund', aum: 16000, expenseRatio: 1.22, cagr1Y: 13.9, cagr3Y: 14.9, cagr5Y: 15.6, riskLevel: 'Medium', nav: 234.56, sharpeRatio: 1.38, standardDeviation: 12.8, rating: 4 },
  { id: 'MF009', name: 'UTI Nifty Index Fund - Direct', category: 'Index', subCategory: 'Index Fund / ETF', fundHouse: 'UTI Mutual Fund', aum: 28000, expenseRatio: 0.25, cagr1Y: 12.5, cagr3Y: 13.5, cagr5Y: 14.2, riskLevel: 'Medium', nav: 123.45, sharpeRatio: 1.42, standardDeviation: 11.5, rating: 4 },
  { id: 'MF010', name: 'Franklin India Equity Fund - Growth', category: 'Equity', subCategory: 'Large Cap Fund', fundHouse: 'Franklin Templeton', aum: 14000, expenseRatio: 1.12, cagr1Y: 12.8, cagr3Y: 13.8, cagr5Y: 14.5, riskLevel: 'Medium', nav: 876.34, sharpeRatio: 1.35, standardDeviation: 12.5, rating: 4 },
  { id: 'MF011', name: 'Nippon India Small Cap Fund - Direct', category: 'Equity', subCategory: 'Small Cap Fund', fundHouse: 'Nippon India', aum: 9500, expenseRatio: 1.52, cagr1Y: 19.5, cagr3Y: 20.5, cagr5Y: 22.3, riskLevel: 'High', nav: 98.76, sharpeRatio: 1.22, standardDeviation: 18.5, rating: 5 },
  { id: 'MF012', name: 'L&T Midcap Fund - Regular', category: 'Equity', subCategory: 'Mid Cap Fund', fundHouse: 'L&T Mutual Fund', aum: 11000, expenseRatio: 1.28, cagr1Y: 18.2, cagr3Y: 19.2, cagr5Y: 20.5, riskLevel: 'High', nav: 187.65, sharpeRatio: 1.32, standardDeviation: 16.2, rating: 4 },
  { id: 'MF013', name: 'Tata Multi Cap Fund - Direct', category: 'Equity', subCategory: 'Multi Cap Fund', fundHouse: 'Tata Mutual Fund', aum: 7500, expenseRatio: 1.45, cagr1Y: 20.5, cagr3Y: 21.5, cagr5Y: 23.2, riskLevel: 'High', nav: 34.56, sharpeRatio: 1.18, standardDeviation: 19.8, rating: 4 },
  { id: 'MF014', name: 'HDFC Balanced Advantage Fund - Growth', category: 'Hybrid', subCategory: 'Aggressive Hybrid Fund', fundHouse: 'HDFC Mutual Fund', aum: 42000, expenseRatio: 0.98, cagr1Y: 10.5, cagr3Y: 11.5, cagr5Y: 12.2, riskLevel: 'Low', nav: 267.89, sharpeRatio: 1.52, standardDeviation: 8.2, rating: 5 },
  { id: 'MF015', name: 'Quant Active Fund - Direct', category: 'Equity', subCategory: 'Flexi Cap Fund', fundHouse: 'Quant Mutual Fund', aum: 6800, expenseRatio: 1.65, cagr1Y: 23.2, cagr3Y: 24.2, cagr5Y: 25.8, riskLevel: 'High', nav: 56.78, sharpeRatio: 1.15, standardDeviation: 20.5, rating: 4 },
  { id: 'MF016', name: 'Axis ELSS Tax Saver Fund - Direct', category: 'Solution-Oriented', subCategory: 'Equity Linked Savings Scheme', fundHouse: 'Axis Mutual Fund', aum: 18000, expenseRatio: 0.68, cagr1Y: 14.5, cagr3Y: 15.5, cagr5Y: 16.8, riskLevel: 'Medium', nav: 68.45, sharpeRatio: 1.48, standardDeviation: 12.5, rating: 5 },
  { id: 'MF017', name: 'SBI ETF Nifty 50 - Direct', category: 'Index', subCategory: 'Equity Exchange Traded Funds', fundHouse: 'SBI Mutual Fund', aum: 15000, expenseRatio: 0.07, cagr1Y: 12.2, cagr3Y: 13.2, cagr5Y: 14.0, riskLevel: 'Medium', nav: 185.67, sharpeRatio: 1.42, standardDeviation: 11.3, rating: 4 },
  { id: 'MF018', name: 'ICICI Prudential Corporate Bond Fund - Direct', category: 'Debt', subCategory: 'Corporate Bond Fund', fundHouse: 'ICICI Prudential', aum: 24000, expenseRatio: 0.45, cagr1Y: 7.5, cagr3Y: 8.2, cagr5Y: 8.8, riskLevel: 'Low', nav: 24.56, sharpeRatio: 1.25, standardDeviation: 3.2, rating: 5 },
  { id: 'MF019', name: 'Kotak Equity Opportunities Fund - Regular', category: 'Equity', subCategory: 'Large Cap Fund', fundHouse: 'Kotak Mahindra', aum: 19000, expenseRatio: 1.15, cagr1Y: 13.8, cagr3Y: 14.8, cagr5Y: 15.5, riskLevel: 'Medium', nav: 156.89, sharpeRatio: 1.38, standardDeviation: 12.0, rating: 4 },
  { id: 'MF020', name: 'Motilal Oswal Nifty Midcap 150 Index Fund - Direct', category: 'Index', subCategory: 'Index Fund / ETF', fundHouse: 'Motilal Oswal', aum: 8500, expenseRatio: 0.28, cagr1Y: 16.5, cagr3Y: 17.5, cagr5Y: 18.8, riskLevel: 'High', nav: 42.34, sharpeRatio: 1.32, standardDeviation: 15.8, rating: 4 },
];

export function AdminFundSelectionPage({ navigateTo, user, basketData }: AdminFundSelectionPageProps) {
  const isEditMode = basketData?.isEditMode || false;
  const editingBasket = basketData?.editingBasket || null;

  // Pre-select funds if in edit mode
  const getInitialSelectedFunds = () => {
    if (isEditMode && editingBasket?.funds) {
      // Map basket funds to MutualFund objects from availableFunds
      return editingBasket.funds
        .map((basketFund: any) => {
          return availableFunds.find(f => f.id === basketFund.id);
        })
        .filter((f: any) => f !== undefined) as MutualFund[];
    }
    return [];
  };

  const [selectedFunds, setSelectedFunds] = useState<MutualFund[]>(getInitialSelectedFunds());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subCategoryFilter, setSubCategoryFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  const categories = ['All', 'Equity', 'Debt', 'Hybrid', 'Solution-Oriented', 'Index', 'Other'];
  const subCategories = ['All', 'Large Cap Fund', 'Mid Cap Fund', 'Small Cap Fund', 'Flexi Cap Fund', 'Multi Cap Fund', 'Equity Linked Savings Scheme', 'Equity Exchange Traded Funds', 'Corporate Bond Fund', 'Aggressive Hybrid Fund', 'Index Fund / ETF'];
  const riskLevels = ['All', 'Low', 'Medium', 'High'];

  const toggleFund = (fund: MutualFund) => {
    if (selectedFunds.find(f => f.id === fund.id)) {
      setSelectedFunds(selectedFunds.filter(f => f.id !== fund.id));
    } else {
      if (selectedFunds.length < 20) {
        setSelectedFunds([...selectedFunds, fund]);
      }
    }
  };

  const filteredFunds = availableFunds.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fund.fundHouse.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || fund.category === categoryFilter;
    const matchesSubCategory = subCategoryFilter === 'All' || fund.subCategory === subCategoryFilter;
    const matchesRisk = riskFilter === 'All' || fund.riskLevel === riskFilter;
    return matchesSearch && matchesCategory && matchesSubCategory && matchesRisk;
  });

  const handleNext = () => {
    if (selectedFunds.length < 3) {
      alert('Please select at least 3 funds to create a basket');
      return;
    }
    navigateTo('admin-fund-allocation', { 
      ...basketData, 
      selectedFunds 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigateTo={navigateTo} user={user} showCart={false} cartCount={0} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigateTo('admin-create-basket', basketData)}
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
                <h1 className="text-[#1B263B] mb-2">
                  {isEditMode ? 'Edit' : 'Add'} Funds to Basket
                  {isEditMode && (
                    <span className="ml-3 text-sm bg-[#E8C23A] text-white px-3 py-1 rounded-full">
                      Editing
                    </span>
                  )}
                </h1>
                <p className="text-gray-600">
                  {isEditMode ? 'Updating' : 'Creating'}: <span className="text-[#2E89C4]">{basketData?.basketName || editingBasket?.name || 'My Basket'}</span>
                </p>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#3BAF4A]">Step 2 of 5</span>
                  <span className="text-sm text-gray-500">Select Funds</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-[#3BAF4A] to-[#2E89C4] h-2 rounded-full" style={{ width: '40%' }} />
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
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-2">Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setSubCategoryFilter('All');
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-2">Sub-Category</label>
                    <select
                      value={subCategoryFilter}
                      onChange={(e) => setSubCategoryFilter(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                    >
                      {subCategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
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
                    {selectedFunds.length}/20 selected
                  </span>
                </div>

                <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
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
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-xs bg-[#2E89C4]/10 text-[#2E89C4] px-2 py-0.5 rounded">{fund.category}</span>
                                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{fund.subCategory}</span>
                                </div>
                              </div>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                isSelected 
                                  ? 'bg-[#3BAF4A] text-white' 
                                  : 'bg-gray-100 text-gray-400'
                              }`}>
                                {isSelected ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                              </div>
                            </div>

                            <div className="grid grid-cols-5 gap-4 mt-3">
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
                              <div>
                                <p className="text-xs text-gray-500">AUM</p>
                                <p className="text-sm text-[#1B263B]">₹{fund.aum}Cr</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Rating</p>
                                <p className="text-sm text-[#E8C23A]">{'★'.repeat(fund.rating)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

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
                  <p className="text-xs text-gray-400 mt-1">Select 3-20 funds</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                    {selectedFunds.map((fund, index) => (
                      <div key={fund.id} className="bg-gray-50 rounded-lg p-3 flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-[#1B263B] mb-1">{fund.name}</p>
                          <p className="text-xs text-gray-500">{fund.subCategory}</p>
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