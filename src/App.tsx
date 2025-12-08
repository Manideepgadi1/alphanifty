import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { BasketListPage } from './components/BasketListPage';
import { BasketDetailsPage } from './components/BasketDetailsPage';
import { GoalCalculatorPage } from './components/GoalCalculatorPage';
import { ExploreMutualFundsPage } from './components/ExploreMutualFundsPage';
import { TransactionPage } from './components/TransactionPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { DashboardPage } from './components/DashboardPage';
import { TicketRaisePage } from './components/TicketRaisePage';
import { BasketInvestmentJourney } from './components/BasketInvestmentJourney';
import { AuthWelcomePage } from './components/AuthWelcomePage';
import { SignInPage } from './components/SignInPage';
import { RegisterPage } from './components/RegisterPage';
import { CreateBasketNamePage } from './components/CreateBasketNamePage';
import { FundSelectionPage } from './components/FundSelectionPage';
import { FundAllocationPage } from './components/FundAllocationPage';
import { BasketInvestmentAmountPage } from './components/BasketInvestmentAmountPage';
import { MyBasketsPage } from './components/MyBasketsPage';
import { EditBasketPage } from './components/EditBasketPage';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { AdminBasketCreatePage } from './components/AdminBasketCreatePage';
import { AdminBasketListPage } from './components/AdminBasketListPage';
import { AdminFundSelectionPage } from './components/AdminFundSelectionPage';
import { AdminFundAllocationPage } from './components/AdminFundAllocationPage';
import { AdminBasketSettingsPage } from './components/AdminBasketSettingsPage';
import { AdminEditBasketPage } from './components/AdminEditBasketPage';

export type Page = 
  | 'home' 
  | 'auth-welcome'
  | 'sign-in'
  | 'register'
  | 'login' 
  | 'basket-list' 
  | 'basket-details' 
  | 'basket-investment-journey'
  | 'goal-calculator'
  | 'explore-funds'
  | 'transaction'
  | 'cart'
  | 'checkout'
  | 'dashboard'
  | 'ticket-raise'
  | 'create-basket'
  | 'fund-selection'
  | 'fund-allocation'
  | 'basket-investment-amount'
  | 'my-baskets'
  | 'edit-basket'
  | 'admin-dashboard'
  | 'admin-create-basket'
  | 'admin-basket-list'
  | 'admin-fund-selection'
  | 'admin-fund-allocation'
  | 'admin-basket-settings'
  | 'admin-edit-basket';

export interface User {
  email: string;
  name: string;
}

export interface Fund {
  id: string;
  name: string;
  allocation: number;
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  aum: string;
  rating: number;
  expenseRatio: number;
  risk: 'Low' | 'Medium' | 'High';
  category: 'Equity' | 'Debt' | 'Hybrid';
  fundHouse: string;
  nav: number;
  sharpeRatio: number;
  standardDeviation: number;
}

export interface Basket {
  id: string;
  name: string;
  color: string;
  description: string;
  ageRange: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  minInvestment: number;
  timeHorizon: string;
  goals: string[];
  experienceLevel: string;
  cagr1Y: number;
  cagr3Y: number;
  cagr5Y: number;
  funds: Fund[];
  rationale: string;
  philosophy: string;
  suitableFor: string;
  rebalancingFrequency: string;
  riskPercentage: number;
  sharpeRatio: number;
}

export interface CartItem {
  basket: Basket;
  amount: number;
  type: 'SIP' | 'Lumpsum';
  frequency?: 'Monthly' | 'Quarterly' | 'Yearly';
  goal?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [selectedBasket, setSelectedBasket] = useState<Basket | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [myBaskets, setMyBaskets] = useState<Basket[]>([]);
  const [userBaskets, setUserBaskets] = useState<any[]>([]);
  const [curatedBaskets, setCuratedBaskets] = useState<any[]>([]);
  const [navigationData, setNavigationData] = useState<any>(null);

  const navigateTo = (page: Page, data?: any) => {
    setCurrentPage(page);
    setNavigationData(data);
    window.scrollTo(0, 0);
  };

  const addToCart = (item: CartItem) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const saveBasket = (basket: any) => {
    setUserBaskets([...userBaskets, basket]);
  };

  const deleteBasket = (basketId: string) => {
    setUserBaskets(userBaskets.filter(b => b.id !== basketId));
  };

  const updateBasket = (basketId: string, updates: any) => {
    setUserBaskets(userBaskets.map(b => 
      b.id === basketId ? { ...b, ...updates } : b
    ));
  };

  const saveCuratedBasket = (basket: any) => {
    setCuratedBaskets([...curatedBaskets, basket]);
  };

