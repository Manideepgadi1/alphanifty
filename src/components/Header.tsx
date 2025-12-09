import { User as UserType } from '../App';
import { User, ShoppingCart, Menu, X, Shield, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import alphaniftyLogo from 'figma:asset/218bb0d7dc695a17e372bb77ecebe304227215d4.png';

interface HeaderProps {
  navigateTo: (page: any) => void;
  user: UserType | null;
  showCart?: boolean;
  cartCount?: number;
}

export function Header({ navigateTo, user, showCart = false, cartCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#2E89C4] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Back to Dashboard Button */}
          <a 
            href="/"
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Dashboard</span>
          </a>

          {/* Logo */}
          <button 
            onClick={() => navigateTo('home')}
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <img 
              src={alphaniftyLogo} 
              alt="Alphanifty" 
              className="h-10 w-auto"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => navigateTo('basket-list')}
              className="hover:text-[#E8C23A] transition-colors"
            >
              Explore Baskets
            </button>
            <button 
              onClick={() => navigateTo('explore-funds')}
              className="hover:text-[#E8C23A] transition-colors"
            >
              Explore Mutual Funds
            </button>
            <button 
              onClick={() => navigateTo('transaction')}
              className="hover:text-[#E8C23A] transition-colors"
            >
              Transactions
            </button>
            <button 
              onClick={() => navigateTo('ticket-raise')}
              className="hover:text-[#E8C23A] transition-colors"
            >
              Support
            </button>
            
            {/* Admin Panel Link */}
            <button 
              onClick={() => navigateTo('admin-dashboard')}
              className="flex items-center space-x-2 bg-[#E8C23A] hover:bg-[#d4b034] text-[#1B263B] px-4 py-2 rounded-lg transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {showCart && (
              <button
                onClick={() => navigateTo('cart')}
                className="relative hover:text-[#E8C23A] transition-colors hidden md:block"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E8C23A] text-[#1B263B] rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            
            {user ? (
              <button
                onClick={() => navigateTo('dashboard')}
                className="hidden md:flex items-center space-x-2 bg-[#3BAF4A] hover:bg-[#329940] px-4 py-2 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span>{user.name}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  navigateTo('auth-welcome');
                  setMobileMenuOpen(false);
                }}
                className="hidden md:block bg-[#E8C23A] hover:bg-[#d4b034] text-[#1B263B] px-6 py-2 rounded-lg transition-colors"
              >
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden hover:text-[#E8C23A] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-400">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => {
                  navigateTo('basket-list');
                  setMobileMenuOpen(false);
                }}
                className="text-left hover:text-[#E8C23A] transition-colors"
              >
                Explore Baskets
              </button>
              <button 
                onClick={() => {
                  navigateTo('explore-funds');
                  setMobileMenuOpen(false);
                }}
                className="text-left hover:text-[#E8C23A] transition-colors"
              >
                Explore Mutual Funds
              </button>
              <button 
                onClick={() => {
                  navigateTo('transaction');
                  setMobileMenuOpen(false);
                }}
                className="text-left hover:text-[#E8C23A] transition-colors"
              >
                Transactions
              </button>
              <button 
                onClick={() => {
                  navigateTo('ticket-raise');
                  setMobileMenuOpen(false);
                }}
                className="text-left hover:text-[#E8C23A] transition-colors"
              >
                Support
              </button>
              
              {/* Admin Panel Link - Mobile */}
              <button 
                onClick={() => {
                  navigateTo('admin-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="text-left flex items-center space-x-2 bg-[#E8C23A] hover:bg-[#d4b034] text-[#1B263B] px-4 py-2 rounded-lg transition-colors"
              >
                <Shield className="w-5 h-5" />
                <span>Admin Panel</span>
              </button>
              
              {showCart && (
                <button
                  onClick={() => {
                    navigateTo('cart');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left flex items-center space-x-2 hover:text-[#E8C23A] transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
                </button>
              )}
              {user ? (
                <button
                  onClick={() => {
                    navigateTo('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left flex items-center space-x-2 bg-[#3BAF4A] px-4 py-2 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigateTo('auth-welcome');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left bg-[#E8C23A] text-[#1B263B] px-6 py-2 rounded-lg"
                >
                  Login
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}