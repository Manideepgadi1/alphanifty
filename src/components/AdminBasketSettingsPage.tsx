import { Header } from './Header';
import { User } from '../App';
import { ArrowLeft, Check, PieChart, Save, Calendar } from 'lucide-react';
import { useState } from 'react';

interface AdminBasketSettingsPageProps {
  navigateTo: (page: any, data?: any) => void;
  user: User | null;
  basketData?: any;
  saveCuratedBasket?: (basket: any) => void;
  updateCuratedBasket?: (basketId: string, updates: any) => void;
}

export function AdminBasketSettingsPage({ navigateTo, user, basketData, saveCuratedBasket, updateCuratedBasket }: AdminBasketSettingsPageProps) {
  const isEditMode = basketData?.isEditMode || false;
  const editingBasket = basketData?.editingBasket || null;

  // Pre-fill all fields with existing data or defaults
  const [minInvestment, setMinInvestment] = useState(editingBasket?.minInvestment || 10000);
  const [cagr1Y, setCAGR1Y] = useState(editingBasket?.cagr1Y?.toString() || '12.5');
  const [cagr3Y, setCAGR3Y] = useState(editingBasket?.cagr3Y?.toString() || '14.5');
  const [cagr5Y, setCAGR5Y] = useState(editingBasket?.cagr5Y?.toString() || '15.8');
  const [minSIPInvestment, setMinSIPInvestment] = useState(editingBasket?.minSIPInvestment || 5000);
  const [sharpeRatio, setSharpeRatio] = useState(editingBasket?.sharpeRatio?.toString() || '1.45');
  const [rationale, setRationale] = useState(editingBasket?.rationale || '');
  const [philosophy, setPhilosophy] = useState(editingBasket?.philosophy || '');
  const [suitableFor, setSuitableFor] = useState(editingBasket?.suitableFor || '');
  const [rebalancingFrequency, setRebalancingFrequency] = useState(editingBasket?.rebalancingFrequency || 'Quarterly');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // SIP Date States - Start and End Date (10 years tenure)
  const [sipStartDate, setSipStartDate] = useState(() => {
    if (editingBasket?.sipDateConfig?.startDate) {
      return editingBasket.sipDateConfig.startDate;
    }
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [sipEndDate, setSipEndDate] = useState(() => {
    if (editingBasket?.sipDateConfig?.endDate) {
      return editingBasket.sipDateConfig.endDate;
    }
    const today = new Date();
    const endDate = new Date(today.setFullYear(today.getFullYear() + 10));
    return endDate.toISOString().split('T')[0];
  });

  const selectedFunds = basketData?.selectedFunds || [];
  const minInvestmentValue = 5000;

  // Calculate end date (10 years from start date)
  const handleStartDateChange = (dateStr: string) => {
    setSipStartDate(dateStr);
    const startDate = new Date(dateStr);
    const endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 10));
    setSipEndDate(endDate.toISOString().split('T')[0]);
  };

  const handleSaveBasket = () => {
    if (minInvestment < minInvestmentValue) {
      setError(`Minimum investment must be at least ₹${minInvestmentValue.toLocaleString()}`);
      return;
    }

    if (minSIPInvestment < 5000) {
      setError('Minimum SIP investment must be at least ₹5,000');
      return;
    }

    if (!cagr1Y || !cagr3Y || !cagr5Y) {
      setError('Please fill in all CAGR values');
      return;
    }

    // Convert selected funds to proper format
    const formattedFunds = selectedFunds.map((fund: any) => ({
      id: fund.id,
      name: fund.name,
      allocation: fund.allocation,
      returns1Y: fund.cagr1Y,
      returns3Y: fund.cagr3Y,
      returns5Y: fund.cagr5Y,
      aum: `₹${fund.aum} Cr`,
      rating: fund.rating,
      expenseRatio: fund.expenseRatio,
      risk: fund.riskLevel === 'Low' ? 'Low' : fund.riskLevel === 'High' ? 'High' : 'Medium',
      category: fund.category === 'Large Cap' || fund.category === 'Mid Cap' || fund.category === 'Small Cap' ? 'Equity' : 
                fund.category === 'Hybrid' ? 'Hybrid' : 'Equity',
      fundHouse: fund.fundHouse,
      nav: fund.nav,
      sharpeRatio: fund.sharpeRatio,
      standardDeviation: fund.standardDeviation
    }));

    const newBasket = {
      id: isEditMode ? editingBasket.id : `BASKET_${Date.now()}`,
      name: basketData?.basketName || editingBasket?.name || 'New Basket',
      color: basketData?.basketColor || editingBasket?.color || '#2E89C4',
      description: basketData?.basketDescription || editingBasket?.description || '',
      ageRange: basketData?.ageRanges || editingBasket?.ageRange || [],
      riskLevel: basketData?.riskLevel || editingBasket?.riskLevel || 'Medium',
      minInvestment: minInvestment,
      minSIPInvestment: minSIPInvestment,
      sipDateConfig: {
        type: 'range',
        availableDates: [],
        startDate: sipStartDate,
        endDate: sipEndDate,
        specificDates: []
      },
      timeHorizon: basketData?.timeHorizons || editingBasket?.timeHorizon || [],
      goals: basketData?.investmentGoals || editingBasket?.goals || [],
      experienceLevel: basketData?.investorKnowledgeLevels || editingBasket?.experienceLevel || [],
      investmentCapacity: basketData?.investmentCapacities || editingBasket?.investmentCapacity || [],
      expectedReturns: basketData?.expectedReturnsOptions || editingBasket?.expectedReturns || [],
      cagr1Y: parseFloat(cagr1Y),
      cagr3Y: parseFloat(cagr3Y),
      cagr5Y: parseFloat(cagr5Y),
      funds: formattedFunds,
      rationale: rationale || 'Professionally curated basket for optimal returns',
      philosophy: philosophy || 'Diversified investment strategy',
      suitableFor: suitableFor || 'Investors seeking balanced growth',
      rebalancingFrequency: rebalancingFrequency,
      riskPercentage: basketData?.riskLevel === 'High' ? 75 : basketData?.riskLevel === 'Low' ? 25 : 50,
      sharpeRatio: parseFloat(sharpeRatio),
      volatility: 'Medium',
      createdAt: isEditMode ? editingBasket.createdAt : new Date().toISOString(),
      isActive: true
    };

    if (isEditMode && updateCuratedBasket) {
      updateCuratedBasket(editingBasket.id, newBasket);
    } else if (saveCuratedBasket) {
      saveCuratedBasket(newBasket);
    }

    setShowSuccess(true);
    setTimeout(() => {
      navigateTo('admin-basket-list');
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header navigateTo={navigateTo} user={user} showCart={false} cartCount={0} />
        
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#3BAF4A] to-[#2E89C4] rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-[#1B263B] mb-4">
              Basket {isEditMode ? 'Updated' : 'Created'} Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              The curated basket "{basketData?.basketName || editingBasket?.name}" has been {isEditMode ? 'updated' : 'created'} and is now available for users.
            </p>
            <div className="inline-block">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3BAF4A]"></div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Redirecting to Basket List...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigateTo={navigateTo} user={user} showCart={false} cartCount={0} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigateTo('admin-fund-allocation', basketData)}
          className="flex items-center space-x-2 text-[#2E89C4] hover:text-[#1B263B] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-[#1B263B] mb-2">Basket Settings & Performance</h1>
                <p className="text-gray-600">
                  Basket: <span className="text-[#2E89C4]">{basketData?.basketName}</span>
                </p>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#3BAF4A]">Step 4 of 5</span>
                  <span className="text-sm text-gray-500">Performance & Details</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-[#3BAF4A] to-[#2E89C4] h-2 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Form */}
              <div className="space-y-6">
                {/* Investment Settings */}
                <div className="border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-[#1B263B] mb-4">Investment Settings</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Minimum Investment (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={minInvestment}
                        onChange={(e) => {
                          setMinInvestment(parseFloat(e.target.value) || 0);
                          setError('');
                        }}
                        min={minInvestmentValue}
                        step={1000}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Rebalancing Frequency
                      </label>
                      <select
                        value={rebalancingFrequency}
                        onChange={(e) => setRebalancingFrequency(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Half-Yearly">Half-Yearly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Minimum SIP Investment (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={minSIPInvestment}
                        onChange={(e) => {
                          setMinSIPInvestment(parseFloat(e.target.value) || 5000);
                          setError('');
                        }}
                        min={5000}
                        step={500}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                        placeholder="Minimum ₹5,000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Sharpe Ratio
                      </label>
                      <input
                        type="number"
                        value={sharpeRatio}
                        onChange={(e) => setSharpeRatio(e.target.value)}
                        step={0.01}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* SIP Date Configuration */}
                <div className="border-2 border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Calendar className="w-5 h-5 text-[#2E89C4]" />
                    <h3 className="text-[#1B263B]">SIP Date Configuration</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Set the SIP start date. End date will be automatically set to 10 years from start date.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        SIP Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={sipStartDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Select when the SIP will begin
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        SIP End Date (Auto-calculated)
                      </label>
                      <input
                        type="date"
                        value={sipEndDate}
                        disabled
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Automatically set to 10 years from start date
                      </p>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-[#2E89C4]/5 to-[#3BAF4A]/5 border border-[#2E89C4]/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-[#2E89C4] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-[#1B263B] mb-2">
                          <span className="font-medium">SIP Duration Summary</span>
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Start Date:</p>
                            <p className="text-[#2E89C4]">
                              {new Date(sipStartDate).toLocaleDateString('en-IN', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">End Date:</p>
                            <p className="text-[#3BAF4A]">
                              {new Date(sipEndDate).toLocaleDateString('en-IN', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600">
                            Total SIP Duration: <span className="text-[#1B263B]">10 Years</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-[#1B263B] mb-4">Past Performance (CAGR %)</h3>
                  
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        1 Year CAGR <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={cagr1Y}
                        onChange={(e) => {
                          setCAGR1Y(e.target.value);
                          setError('');
                        }}
                        step={0.1}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                        placeholder="e.g., 12.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        3 Year CAGR <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={cagr3Y}
                        onChange={(e) => {
                          setCAGR3Y(e.target.value);
                          setError('');
                        }}
                        step={0.1}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                        placeholder="e.g., 14.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        5 Year CAGR <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={cagr5Y}
                        onChange={(e) => {
                          setCAGR5Y(e.target.value);
                          setError('');
                        }}
                        step={0.1}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                        placeholder="e.g., 15.8"
                      />
                    </div>
                  </div>
                </div>

                {/* Basket Details */}
                <div className="border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-[#1B263B] mb-4">Basket Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Investment Rationale
                      </label>
                      <textarea
                        value={rationale}
                        onChange={(e) => setRationale(e.target.value)}
                        placeholder="Explain the investment strategy and why this basket is suitable..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors resize-none"
                        rows={3}
                        maxLength={500}
                      />
                      <p className="text-xs text-gray-500 mt-1">{rationale.length}/500 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Investment Philosophy
                      </label>
                      <textarea
                        value={philosophy}
                        onChange={(e) => setPhilosophy(e.target.value)}
                        placeholder="Describe the overall philosophy behind this basket..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors resize-none"
                        rows={3}
                        maxLength={500}
                      />
                      <p className="text-xs text-gray-500 mt-1">{philosophy.length}/500 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Suitable For
                      </label>
                      <textarea
                        value={suitableFor}
                        onChange={(e) => setSuitableFor(e.target.value)}
                        placeholder="Describe the target investor profile..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors resize-none"
                        rows={2}
                        maxLength={300}
                      />
                      <p className="text-xs text-gray-500 mt-1">{suitableFor.length}/300 characters</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-[#1B263B] mb-6">Basket Summary</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Basket Name</p>
                  <p className="text-[#1B263B]">{basketData?.basketName}</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total Funds</p>
                  <p className="text-2xl text-[#2E89C4]">{selectedFunds.length}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Age Range</p>
                  <p className="text-[#1B263B]">{basketData?.ageRange}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                  <p className="text-[#1B263B]">{basketData?.riskLevel}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Time Horizon</p>
                  <p className="text-sm text-[#1B263B]">{basketData?.timeHorizon}</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Min. Investment</p>
                  <p className="text-2xl text-[#3BAF4A]">₹{minInvestment.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Min. SIP Investment</p>
                  <p className="text-xl text-[#2E89C4]">₹{minSIPInvestment.toLocaleString()}</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Expected Returns</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">1Y:</span>
                      <span className="text-[#3BAF4A]">{cagr1Y}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">3Y:</span>
                      <span className="text-[#3BAF4A]">{cagr3Y}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">5Y:</span>
                      <span className="text-[#3BAF4A]">{cagr5Y}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveBasket}
                  className="w-full py-3 bg-[#3BAF4A] hover:bg-[#329940] text-white rounded-lg transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Save & Publish Basket</span>
                </button>

                <button
                  onClick={() => navigateTo('admin-dashboard')}
                  className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}