  const deleteCuratedBasket = (basketId: string) => {
    setCuratedBaskets(curatedBaskets.filter(b => b.id !== basketId));
  };

  const updateCuratedBasket = (basketId: string, updates: any) => {
    setCuratedBaskets(curatedBaskets.map(b => 
      b.id === basketId ? { ...b, ...updates } : b
    ));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} user={user} />;
      case 'login':
        return <LoginPage mode={currentPage} navigateTo={navigateTo} setUser={setUser} />;
      case 'auth-welcome':
        return <AuthWelcomePage navigateTo={navigateTo} />;
      case 'sign-in':
        return <SignInPage navigateTo={navigateTo} setUser={setUser} />;
      case 'register':
        return <RegisterPage navigateTo={navigateTo} setUser={setUser} />;
      case 'basket-list':
        return <BasketListPage navigateTo={navigateTo} user={user} setSelectedBasket={setSelectedBasket} cart={cart} addToCart={addToCart} />;
      case 'basket-details':
        return <BasketDetailsPage basket={selectedBasket} navigateTo={navigateTo} user={user} setSelectedBasket={setSelectedBasket} cart={cart} addToCart={addToCart} />;
      case 'basket-investment-journey':
        return <BasketInvestmentJourney basket={selectedBasket!} navigateTo={navigateTo} user={user} cartCount={cart.length} />;
      case 'goal-calculator':
        return <GoalCalculatorPage basket={selectedBasket} navigateTo={navigateTo} user={user} cart={cart} addToCart={addToCart} />;
      case 'explore-funds':
        return <ExploreMutualFundsPage navigateTo={navigateTo} user={user} cart={cart} addToCart={addToCart} setSelectedBasket={setSelectedBasket} />;
      case 'transaction':
        return <TransactionPage basket={selectedBasket} navigateTo={navigateTo} user={user} cart={cart} addToCart={addToCart} />;
      case 'cart':
        return <CartPage cart={cart} navigateTo={navigateTo} user={user} removeFromCart={removeFromCart} />;
      case 'checkout':
        return <CheckoutPage cart={cart} navigateTo={navigateTo} user={user} clearCart={clearCart} setMyBaskets={setMyBaskets} />;
      case 'dashboard':
        return <DashboardPage myBaskets={myBaskets} navigateTo={navigateTo} user={user} setSelectedBasket={setSelectedBasket} cartCount={cart.length} />;
      case 'ticket-raise':
        return <TicketRaisePage navigateTo={navigateTo} user={user} />;
      case 'create-basket':
        return <CreateBasketNamePage navigateTo={navigateTo} user={user} />;
      case 'fund-selection':
        return <FundSelectionPage navigateTo={navigateTo} user={user} basketData={navigationData} />;
      case 'fund-allocation':
        return <FundAllocationPage navigateTo={navigateTo} user={user} basketData={navigationData} />;
      case 'basket-investment-amount':
        return <BasketInvestmentAmountPage navigateTo={navigateTo} user={user} basketData={navigationData} saveBasket={saveBasket} />;
      case 'my-baskets':
        return <MyBasketsPage navigateTo={navigateTo} user={user} userBaskets={userBaskets} deleteBasket={deleteBasket} />;
      case 'edit-basket':
        return <EditBasketPage navigateTo={navigateTo} user={user} basketData={navigationData} updateBasket={updateBasket} />;
      case 'admin-dashboard':
        return <AdminDashboardPage navigateTo={navigateTo} user={user} curatedBaskets={curatedBaskets} />;
      case 'admin-create-basket':
        return <AdminBasketCreatePage navigateTo={navigateTo} user={user} basketData={navigationData} />;
      case 'admin-basket-list':
        return <AdminBasketListPage navigateTo={navigateTo} user={user} curatedBaskets={curatedBaskets} deleteCuratedBasket={deleteCuratedBasket} />;
      case 'admin-fund-selection':
        return <AdminFundSelectionPage navigateTo={navigateTo} user={user} basketData={navigationData} />;
      case 'admin-fund-allocation':
        return <AdminFundAllocationPage navigateTo={navigateTo} user={user} basketData={navigationData} />;
      case 'admin-basket-settings':
        return <AdminBasketSettingsPage navigateTo={navigateTo} user={user} basketData={navigationData} saveCuratedBasket={saveCuratedBasket} updateCuratedBasket={updateCuratedBasket} />;
      case 'admin-edit-basket':
        return <AdminEditBasketPage navigateTo={navigateTo} user={user} basketData={navigationData} updateCuratedBasket={updateCuratedBasket} />;
      default:
        return <HomePage navigateTo={navigateTo} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {renderPage()}
    </div>
  );
}