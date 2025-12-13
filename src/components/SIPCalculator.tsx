import { useState } from 'react';
import { Calculator, TrendingUp, Target, DollarSign } from 'lucide-react';

interface SIPCalculatorProps {
  onClose: () => void;
}

export function SIPCalculator({ onClose }: SIPCalculatorProps) {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(10);

  // Calculate SIP returns
  const calculateSIP = () => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    const futureValue = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
      (1 + monthlyRate);
    
    const totalInvestment = monthlyInvestment * months;
    const returns = futureValue - totalInvestment;
    
    return {
      futureValue: Math.round(futureValue),
      totalInvestment: Math.round(totalInvestment),
      returns: Math.round(returns)
    };
  };

  const results = calculateSIP();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#2E89C4] to-[#1B6EA1] text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">SIP Calculator</h2>
                <p className="text-blue-100 text-sm">Plan your systematic investment</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Input Fields */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Investment Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                  min="500"
                  step="500"
                />
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹500</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expected Return Rate (% per annum)
              </label>
              <input
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                min="1"
                max="30"
                step="0.5"
              />
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Time Period (Years)
              </label>
              <input
                type="number"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2E89C4] focus:outline-none"
                min="1"
                max="40"
              />
              <input
                type="range"
                min="1"
                max="40"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 year</span>
                <span>40 years</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Investment Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Total Investment</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{results.totalInvestment.toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">Est. Returns</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  ₹{results.returns.toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-600">Future Value</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{results.futureValue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Investment Breakdown</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-blue-500 h-4 float-left"
                  style={{ width: `${(results.totalInvestment / results.futureValue) * 100}%` }}
                />
                <div 
                  className="bg-green-500 h-4 float-left"
                  style={{ width: `${(results.returns / results.futureValue) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
                  <span className="text-gray-600">
                    Principal: {((results.totalInvestment / results.futureValue) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                  <span className="text-gray-600">
                    Returns: {((results.returns / results.futureValue) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> This calculation is for illustration purposes only. Actual returns may vary based on market conditions and fund performance. Past performance is not indicative of future results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
