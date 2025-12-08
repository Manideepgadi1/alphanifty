import { LogIn, UserPlus } from 'lucide-react';

interface AuthWelcomePageProps {
  navigateTo: (page: any) => void;
}

export function AuthWelcomePage({ navigateTo }: AuthWelcomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E89C4]/10 via-white to-[#3BAF4A]/10 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo and Welcome Section */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <img 
              src="https://i.imgur.com/YourLogoURL.png" 
              alt="Alphanifty"
              className="h-16 mx-auto mb-4"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const text = document.createElement('div');
                text.className = 'text-4xl mb-4';
                text.innerHTML = '<span style="color: #3BAF4A;">Alpha</span><span style="color: #2E89C4;">nifty</span>';
                e.currentTarget.parentNode?.appendChild(text);
              }}
            />
          </div>
          <h1 className="text-[#1B263B] mb-3">Welcome to Alphanifty</h1>
          <p className="text-gray-600 text-lg">Curated Investment Baskets for Your Goals</p>
        </div>

        {/* Authentication Options Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <h2 className="text-[#1B263B] text-center mb-8">Get Started</h2>
          
          <div className="space-y-4">
            {/* Existing User Login Button */}
            <button
              onClick={() => navigateTo('sign-in')}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-[#3BAF4A] to-[#329940] hover:from-[#329940] hover:to-[#2d8838] text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <LogIn className="w-6 h-6" />
              <span className="text-lg">Existing User – Login</span>
            </button>

            {/* New User Register Button */}
            <button
              onClick={() => navigateTo('register')}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white hover:bg-gray-50 text-[#2E89C4] border-2 border-[#2E89C4] rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-6 h-6" />
              <span className="text-lg">New User – Register</span>
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start space-x-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-[#3BAF4A] rounded-full mt-2 flex-shrink-0" />
              <p>Login securely using your PAN card number and OTP verification</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Secured by 256-bit encryption</p>
        </div>
      </div>
    </div>
  );
}
