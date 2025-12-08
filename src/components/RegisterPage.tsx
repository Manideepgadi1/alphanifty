import { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Loader, UserPlus, Shield } from 'lucide-react';
import { User } from '../App';
import alphaniftyLogo from 'figma:asset/218bb0d7dc695a17e372bb77ecebe304227215d4.png';

interface RegisterPageProps {
  navigateTo: (page: any, data?: any) => void;
  setUser: (user: User) => void;
}

type Step = 'details' | 'otp' | 'success';

export function RegisterPage({ navigateTo, setUser }: RegisterPageProps) {
  const [step, setStep] = useState<Step>('details');
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: ''
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [contactAlreadyRegistered, setContactAlreadyRegistered] = useState(false);

  // Existing contacts (mock database - in real app, this would be API call)
  const existingMobiles = ['9876543210', '8765432109'];
  const existingEmails = ['john@example.com', 'test@alphanifty.com'];

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

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError('');
    setContactAlreadyRegistered(false);
  };

  // Validate all form fields
  const validateForm = (): boolean => {
    const { fullName, mobile, email } = formData;

    if (!fullName.trim()) {
      setError('Full name is required');
      return false;
    }

    if (fullName.trim().length < 3) {
      setError('Full name must be at least 3 characters long');
      return false;
    }

    if (!mobile.trim()) {
      setError('Mobile number is required');
      return false;
    }

    if (!validateMobile(mobile)) {
      setError('Please enter a valid 10-digit mobile number starting with 6-9');
      return false;
    }

    if (!email.trim()) {
      setError('Email address is required');
      return false;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  // Handle form submission - Check if user exists and send OTP
  const handleProceedAndSendOTP = () => {
    setError('');
    setContactAlreadyRegistered(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to check if mobile or email exists
    setTimeout(() => {
      const mobileExists = existingMobiles.includes(formData.mobile);
      const emailExists = existingEmails.includes(formData.email.toLowerCase());
      
      if (mobileExists || emailExists) {
        // Mobile or Email already registered
        setIsLoading(false);
        setContactAlreadyRegistered(true);
        setError('');
      } else {
        // New user - send OTP
        setIsLoading(false);
        setStep('otp');
        startResendTimer();
      }
    }, 1200);
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

  // Verify OTP and create account
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
        // OTP correct - create account and log user in
        const newUser: User = {
          email: formData.email,
          name: formData.fullName
        };
        
        setUser(newUser);
        setStep('success');
        
        // Redirect to dashboard after 2.5 seconds (user is now logged in)
        setTimeout(() => {
          navigateTo('dashboard');
        }, 2500);
      } else {
        setError('Invalid OTP. Please try again or resend OTP.');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E89C4]/10 via-white to-[#3BAF4A]/10 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        {step === 'details' && (
          <button
            onClick={() => navigateTo('auth-welcome')}
            className="flex items-center space-x-2 text-[#2E89C4] hover:text-[#2576a8] mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        )}

        {step === 'otp' && (
          <button
            onClick={() => {
              setStep('details');
              setOtp('');
              setResendTimer(0);
              setError('');
            }}
            className="flex items-center space-x-2 text-[#2E89C4] hover:text-[#2576a8] mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        )}

        {/* Logo */}
        <div className="text-center mb-8">
          <img src={alphaniftyLogo} alt="Alphanifty Logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-[#1B263B] mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join Alphanifty and start investing</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Step 1: Enter Details */}
          {step === 'details' && (
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-[#3BAF4A]/10 rounded-full flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-[#3BAF4A]" />
                </div>
                <h2 className="text-[#1B263B]">Registration Details</h2>
              </div>

              <div className="space-y-4 mb-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#3BAF4A] focus:outline-none transition-colors"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#3BAF4A] focus:outline-none transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">10-digit number starting with 6-9</p>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#3BAF4A] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Error Messages */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {contactAlreadyRegistered && (
                <div className="mb-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <div className="flex items-start space-x-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-600 mb-1">Account Already Exists</p>
                        <p className="text-sm text-red-600">
                          This mobile number or email is already registered with Alphanifty.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigateTo('sign-in')}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Go to Login
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleProceedAndSendOTP}
                disabled={isLoading || contactAlreadyRegistered}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#3BAF4A] to-[#329940] hover:from-[#329940] hover:to-[#2d8838] text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <span>Continue & Send OTP</span>
                )}
              </button>

              {/* Footer */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigateTo('sign-in')}
                    className="text-[#2E89C4] hover:text-[#2576a8] underline"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Verify OTP */}
          {step === 'otp' && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-[#3BAF4A]" />
                </div>
                <h2 className="text-[#1B263B] mb-3">Verify OTP</h2>
                <p className="text-sm text-gray-600 mb-1">
                  OTP sent to +91 {maskMobile(formData.mobile)}
                </p>
                <p className="text-sm text-gray-600">
                  and {maskEmail(formData.email)}
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
                  <span>Verify & Create Account</span>
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
                    disabled={isLoading}
                    className="text-sm text-[#2E89C4] hover:text-[#2576a8] underline disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-[#3BAF4A]" />
              </div>
              <h2 className="text-[#1B263B] mb-3">Account Created Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Welcome to Alphanifty, {formData.fullName}!
              </p>
              <div className="flex items-center justify-center space-x-2 text-[#2E89C4]">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Redirecting to your dashboard...</span>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        {step === 'details' && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-[#2E89C4] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600">
                Your information is protected with bank-level encryption. We will never share your personal data without your consent.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
