import { Header } from './Header';
import { User } from '../App';
import { ArrowLeft, ArrowRight, Package } from 'lucide-react';
import { useState } from 'react';

interface CreateBasketNamePageProps {
  navigateTo: (page: any, data?: any) => void;
  user: User | null;
}

export function CreateBasketNamePage({ navigateTo, user }: CreateBasketNamePageProps) {
  const [basketName, setBasketName] = useState('');
  const [basketDescription, setBasketDescription] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!basketName.trim()) {
      setError('Please enter a basket name');
      return;
    }
    
    if (basketName.trim().length < 3) {
      setError('Basket name must be at least 3 characters');
      return;
    }

    // Navigate to fund selection with basket name
    navigateTo('fund-selection', { basketName, basketDescription });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={0} />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigateTo('dashboard')}
          className="flex items-center space-x-2 text-[#2E89C4] hover:text-[#1B263B] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3BAF4A] to-[#2E89C4] rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-[#1B263B]">Create New Basket</h1>
              <p className="text-sm text-gray-600">Build your personalized investment basket</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#3BAF4A]">Step 1 of 4</span>
              <span className="text-sm text-gray-500">Basket Details</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#3BAF4A] to-[#2E89C4] h-2 rounded-full" style={{ width: '25%' }} />
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Basket Name */}
            <div>
              <label htmlFor="basketName" className="block text-sm text-gray-700 mb-2">
                Basket Name <span className="text-red-500">*</span>
              </label>
              <input
                id="basketName"
                type="text"
                value={basketName}
                onChange={(e) => {
                  setBasketName(e.target.value);
                  setError('');
                }}
                placeholder="e.g., My Retirement Basket, High Growth Portfolio"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  error 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:border-[#2E89C4]'
                }`}
                maxLength={50}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">{basketName.length}/50 characters</p>
            </div>

            {/* Basket Description */}
            <div>
              <label htmlFor="basketDescription" className="block text-sm text-gray-700 mb-2">
                Basket Description <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                id="basketDescription"
                value={basketDescription}
                onChange={(e) => setBasketDescription(e.target.value)}
                placeholder="Briefly describe your investment strategy and goals for this basket..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors resize-none"
                rows={4}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{basketDescription.length}/200 characters</p>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-[#2E89C4]/10 to-[#3BAF4A]/10 border border-[#2E89C4]/20 rounded-lg p-4">
              <h4 className="text-sm text-[#1B263B] mb-2">💡 Quick Tips:</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• Choose a descriptive name that reflects your investment goal</li>
                <li>• You can customize fund allocation and proportions later</li>
                <li>• Your basket can include 3-15 mutual fund schemes</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigateTo('dashboard')}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-[#3BAF4A] hover:bg-[#329940] text-white rounded-lg transition-all shadow-lg flex items-center space-x-2"
            >
              <span>Next: Select Funds</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
