import { Header } from './Header';
import { User } from '../App';
import { ArrowLeft, Check, PieChart, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface BasketInvestmentAmountPageProps {
  navigateTo: (page: any, data?: any) => void;
  user: User | null;
  basketData?: any;
  saveBasket?: (basket: any) => void;
}

export function BasketInvestmentAmountPage({ navigateTo, user, basketData, saveBasket }: BasketInvestmentAmountPageProps) {
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedFunds = basketData?.selectedFunds || [];
  const minInvestment = 5000;

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    setInvestmentAmount(amount);
    
    if (amount < minInvestment) {
      setError(`Minimum investment is ₹${minInvestment.toLocaleString()}`);
    } else {
      setError('');
    }
  };

  const handleSaveBasket = () => {
    if (investmentAmount < minInvestment) {
      setError(`Minimum investment is ₹${minInvestment.toLocaleString()}`);
      return;
    }

    const newBasket = {
      id: `CUSTOM_${Date.now()}`,
      name: basketData?.basketName || 'My Custom Basket',
      description: basketData?.basketDescription || 'Custom basket created by user',
      color: '#2E89C4',
      minInvestment: investmentAmount,
      cagr3Y: calculateWeightedCAGR(selectedFunds, 3),
      cagr5Y: calculateWeightedCAGR(selectedFunds, 5),
      volatility: 'Moderate',
      riskLevel: calculateRiskLevel(selectedFunds),
      funds: selectedFunds.map((fund: any) => ({
        id: fund.id,
        name: fund.name,
        allocation: fund.allocation,
        category: fund.category,
        fundHouse: fund.fundHouse,
        aum: fund.aum,
        expenseRatio: fund.expenseRatio,
        exitLoad: '1% (if redeemed within 1 year)',
        minInvestment: 1000,
        cagr3Y: fund.cagr3Y,
        cagr5Y: fund.cagr3Y * 1.05,
        rating: 4
      })),
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    if (saveBasket) {
      saveBasket(newBasket);
    }

    setShowSuccess(true);
    setTimeout(() => {
      navigateTo('my-baskets');
    }, 2000);
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

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={0} />
        
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#3BAF4A] to-[#2E89C4] rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-[#1B263B] mb-4">Basket Created Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your custom basket "{basketData?.basketName}" has been created and saved.
            </p>
            <div className="inline-block">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3BAF4A]"></div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Redirecting to My Baskets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={0} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigateTo('fund-allocation', basketData)}
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
                <h1 className="text-[#1B263B] mb-2">Set Investment Amount</h1>
                <p className="text-gray-600">
                  Basket: <span className="text-[#2E89C4]">{basketData?.basketName}</span>
                </p>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#3BAF4A]">Step 4 of 4</span>
                  <span className="text-sm text-gray-500">Investment Amount</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-[#3BAF4A] to-[#2E89C4] h-2 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              {/* Investment Amount Input */}
              <div className="mb-8">
                <label className="block text-sm text-gray-700 mb-3">
                  Minimum Investment Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400">₹</span>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    min={minInvestment}
                    step={1000}
                    className={`w-full pl-12 pr-4 py-4 text-2xl border-2 rounded-lg focus:outline-none transition-colors ${
                      error 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:border-[#2E89C4]'
                    }`}
                    placeholder="Enter amount"
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Minimum investment: ₹{minInvestment.toLocaleString()}
                </p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="mb-8">
                <p className="text-sm text-gray-600 mb-3">Quick Select</p>
                <div className="grid grid-cols-4 gap-3">
                  {[5000, 10000, 25000, 50000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => {
                        setInvestmentAmount(amount);
                        setError('');
                      }}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        investmentAmount === amount
                          ? 'border-[#3BAF4A] bg-[#3BAF4A]/10 text-[#3BAF4A]'
                          : 'border-gray-200 text-gray-700 hover:border-[#2E89C4]'
                      }`}
                    >
                      ₹{(amount / 1000)}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Fund Allocation Preview */}
              {investmentAmount >= minInvestment && (
                <div className="border-2 border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <PieChart className="w-5 h-5 text-[#2E89C4]" />
                    <h3 className="text-[#1B263B]">Investment Distribution</h3>
                  </div>

                  <div className="space-y-3">
                    {selectedFunds.map((fund: any) => {
                      const fundAmount = (investmentAmount * fund.allocation) / 100;
                      
                      return (
                        <div key={fund.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="text-sm text-[#1B263B] mb-1">{fund.name}</p>
                              <p className="text-xs text-gray-500">{fund.category}</p>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-sm text-[#2E89C4]">{fund.allocation}%</p>
                              <p className="text-lg text-[#3BAF4A]">₹{fundAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-gradient-to-r from-[#3BAF4A] to-[#2E89C4] h-2 rounded-full"
                              style={{ width: `${fund.allocation}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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

                {basketData?.basketDescription && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Description</p>
                    <p className="text-sm text-gray-700">{basketData?.basketDescription}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total Funds</p>
                  <p className="text-2xl text-[#2E89C4]">{selectedFunds.length}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                  <p className="text-[#1B263B]">{calculateRiskLevel(selectedFunds)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Expected 3Y CAGR</p>
                  <p className="text-[#3BAF4A]">{calculateWeightedCAGR(selectedFunds, 3)}%</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Minimum Investment</p>
                  <p className="text-2xl text-[#3BAF4A]">₹{investmentAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveBasket}
                  disabled={investmentAmount < minInvestment}
                  className={`w-full py-3 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                    investmentAmount >= minInvestment
                      ? 'bg-[#3BAF4A] hover:bg-[#329940] text-white shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-5 h-5" />
                  <span>Save Basket</span>
                </button>

                <button
                  onClick={() => navigateTo('dashboard')}
                  className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-blue-800">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    After saving, you can invest in this basket anytime from "My Baskets"
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
