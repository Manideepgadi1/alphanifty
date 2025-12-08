import { useState } from 'react';
import { ArrowLeft, Mail, Phone, Shield, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { User } from '../App';
import alphaniftyLogo from 'figma:asset/218bb0d7dc695a17e372bb77ecebe304227215d4.png';

interface SignInPageProps {
  navigateTo: (page: any) => void;
  setUser: (user: User) => void;
}

type LoginMethod = 'phone' | 'email';
type Step = 'choose-method' | 'enter-contact' | 'otp-verify';

export function SignInPage({ navigateTo, setUser }: SignInPageProps) {
  const [step, setStep] = useState<Step>('choose-method');
  const [loginMethod, setLoginMethod] = useState<LoginMethod | null>(null);
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Validate mobile number
  const validateMobile = (mobile: string): boolean => {
    return /^[6-9]\d{9}$/.test(mobile);
  };

  // Validate email
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Mask mobile number - show only last 4 digits
  const maskMobile = (mobile: string): string => {
    return `XXXXXX${mobile.slice(-4)}`;
  };

  // Mask email - show only first 2 chars and domain
  const maskEmail = (email: string): string => {
    const [username, domain] = email.split('@');
    if (username.length <= 2) return email;
    return `${username.slice(0, 2)}${'*'.repeat(username.length - 2)}@${domain}`;
  };

  // Handle method selection
  const handleMethodSelect = (method: LoginMethod) => {
    setLoginMethod(method);
    setStep('enter-contact');
    setError('');
    setContact('');
  };

  // Start resend timer
  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Send OTP
  const handleSendOTP = () => {
    setError('');

    // Validate contact
    if (loginMethod === 'phone') {
      if (!contact.trim()) {
        setError('Please enter your mobile number');
        return;
      }
      if (!validateMobile(contact)) {
        setError('Please enter a valid 10-digit mobile number starting with 6-9');
        return;
      }
    } else if (loginMethod === 'email') {
      if (!contact.trim()) {
        setError('Please enter your email address');
        return;
      }
      if (!validateEmail(contact)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    setIsLoading(true);
    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp-verify');
      startResendTimer();
    }, 1000);
  };

  // Resend OTP
  const handleResendOTP = () => {
    if (resendTimer > 0) return;

    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtp('');
      startResendTimer();
    }, 800);
  };

  // Verify OTP and login
  const handleVerifyOTP = () => {
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);

      // Mock: Check if OTP is correct
      if (otp === '123456' || otp === '000000') {
        // OTP correct - log user in
        const loggedInUser: User = {
          email: loginMethod === 'email' ? contact : 'user@alphanifty.com',
          name: 'John Doe' // In real app, this would come from backend
        };
        
        setUser(loggedInUser);
        navigateTo('dashboard');
      } else {
        setError('Invalid OTP. Please try again or resend OTP.');
      }
    }, 1000);
  };

  // Go back handler
  const handleBack = () => {
    setError('');
    if (step === 'enter-contact') {
      setStep('choose-method');
      setLoginMethod(null);
      setContact('');
    } else if (step === 'otp-verify') {
      setStep('enter-contact');
      setOtp('');
      setResendTimer(0);
    } else {
      navigateTo('auth-welcome');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E89C4]/10 via-white to-[#3BAF4A]/10 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-[#2E89C4] hover:text-[#2576a8] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <img src={alphaniftyLogo} alt="Alphanifty Logo" className="w-24 h-24" />
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Step 1: Choose OTP Method */}
          {step === 'choose-method' && (
            <div>
              <h2 className="text-[#1B263B] mb-2">Choose OTP Method</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleMethodSelect('phone')}
                  className="w-full flex items-center space-x-4 px-6 py-4 border-2 border-gray-200 hover:border-[#3BAF4A] hover:bg-green-50 rounded-xl transition-all group"
                >
                  <div className="w-12 h-12 bg-[#3BAF4A]/10 rounded-full flex items-center justify-center group-hover:bg-[#3BAF4A]/20 transition-colors">
                    <Phone className="w-6 h-6 text-[#3BAF4A]" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-[#1B263B]">Login with Mobile OTP</p>
                    <p className="text-sm text-gray-500">Receive OTP on your mobile number</p>
                  </div>
                </button>

                <button
                  onClick={() => handleMethodSelect('email')}
                  className="w-full flex items-center space-x-4 px-6 py-4 border-2 border-gray-200 hover:border-[#2E89C4] hover:bg-blue-50 rounded-xl transition-all group"
                >
                  <div className="w-12 h-12 bg-[#2E89C4]/10 rounded-full flex items-center justify-center group-hover:bg-[#2E89C4]/20 transition-colors">
                    <Mail className="w-6 h-6 text-[#2E89C4]" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-[#1B263B]">Login with Email OTP</p>
                    <p className="text-sm text-gray-500">Receive OTP on your email address</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Enter Contact Details */}
          {step === 'enter-contact' && (
            <div>
              <h2 className="text-[#1B263B] mb-2">
                Enter Your {loginMethod === 'phone' ? 'Mobile Number' : 'Email Address'}
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2">
                  {loginMethod === 'phone' ? 'Mobile Number' : 'Email Address'} <span className="text-red-500">*</span>
                </label>
                <input
                  type={loginMethod === 'phone' ? 'tel' : 'email'}
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value);
                    setError('');
                  }}
                  placeholder={loginMethod === 'phone' ? '9876543210' : 'your.email@example.com'}
                  maxLength={loginMethod === 'phone' ? 10 : undefined}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#3BAF4A] focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#3BAF4A] to-[#329940] hover:from-[#329940] hover:to-[#2d8838] text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <span>Send OTP</span>
                )}
              </button>
            </div>
          )}

          {/* Step 3: Verify OTP */}
          {step === 'otp-verify' && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-[#3BAF4A]" />
                </div>
                <h2 className="text-[#1B263B] mb-2">Enter OTP</h2>
                <p className="text-sm text-gray-600">
                  OTP sent to {loginMethod === 'phone' ? maskMobile(contact) : maskEmail(contact)}
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2">
                  6-Digit OTP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setOtp(value);
                    setError('');
                  }}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#3BAF4A] focus:outline-none transition-colors text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  For demo: Use <span className="text-[#3BAF4A]">123456</span> or <span className="text-[#3BAF4A]">000000</span>
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#3BAF4A] to-[#329940] hover:from-[#329940] hover:to-[#2d8838] text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-4"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify & Login</span>
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend OTP in <span className="text-[#2E89C4]">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    className="text-sm text-[#2E89C4] hover:text-[#2576a8] underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'choose-method' && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigateTo('register')}
                className="text-[#2E89C4] hover:text-[#2576a8] underline"
              >
                Register here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}