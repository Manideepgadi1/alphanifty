import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Download, RefreshCw } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface YearlyData {
  year: number;
  invested: number;
  value: number;
  returns: number;
}

export function SIPCalculatorComponent() {
  const [sipAmount, setSipAmount] = useState(10000);
  const [frequency, setFrequency] = useState<12 | 4 | 2 | 1>(12);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [stepUpType, setStepUpType] = useState<'none' | 'amount' | 'percent'>('none');
  const [stepUpAmount, setStepUpAmount] = useState(1000);
  const [stepUpPercent, setStepUpPercent] = useState(10);

  const results = useMemo(() => {
    const ratePerPeriod = rate / 100 / frequency;
    const totalPeriods = years * frequency;
    
    let currentSIP = sipAmount;
    let invested = 0;
    let maturity = 0;
    let investedYearly = 0;
    let yearCounter = 1;
    
    const yearlyData: YearlyData[] = [];
    
    for (let i = 1; i <= totalPeriods; i++) {
      maturity = (maturity + currentSIP) * (1 + ratePerPeriod);
      invested += currentSIP;
      investedYearly += currentSIP;
      
      if (i % frequency === 0) {
        yearlyData.push({
          year: yearCounter,
          invested: Math.round(invested),
          value: Math.round(maturity),
          returns: Math.round(maturity - invested)
        });
        
        yearCounter++;
        investedYearly = 0;
        
        if (stepUpType === 'amount') {
          currentSIP += stepUpAmount;
        } else if (stepUpType === 'percent') {
          currentSIP += currentSIP * (stepUpPercent / 100);
        }
      }
    }
    
    return {
      corpus: Math.round(maturity),
      totalInvested: Math.round(invested),
      totalReturns: Math.round(maturity - invested),
      yearlyData
    };
  }, [sipAmount, frequency, rate, years, stepUpType, stepUpAmount, stepUpPercent]);

  const chartData = useMemo(() => ({
    labels: results.yearlyData.map(d => `Year ${d.year}`),
    datasets: [
      {
        label: 'Total Invested',
        data: results.yearlyData.map(d => d.invested),
        borderColor: '#2E89C4',
        backgroundColor: 'rgba(46, 137, 196, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Portfolio Value',
        data: results.yearlyData.map(d => d.value),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }), [results.yearlyData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString('en-IN')}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `₹${(value / 100000).toFixed(1)}L`
        }
      }
    }
  };

  const handleReset = () => {
    setSipAmount(10000);
    setFrequency(12);
    setRate(12);
    setYears(10);
    setStepUpType('none');
    setStepUpAmount(1000);
    setStepUpPercent(10);
  };

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calculator Inputs */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <Calculator className="w-6 h-6 text-[#2E89C4]" />
          <h3 className="text-xl font-bold text-gray-800">SIP Calculator</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              SIP Amount (₹)
            </label>
            <input
              type="number"
              value={sipAmount}
              onChange={(e) => setSipAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
              min="500"
              step="500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contribution Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value) as 12 | 4 | 2 | 1)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
            >
              <option value="12">Monthly</option>
              <option value="4">Quarterly</option>
              <option value="2">Half-Yearly</option>
              <option value="1">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expected Annual Return (%)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
              min="1"
              max="30"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Investment Period (Years)
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
              min="1"
              max="40"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Step-Up Type
            </label>
            <select
              value={stepUpType}
              onChange={(e) => setStepUpType(e.target.value as 'none' | 'amount' | 'percent')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
            >
              <option value="none">No Step-Up</option>
              <option value="amount">Amount (₹)</option>
              <option value="percent">Percentage (%)</option>
            </select>
          </div>

          {stepUpType === 'amount' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Annual Step-Up Amount (₹)
              </label>
              <input
                type="number"
                value={stepUpAmount}
                onChange={(e) => setStepUpAmount(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
                min="0"
                step="500"
              />
            </div>
          )}

          {stepUpType === 'percent' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Annual Step-Up Percentage (%)
              </label>
              <input
                type="number"
                value={stepUpPercent}
                onChange={(e) => setStepUpPercent(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
                min="0"
                max="50"
                step="1"
              />
            </div>
          )}

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-[#2E89C4] text-[#2E89C4] rounded-lg hover:bg-[#2E89C4] hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Results Summary */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-[#2E89C4]">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Expected Corpus:</span>
              <span className="text-lg font-bold text-[#2E89C4]">{formatCurrency(results.corpus)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Total Invested:</span>
              <span className="text-lg font-bold text-gray-800">{formatCurrency(results.totalInvested)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Total Returns:</span>
              <span className="text-lg font-bold text-green-600">{formatCurrency(results.totalReturns)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart and Table */}
      <div className="space-y-6">
        {/* Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Yearly Growth</h3>
              <p className="text-sm text-gray-500">Investment vs Portfolio Value</p>
            </div>
          </div>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Yearly Breakdown Table */}
        <div className="bg-white rounded-xl p-6 shadow-lg overflow-hidden">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Yearly Breakdown</h3>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Year</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Invested</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Value</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Returns</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.yearlyData.map((data) => (
                  <tr key={data.year} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">Year {data.year}</td>
                    <td className="px-4 py-3 text-right text-gray-800">{formatCurrency(data.invested)}</td>
                    <td className="px-4 py-3 text-right text-[#2E89C4] font-semibold">{formatCurrency(data.value)}</td>
                    <td className="px-4 py-3 text-right text-green-600 font-semibold">{formatCurrency(data.returns)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
