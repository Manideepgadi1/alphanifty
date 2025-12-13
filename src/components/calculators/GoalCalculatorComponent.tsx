import { useState, useMemo } from 'react';
import { Target, Plus, Trash2, RefreshCw } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  year: number;
  currentCost: number;
  inflationRate: number;
  expectedReturn: number;
  sipGrowthRate: number;
  lumpsumToday: number;
}

interface GoalResult {
  futureCost: number;
  lumpsumFutureValue: number;
  requiredMonthlySIP: number;
}

export function GoalCalculatorComponent() {
  const currentYear = new Date().getFullYear();
  
  const [goalName, setGoalName] = useState('Education');
  const [goalYear, setGoalYear] = useState(currentYear + 10);
  const [currentCost, setCurrentCost] = useState(50);
  const [inflationRate, setInflationRate] = useState(6);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [sipGrowthRate, setSipGrowthRate] = useState(10);
  const [lumpsumToday, setLumpsumToday] = useState(100000);
  
  const [goals, setGoals] = useState<Goal[]>([]);

  const calculateGoal = (goal: Goal): GoalResult => {
    const yearsToGoal = goal.year - currentYear;
    
    // Future cost with inflation
    const futureCost = goal.currentCost * 100000 * Math.pow(1 + goal.inflationRate / 100, yearsToGoal);
    
    // Lumpsum future value
    const lumpsumFutureValue = goal.lumpsumToday * Math.pow(1 + goal.expectedReturn / 100, yearsToGoal);
    
    // Amount needed from SIP
    const amountNeededFromSIP = Math.max(0, futureCost - lumpsumFutureValue);
    
    // Calculate required SIP with step-up
    let requiredMonthlySIP = 0;
    if (amountNeededFromSIP > 0 && yearsToGoal > 0) {
      const monthlyRate = goal.expectedReturn / 100 / 12;
      const annualGrowthRate = goal.sipGrowthRate / 100;
      const months = yearsToGoal * 12;
      
      // Approximate SIP calculation with annual step-up
      let totalFV = 0;
      let testSIP = 1000;
      let iterations = 0;
      const maxIterations = 100;
      
      while (Math.abs(totalFV - amountNeededFromSIP) > 1000 && iterations < maxIterations) {
        totalFV = 0;
        let currentSIP = testSIP;
        
        for (let year = 1; year <= yearsToGoal; year++) {
          for (let month = 1; month <= 12; month++) {
            const remainingMonths = months - ((year - 1) * 12 + month - 1);
            const fv = currentSIP * Math.pow(1 + monthlyRate, remainingMonths);
            totalFV += fv;
          }
          currentSIP *= (1 + annualGrowthRate);
        }
        
        if (totalFV < amountNeededFromSIP) {
          testSIP *= 1.1;
        } else {
          testSIP *= 0.95;
        }
        iterations++;
      }
      
      requiredMonthlySIP = Math.ceil(testSIP / 100) * 100;
    }
    
    return {
      futureCost: Math.round(futureCost),
      lumpsumFutureValue: Math.round(lumpsumFutureValue),
      requiredMonthlySIP
    };
  };

  const currentGoalResult = useMemo(() => {
    const tempGoal: Goal = {
      id: 'temp',
      name: goalName,
      year: goalYear,
      currentCost,
      inflationRate,
      expectedReturn,
      sipGrowthRate,
      lumpsumToday
    };
    return calculateGoal(tempGoal);
  }, [goalName, goalYear, currentCost, inflationRate, expectedReturn, sipGrowthRate, lumpsumToday]);

  const handleAddGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: goalName,
      year: goalYear,
      currentCost,
      inflationRate,
      expectedReturn,
      sipGrowthRate,
      lumpsumToday
    };
    setGoals([...goals, newGoal]);
    handleReset();
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleReset = () => {
    setGoalName('');
    setGoalYear(currentYear + 10);
    setCurrentCost(50);
    setInflationRate(6);
    setExpectedReturn(12);
    setSipGrowthRate(10);
    setLumpsumToday(100000);
  };

  const totalMonthlySIP = goals.reduce((sum, goal) => {
    const result = calculateGoal(goal);
    return sum + result.requiredMonthlySIP;
  }, 0);

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Calculator Inputs */}
      <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="w-6 h-6 text-[#2E89C4]" />
          <h3 className="text-xl font-bold text-gray-800">Goal Calculator</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Goal Name
            </label>
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
              placeholder="e.g., Child Education, Dream Home"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Goal Year
            </label>
            <input
              type="number"
              value={goalYear}
              onChange={(e) => setGoalYear(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
              min={currentYear + 1}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Cost (₹ in lakhs)
            </label>
            <input
              type="number"
              value={currentCost}
              onChange={(e) => setCurrentCost(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
              min="0.1"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Inflation Rate (%)
            </label>
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
              min="0"
              max="20"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expected Annual Return (%)
            </label>
            <input
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
              min="1"
              max="30"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              SIP Growth Rate (Annual %)
            </label>
            <input
              type="number"
              value={sipGrowthRate}
              onChange={(e) => setSipGrowthRate(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
              min="0"
              max="50"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lumpsum Invested Today (₹)
            </label>
            <input
              type="number"
              value={lumpsumToday}
              onChange={(e) => setLumpsumToday(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
              min="0"
              step="10000"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleAddGoal}
              disabled={!goalName}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-[#2E89C4] text-white rounded-lg hover:bg-[#2670a8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add Goal</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center px-4 py-2 border border-[#2E89C4] text-[#2E89C4] rounded-lg hover:bg-[#2E89C4] hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Calculation Summary */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-[#2E89C4]">
          <h4 className="font-semibold text-gray-800 mb-3">Current Calculation</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Years to Goal:</span>
              <span className="font-semibold">{goalYear - currentYear} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Future Cost:</span>
              <span className="font-semibold text-[#2E89C4]">{formatCurrency(currentGoalResult.futureCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Lumpsum → FV:</span>
              <span className="font-semibold">{formatCurrency(currentGoalResult.lumpsumFutureValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Required Monthly SIP:</span>
              <span className="font-semibold text-green-600">{formatCurrency(currentGoalResult.requiredMonthlySIP)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Table */}
      <div className="lg:col-span-3 bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Your Goals</h3>
        
        {goals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No goals added yet. Add your first goal to get started!</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Goal</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Year</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Future Cost</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Lumpsum FV</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Monthly SIP</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {goals.map((goal) => {
                    const result = calculateGoal(goal);
                    return (
                      <tr key={goal.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800 font-medium">{goal.name}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{goal.year}</td>
                        <td className="px-4 py-3 text-right text-[#2E89C4] font-semibold">
                          {formatCurrency(result.futureCost)}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {formatCurrency(result.lumpsumFutureValue)}
                        </td>
                        <td className="px-4 py-3 text-right text-green-600 font-semibold">
                          {formatCurrency(result.requiredMonthlySIP)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-right font-bold text-gray-800">
                      Total Monthly SIP Required:
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-600 text-lg">
                      {formatCurrency(totalMonthlySIP)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
              <p className="text-sm text-blue-800">
                To achieve all {goals.length} goal{goals.length !== 1 ? 's' : ''}, you need to invest{' '}
                <strong className="text-green-600">{formatCurrency(totalMonthlySIP)}</strong> per month 
                with an annual step-up of {sipGrowthRate}%.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
