import { useState, useMemo } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { Line } from 'react-chartjs-2';

interface YearlyData {
  year: number;
  invested: number;
  value: number;
  returns: number;
}

export function LumpsumCalculatorComponent() {
  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const results = useMemo(() => {
    const P = lumpsumAmount;
    const r = rate / 100;
    let maturity = P;
    
    const yearlyData: YearlyData[] = [];
    
    for (let y = 1; y <= years; y++) {
      maturity *= (1 + r);
      yearlyData.push({
        year: y,
        invested: P,
        value: Math.round(maturity),
        returns: Math.round(maturity - P)
      });
    }
    
    return {
      corpus: Math.round(maturity),
      totalInvested: P,
      totalReturns: Math.round(maturity - P),
      yearlyData
    };
  }, [lumpsumAmount, rate, years]);

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
          callback: (value: any) => {
            if (value >= 100000) {
              return `₹${(value / 100000).toFixed(1)}L`;
            }
            return `₹${(value / 1000).toFixed(0)}K`;
          }
        }
      }
    }
  };

  const handleReset = () => {
    setLumpsumAmount(100000);
    setRate(12);
    setYears(10);
  };

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calculator Inputs */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-6 h-6 text-[#2E89C4]" />
          <h3 className="text-xl font-bold text-gray-800">Lumpsum Calculator</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Investment Amount (₹)
            </label>
            <input
              type="number"
              value={lumpsumAmount}
              onChange={(e) => setLumpsumAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
              min="1000"
              step="1000"
            />
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
              Investment Duration (Years)
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

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> This calculator provides estimates based on assumed returns. 
            Actual returns may vary based on market conditions.
          </p>
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
