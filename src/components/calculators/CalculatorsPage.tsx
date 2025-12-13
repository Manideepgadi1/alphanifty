import { useState, lazy, Suspense } from 'react';
import { Header } from '../Header';
import { User, CartItem } from '../../App';
import { ArrowLeft, Calculator, TrendingUp, Target, Loader2 } from 'lucide-react';

// Lazy load calculator components for better performance
const SIPCalculatorComponent = lazy(() => 
  import('./SIPCalculatorComponent').then(module => ({ default: module.SIPCalculatorComponent }))
);
const LumpsumCalculatorComponent = lazy(() => 
  import('./LumpsumCalculatorComponent').then(module => ({ default: module.LumpsumCalculatorComponent }))
);
const GoalCalculatorComponent = lazy(() => 
  import('./GoalCalculatorComponent').then(module => ({ default: module.GoalCalculatorComponent }))
);

interface CalculatorsPageProps {
  navigateTo: (page: any) => void;
  user: User | null;
  cart: CartItem[];
}

type CalculatorTab = 'sip' | 'lumpsum' | 'goal';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-[#2E89C4] animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Loading calculator...</p>
    </div>
  </div>
);

export function CalculatorsPage({ navigateTo, user, cart }: CalculatorsPageProps) {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('sip');

  const tabs = [
    { id: 'sip' as CalculatorTab, label: 'SIP Calculator', icon: Calculator },
    { id: 'lumpsum' as CalculatorTab, label: 'Lumpsum Calculator', icon: TrendingUp },
    { id: 'goal' as CalculatorTab, label: 'Goal Calculator', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header
        navigateTo={navigateTo}
        user={user}
        showCart={true}
        cartCount={cart.length}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center text-[#2E89C4] hover:text-[#2670a8] mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Investment Calculators</h1>
          <p className="text-gray-600">Plan your investments with our advanced calculators</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#2E89C4] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Calculator Content */}
        <div className="bg-transparent">
          <Suspense fallback={<LoadingSpinner />}>
            {activeTab === 'sip' && <SIPCalculatorComponent />}
            {activeTab === 'lumpsum' && <LumpsumCalculatorComponent />}
            {activeTab === 'goal' && <GoalCalculatorComponent />}
          </Suspense>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-3">About Investment Calculators</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">SIP Calculator</h4>
              <p>Calculate the future value of your Systematic Investment Plan (SIP) with options for step-up investments and different contribution frequencies.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Lumpsum Calculator</h4>
              <p>Estimate the growth of a one-time investment over a specific period based on expected annual returns.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Goal Calculator</h4>
              <p>Plan for multiple financial goals by calculating the required monthly SIP considering inflation, current investments, and growth rates.</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <strong>Disclaimer:</strong> These calculators provide estimates for educational purposes only. 
              Actual investment returns may vary based on market conditions and are subject to market risks. 
              Please consult with a financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
