import { Header } from './Header';
import { User } from '../App';
import { ArrowLeft, ArrowRight, AlertCircle, PieChart as PieChartIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FundAllocationPageProps {
  navigateTo: (page: any, data?: any) => void;
  user: User | null;
  basketData?: any;
}

export function FundAllocationPage({ navigateTo, user, basketData }: FundAllocationPageProps) {
  const selectedFunds = basketData?.selectedFunds || [];
  const [allocations, setAllocations] = useState<{ [key: string]: number }>(
    selectedFunds.reduce((acc: any, fund: any) => {
      acc[fund.id] = Math.floor(100 / selectedFunds.length);
      return acc;
    }, {})
  );

  // Auto-distribute remaining allocation
  useEffect(() => {
    const total = Object.values(allocations).reduce((sum: number, val: any) => sum + val, 0);
    if (total < 100 && selectedFunds.length > 0) {
      const diff = 100 - total;
      const firstFundId = selectedFunds[0].id;
      setAllocations(prev => ({
        ...prev,
        [firstFundId]: (prev[firstFundId] || 0) + diff
      }));
    }
  }, []);

  const handleAllocationChange = (fundId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(100, numValue));
    
    setAllocations(prev => ({
      ...prev,
      [fundId]: clampedValue
    }));
  };

  const handleSliderChange = (fundId: string, value: number) => {
    setAllocations(prev => ({
      ...prev,
      [fundId]: value
    }));
  };

  const totalAllocation = Object.values(allocations).reduce((sum: number, val: any) => sum + val, 0);
  const isValid = totalAllocation === 100;

  const handleEqualDistribution = () => {
    const equalShare = Math.floor(100 / selectedFunds.length);
    const remainder = 100 - (equalShare * selectedFunds.length);
    
    const newAllocations = selectedFunds.reduce((acc: any, fund: any, index: number) => {
      acc[fund.id] = equalShare + (index === 0 ? remainder : 0);
      return acc;
    }, {});
    
    setAllocations(newAllocations);
  };

  const handleNext = () => {
    if (!isValid) {
      alert('Total allocation must equal 100%');
      return;
    }

    const fundsWithAllocation = selectedFunds.map((fund: any) => ({
      ...fund,
      allocation: allocations[fund.id]
    }));

    navigateTo('basket-investment-amount', {
      ...basketData,
      selectedFunds: fundsWithAllocation
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={0} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigateTo('fund-selection', basketData)}
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
                <h1 className="text-[#1B263B] mb-2">Set Fund Proportions</h1>
                <p className="text-gray-600">
                  Basket: <span className="text-[#2E89C4]">{basketData?.basketName}</span>
                </p>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#3BAF4A]">Step 3 of 4</span>
                  <span className="text-sm text-gray-500">Fund Allocation</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-[#3BAF4A] to-[#2E89C4] h-2 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              {/* Equal Distribution Button */}
              <div className="mb-6">
                <button
                  onClick={handleEqualDistribution}
                  className="px-4 py-2 border-2 border-[#2E89C4] text-[#2E89C4] rounded-lg hover:bg-[#2E89C4] hover:text-white transition-all"
                >
                  Distribute Equally
                </button>
              </div>

              {/* Fund Allocation List */}
              <div className="space-y-4">
                {selectedFunds.map((fund: any, index: number) => (
                  <div key={fund.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#2E89C4]/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-[#1B263B] mb-1">{fund.name}</h4>
                        <p className="text-sm text-gray-600">{fund.category} • {fund.fundHouse}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="number"
                          value={allocations[fund.id] || 0}
                          onChange={(e) => handleAllocationChange(fund.id, e.target.value)}
                          min={0}
                          max={100}
                          className="w-20 px-3 py-2 text-lg text-center border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
                        />
                        <span className="text-lg text-[#1B263B]">%</span>
                      </div>
                    </div>

                    {/* Slider */}
                    <div className="relative">
                      <input
                        type="range"
                        value={allocations[fund.id] || 0}
                        onChange={(e) => handleSliderChange(fund.id, parseInt(e.target.value))}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #3BAF4A 0%, #2E89C4 ${allocations[fund.id]}%, #E5E7EB ${allocations[fund.id]}%, #E5E7EB 100%)`
                        }}
                      />
                    </div>

                    {/* Fund Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">3Y CAGR</p>
                        <p className="text-sm text-[#3BAF4A]">{fund.cagr3Y}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Risk</p>
                        <p className="text-sm text-[#1B263B]">{fund.riskLevel}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Expense Ratio</p>
                        <p className="text-sm text-[#1B263B]">{fund.expenseRatio}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Allocation Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <PieChartIcon className="w-5 h-5 text-[#2E89C4]" />
                <h3 className="text-[#1B263B]">Allocation Summary</h3>
              </div>

              {/* Total Allocation Progress */}
              <div className="mb-6">
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
                {!isValid && (
                  <div className={`mt-3 p-3 rounded-lg ${
                    totalAllocation > 100 
                      ? 'bg-red-50 border border-red-200' 
                      : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <p className={`text-xs flex items-center ${
                      totalAllocation > 100 ? 'text-red-800' : 'text-yellow-800'
                    }`}>
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {totalAllocation > 100 
                        ? `Reduce by ${totalAllocation - 100}%` 
                        : `Add ${100 - totalAllocation}% more`}
                    </p>
                  </div>
                )}
                {isValid && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-800 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Perfect! Ready to proceed
                    </p>
                  </div>
                )}
              </div>

              {/* Fund Breakdown */}
              <div className="space-y-2 mb-6">
                <h4 className="text-sm text-gray-600 mb-3">Fund Breakdown</h4>
                {selectedFunds.map((fund: any) => (
                  <div key={fund.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 truncate flex-1 mr-2">{fund.name}</span>
                    <span className="text-[#2E89C4] font-medium">{allocations[fund.id] || 0}%</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleNext}
                  disabled={!isValid}
                  className={`w-full py-3 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                    isValid
                      ? 'bg-[#3BAF4A] hover:bg-[#329940] text-white shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>Next: Investment Amount</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3BAF4A;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3BAF4A;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
