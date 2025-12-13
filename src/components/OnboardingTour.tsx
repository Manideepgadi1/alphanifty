import { useState, useEffect } from 'react';
import { ArrowRight, X, Check } from 'lucide-react';

const tourSteps = [
  {
    title: 'Welcome to Alphanifty! 🎉',
    description: 'Your smart investment platform for creating diversified mutual fund baskets. Let us show you around!',
    target: null
  },
  {
    title: 'Explore Baskets',
    description: 'Browse through our curated investment baskets designed for different risk profiles and financial goals.',
    target: 'basket-list'
  },
  {
    title: 'Portfolio Summary',
    description: 'View all your baskets at a glance with key metrics, performance data, and risk distribution.',
    target: 'portfolio-summary'
  },
  {
    title: 'Compare Baskets',
    description: 'Compare up to 3 baskets side-by-side to make informed investment decisions.',
    target: 'comparison'
  },
  {
    title: 'SIP Calculator',
    description: 'Plan your systematic investments and estimate future returns with our built-in calculator.',
    target: 'calculator'
  },
  {
    title: 'Watchlist',
    description: 'Save your favorite baskets to a watchlist for quick access and tracking.',
    target: 'watchlist'
  },
  {
    title: 'Get Help Anytime',
    description: 'Access our comprehensive FAQ section whenever you need assistance.',
    target: 'help'
  },
  {
    title: 'You\'re All Set! 🚀',
    description: 'Start exploring baskets, building your portfolio, and achieving your financial goals!',
    target: null
  }
];

export function OnboardingTour({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem('alphanifty_onboarding_completed');
    if (completed) {
      setShow(false);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('alphanifty_onboarding_completed', 'true');
    setShow(false);
    onComplete();
  };

  if (!show) return null;

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-fadeIn">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 rounded-t-2xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#2E89C4] to-[#10B981] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8">
          {/* Step Counter */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-semibold text-gray-500">
              Step {currentStep + 1} of {tourSteps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {step.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {tourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep 
                      ? 'w-8 bg-[#2E89C4]' 
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex space-x-3">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 bg-[#2E89C4] hover:bg-[#1B6EA1] text-white px-6 py-2 rounded-lg transition-colors"
              >
                <span>{currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}</span>
                {currentStep === tourSteps.length - 1 ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reset onboarding (for testing)
export const resetOnboarding = () => {
  localStorage.removeItem('alphanifty_onboarding_completed');
};
