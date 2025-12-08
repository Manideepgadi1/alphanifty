import { Header } from './Header';
import { User } from '../App';
import { ArrowLeft, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdminEditBasketPageProps {
  navigateTo: (page: any, data?: any) => void;
  user: User | null;
  basketData?: any;
  updateCuratedBasket?: (basketId: string, updates: any) => void;
}

export function AdminEditBasketPage({ navigateTo, user, basketData, updateCuratedBasket }: AdminEditBasketPageProps) {
  const basket = basketData?.basket;

  // Redirect to Step 1 with edit mode enabled
  useEffect(() => {
    if (basket) {
      navigateTo('admin-create-basket', {
        isEditMode: true,
        basket: basket
      });
    }
  }, [basket, navigateTo]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigateTo={navigateTo} user={user} showCart={false} cartCount={0} />
      
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3BAF4A]"></div>
          </div>
          <p className="text-gray-600 mt-6">Loading basket editor...</p>
        </div>
      </div>
    </div>
  );
}