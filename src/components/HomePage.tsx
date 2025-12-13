import { Header } from './Header';
import { User } from '../App';
import { TrendingUp, Shield, Target, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

interface HomePageProps {
  navigateTo: (page: any) => void;
  user: User | null;
  onShowCalculator?: () => void;
  onShowHelp?: () => void;
}

export function HomePage({ navigateTo, user, onShowCalculator, onShowHelp }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <Header navigateTo={navigateTo} user={user} onShowCalculator={onShowCalculator} onShowHelp={onShowHelp} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#3BAF4A] via-[#2E89C4] to-[#E8C23A] text-white py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="mb-6">
                Invest Smarter with Curated Mutual Fund Baskets
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Choose from expertly curated investment baskets tailored to your age, goals, risk profile, and investment horizon.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigateTo(user ? 'basket-list' : 'auth-welcome')}
                  className="bg-[#E8C23A] hover:bg-[#d4b034] text-[#1B263B] px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>Start Investing</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigateTo('basket-list')}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50 px-8 py-4 rounded-lg transition-all"
                >
                  Explore Baskets
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="opacity-90">Average Returns</div>
                      <div>15-20% CAGR</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#3BAF4A] rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="opacity-90">Risk-Adjusted</div>
                      <div>Diversified Portfolio</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#E8C23A] rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="opacity-90">Goal-Based</div>
                      <div>Investing Made Easy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[#1B263B] mb-4">Why Choose Alphanifty?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of mutual fund investing with our intelligent basket-based approach
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3BAF4A] to-[#2E89C4] rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-[#1B263B] mb-4">Curated by Experts</h3>
              <p className="text-gray-600">
                Our investment baskets are carefully curated by financial experts, combining multiple mutual funds for optimal diversification and returns.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2E89C4] to-[#E8C23A] rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-[#1B263B] mb-4">Goal-Based Investing</h3>
              <p className="text-gray-600">
                Whether it's retirement, child's education, or dream home - align your investments with your life goals using our smart calculators.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E8C23A] to-[#3BAF4A] rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-[#1B263B] mb-4">Risk-Matched Portfolio</h3>
              <p className="text-gray-600">
                Get personalized basket recommendations based on your age, risk appetite, and investment timeline for worry-free investing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[#1B263B] mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to start your investment journey</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up in minutes with your email' },
              { step: '2', title: 'Choose Basket', desc: 'Browse curated baskets matching your profile' },
              { step: '3', title: 'Set Goals', desc: 'Assign goals and calculate returns' },
              { step: '4', title: 'Invest', desc: 'Start with SIP or lumpsum investment' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#2E89C4] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{item.step}</span>
                </div>
                <h3 className="text-[#1B263B] mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Baskets Preview */}
      <section className="py-20 px-4 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[#1B263B] mb-4">Popular Investment Baskets</h2>
            <p className="text-xl text-gray-600">Explore our most chosen investment baskets</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Orange Basket', color: '#FF6B35', risk: 'High', returns: '19.5%', goal: 'Wealth Creation' },
              { name: 'Blue Basket', color: '#2E89C4', risk: 'Medium', returns: '14.2%', goal: 'Balanced Growth' },
              { name: 'Retirement Basket', color: '#8B5CF6', risk: 'Medium', returns: '15.8%', goal: 'Retirement' }
            ].map((basket, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-[#3BAF4A]">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: basket.color }}></div>
                  <div>
                    <h3 className="text-[#1B263B]">{basket.name}</h3>
                    <p className="text-sm text-gray-500">{basket.goal}</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level:</span>
                    <span className="text-[#1B263B]">{basket.risk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">1Y Returns:</span>
                    <span className="text-[#3BAF4A]">{basket.returns}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigateTo('basket-list')}
                  className="w-full bg-[#2E89C4] hover:bg-[#2576a8] text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigateTo('basket-list')}
              className="bg-[#E8C23A] hover:bg-[#d4b034] text-[#1B263B] px-10 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Explore All Baskets
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1B263B] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6">Ready to Start Your Investment Journey?</h2>
          <p className="text-xl mb-8 text-white/80">
            Join thousands of investors who trust Alphanifty for their wealth creation goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigateTo(user ? 'basket-list' : 'auth-welcome')}
              className="bg-[#3BAF4A] hover:bg-[#329940] px-10 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started Now
            </button>
            <button
              onClick={() => navigateTo('explore-funds')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/50 px-10 py-4 rounded-lg transition-all"
            >
              Explore Mutual Funds
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2E89C4] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#3BAF4A] via-[#2E89C4] to-[#E8C23A] rounded-lg" />
                <span className="text-xl">Alphanifty</span>
              </div>
              <p className="text-white/80">
                Your trusted partner for goal-based mutual fund investing
              </p>
            </div>
            <div>
              <h4 className="mb-4">Quick Links</h4>
              <div className="space-y-2">
                <button onClick={() => navigateTo('basket-list')} className="block text-white/80 hover:text-white">
                  Explore Baskets
                </button>
                <button onClick={() => navigateTo('explore-funds')} className="block text-white/80 hover:text-white">
                  Mutual Funds
                </button>
              </div>
            </div>
            <div>
              <h4 className="mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#about" className="block text-white/80 hover:text-white">About Us</a>
                <a href="#contact" className="block text-white/80 hover:text-white">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="#privacy" className="block text-white/80 hover:text-white">Privacy Policy</a>
                <a href="#terms" className="block text-white/80 hover:text-white">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/60">
            <p>© 2025 Alphanifty. All rights reserved. Mutual fund investments are subject to market risks.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}