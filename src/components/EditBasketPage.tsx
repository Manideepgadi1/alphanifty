import { Header } from './Header';
import { User } from '../App';
import { ArrowLeft, Save, Edit2, Plus, Trash2, PieChart, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface EditBasketPageProps {
  navigateTo: (page: any, data?: any) => void;
  user: User | null;
  basketData?: any;
  updateBasket?: (basketId: string, updates: any) => void;
}

export function EditBasketPage({ navigateTo, user, basketData, updateBasket }: EditBasketPageProps) {
  const basket = basketData?.basket;
  
  const [basketName, setBasketName] = useState(basket?.name || '');
  const [basketDescription, setBasketDescription] = useState(basket?.description || '');
  const [minInvestment, setMinInvestment] = useState(basket?.minInvestment || 10000);
  const [funds, setFunds] = useState(basket?.funds || []);
  const [allocations, setAllocations] = useState<{ [key: string]: number }>(
    basket?.funds.reduce((acc: any, fund: any) => {
      acc[fund.id] = fund.allocation;
      return acc;
    }, {}) || {}
  );
  const [activeTab, setActiveTab] = useState<'details' | 'funds' | 'allocation'>('details');
  const [error, setError] = useState('');

  const totalAllocation = Object.values(allocations).reduce((sum: number, val: any) => sum + val, 0);
  const isAllocationValid = totalAllocation === 100;

  const handleAllocationChange = (fundId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(100, numValue));
    
    setAllocations(prev => ({
      ...prev,
      [fundId]: clampedValue
    }));
  };

  const handleRemoveFund = (fundId: string) => {
    if (funds.length <= 3) {
      alert('A basket must have at least 3 funds');
      return;
    }

    if (window.confirm('Are you sure you want to remove this fund?')) {
      const newFunds = funds.filter((f: any) => f.id !== fundId);
      setFunds(newFunds);
      
      const newAllocations = { ...allocations };
      delete newAllocations[fundId];
      setAllocations(newAllocations);
    }
  };

  const handleEqualDistribution = () => {
    const equalShare = Math.floor(100 / funds.length);
    const remainder = 100 - (equalShare * funds.length);
    
    const newAllocations = funds.reduce((acc: any, fund: any, index: number) => {
      acc[fund.id] = equalShare + (index === 0 ? remainder : 0);
      return acc;
    }, {});
    
    setAllocations(newAllocations);
  };

  const handleSaveChanges = () => {
    if (!basketName.trim()) {
      setError('Basket name is required');
      setActiveTab('details');
      return;
    }

    if (funds.length < 3) {
      setError('Basket must have at least 3 funds');
      setActiveTab('funds');
      return;
    }

    if (!isAllocationValid) {
      setError('Total allocation must equal 100%');
      setActiveTab('allocation');
      return;
    }

    const updatedFunds = funds.map((fund: any) => ({
      ...fund,
      allocation: allocations[fund.id]
    }));

    const updates = {
      name: basketName,
      description: basketDescription,
      minInvestment: minInvestment,
      funds: updatedFunds,
      cagr3Y: calculateWeightedCAGR(updatedFunds, 3),
      cagr5Y: calculateWeightedCAGR(updatedFunds, 5),
      riskLevel: calculateRiskLevel(updatedFunds)
    };

    if (updateBasket) {
      updateBasket(basket.id, updates);
    }

    navigateTo('my-baskets');
  };

  const calculateWeightedCAGR = (funds: any[], years: number) => {
    return funds.reduce((sum: number, fund: any) => {
      return sum + (fund.cagr3Y * fund.allocation / 100);
    }, 0).toFixed(2);
  };

  const calculateRiskLevel = (funds: any[]) => {
    const riskScores: any = {
      'Moderate': 1,
      'Moderate-High': 2,
      'High': 3
    };
    
    const avgRiskScore = funds.reduce((sum: number, fund: any) => {
      return sum + (riskScores[fund.riskLevel] || 1) * (fund.allocation / 100);
    }, 0);

    if (avgRiskScore < 1.5) return 'Moderate';
    if (avgRiskScore < 2.5) return 'Moderate-High';
    return 'High';
  };

  if (!basket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={0} />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Basket not found</p>
          <button
            onClick={() => navigateTo('my-baskets')}
            className="mt-4 text-[#2E89C4] hover:text-[#1B263B]"
          >
            Back to My Baskets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={0} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigateTo('my-baskets')}
          className="flex items-center space-x-2 text-[#2E89C4] hover:text-[#1B263B] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to My Baskets</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#3BAF4A] to-[#2E89C4] rounded-lg flex items-center justify-center">
                    <Edit2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-[#1B263B]">Edit Basket</h1>
                    <p className="text-sm text-gray-600">Modify your basket configuration</p>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 px-6 py-4 transition-colors ${
                    activeTab === 'details'
                      ? 'border-b-2 border-[#2E89C4] text-[#2E89C4] bg-[#2E89C4]/5'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Basket Details
                </button>
                <button
                  onClick={() => setActiveTab('funds')}
                  className={`flex-1 px-6 py-4 transition-colors ${
                    activeTab === 'funds'
                      ? 'border-b-2 border-[#2E89C4] text-[#2E89C4] bg-[#2E89C4]/5'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Manage Funds
                </button>
                <button
                  onClick={() => setActiveTab('allocation')}
                  className={`flex-1 px-6 py-4 transition-colors ${
                    activeTab === 'allocation'
                      ? 'border-b-2 border-[#2E89C4] text-[#2E89C4] bg-[#2E89C4]/5'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Fund Allocation
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Basket Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={basketName}
                        onChange={(e) => {
                          setBasketName(e.target.value);
                          setError('');
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                        maxLength={50}
                      />
                      <p className="text-xs text-gray-500 mt-1">{basketName.length}/50 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={basketDescription}
                        onChange={(e) => setBasketDescription(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors resize-none"
                        rows={4}
                        maxLength={200}
                      />
                      <p className="text-xs text-gray-500 mt-1">{basketDescription.length}/200 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Minimum Investment Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={minInvestment}
                        onChange={(e) => setMinInvestment(parseFloat(e.target.value) || 0)}
                        min={5000}
                        step={1000}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Funds Tab */}
                {activeTab === 'funds' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[#1B263B]">Funds in Basket ({funds.length})</h3>
                      <button
                        onClick={() => {
                          // Navigate to add more funds
                          alert('Add Funds feature - would navigate to fund selection');
                        }}
                        className="px-4 py-2 bg-[#2E89C4] text-white rounded-lg hover:bg-[#2576a8] transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Funds</span>
                      </button>
                    </div>

                    {funds.map((fund: any) => (
                      <div key={fund.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#2E89C4]/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-[#1B263B] mb-1">{fund.name}</h4>
                            <p className="text-sm text-gray-600 mb-3">{fund.category} • {fund.fundHouse}</p>
                            
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-gray-500">Allocation</p>
                                <p className="text-sm text-[#2E89C4]">{allocations[fund.id] || 0}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">3Y CAGR</p>
                                <p className="text-sm text-[#3BAF4A]">{fund.cagr3Y}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Risk</p>
                                <p className="text-sm text-[#1B263B]">{fund.riskLevel}</p>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveFund(fund.id)}
                            className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            disabled={funds.length <= 3}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {funds.length <= 3 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                          A basket must have at least 3 funds. You cannot remove more funds.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Allocation Tab */}
                {activeTab === 'allocation' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[#1B263B] mb-1">Adjust Fund Proportions</h3>
                        <p className="text-sm text-gray-600">Total must equal 100%</p>
                      </div>
                      <button
                        onClick={handleEqualDistribution}
                        className="px-4 py-2 border-2 border-[#2E89C4] text-[#2E89C4] rounded-lg hover:bg-[#2E89C4] hover:text-white transition-all"
                      >
                        Equal Distribution
                      </button>
                    </div>

                    {/* Allocation Progress */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Total Allocation</span>
                        <span className={`text-2xl ${
                          totalAllocation === 100 
                            ? 'text-[#3BAF4A]' 
                            : totalAllocation > 100 
                              ? 'text-red-500' 
                              : 'text-[#E8C23A]'
                        }`}>
                          {totalAllocation}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            totalAllocation === 100 
                              ? 'bg-gradient-to-r from-[#3BAF4A] to-[#2E89C4]' 
                              : totalAllocation > 100 
                                ? 'bg-red-500' 
                                : 'bg-[#E8C23A]'
                          }`}
                          style={{ width: `${Math.min(totalAllocation, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Fund Allocations */}
                    <div className="space-y-4">
                      {funds.map((fund: any) => (
                        <div key={fund.id} className="border-2 border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="text-[#1B263B] mb-1">{fund.name}</h4>
                              <p className="text-sm text-gray-600">{fund.category}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <input
                                type="number"
                                value={allocations[fund.id] || 0}
                                onChange={(e) => handleAllocationChange(fund.id, e.target.value)}
                                min={0}
                                max={100}
                                className="w-20 px-3 py-2 text-lg text-center border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4]"
                              />
                              <span className="text-lg text-[#1B263B]">%</span>
                            </div>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-[#3BAF4A] to-[#2E89C4] h-2 rounded-full transition-all"
                              style={{ width: `${allocations[fund.id] || 0}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-[#1B263B] mb-6">Basket Preview</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Basket Name</p>
                  <p className="text-[#1B263B]">{basketName || 'Unnamed Basket'}</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total Funds</p>
                  <p className="text-2xl text-[#2E89C4]">{funds.length}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Allocation Status</p>
                  <p className={`text-lg ${isAllocationValid ? 'text-[#3BAF4A]' : 'text-red-500'}`}>
                    {isAllocationValid ? '✓ Valid' : `${totalAllocation}% (Need 100%)`}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                  <p className="text-[#1B263B]">{calculateRiskLevel(funds)}</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Min. Investment</p>
                  <p className="text-2xl text-[#3BAF4A]">₹{minInvestment.toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={handleSaveChanges}
                className="w-full bg-[#3BAF4A] hover:bg-[#329940] text-white py-3 rounded-lg transition-all shadow-lg flex items-center justify-center space-x-2 mb-3"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>

              <button
                onClick={() => navigateTo('my-baskets')}
                className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-lg hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-blue-800">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    Changes will be saved to your basket configuration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
