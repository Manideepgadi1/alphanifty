import { Header } from './Header';
import { User } from '../App';
import { ArrowLeft, Plus, Edit, Trash2, TrendingUp, Package, Filter, Search } from 'lucide-react';
import { useState } from 'react';

interface MyBasketsPageProps {
  navigateTo: (page: any, data?: any) => void;
  user: User | null;
  userBaskets: any[];
  deleteBasket?: (basketId: string) => void;
}

export function MyBasketsPage({ navigateTo, user, userBaskets, deleteBasket }: MyBasketsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const riskLevels = ['All', 'Moderate', 'Moderate-High', 'High'];

  const filteredBaskets = userBaskets
    .filter(basket => {
      const matchesSearch = basket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           basket.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = riskFilter === 'All' || basket.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const handleDeleteBasket = (basketId: string, basketName: string) => {
    if (window.confirm(`Are you sure you want to delete "${basketName}"?`)) {
      if (deleteBasket) {
        deleteBasket(basketId);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigateTo={navigateTo} user={user} showCart={true} cartCount={0} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigateTo('dashboard')}
          className="flex items-center space-x-2 text-[#2E89C4] hover:text-[#1B263B] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-[#1B263B] mb-2">My Custom Baskets</h1>
            <p className="text-gray-600">Manage your personalized investment baskets</p>
          </div>
          <button
            onClick={() => navigateTo('create-basket')}
            className="mt-4 sm:mt-0 bg-[#3BAF4A] hover:bg-[#329940] text-white px-6 py-3 rounded-lg transition-all shadow-lg flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Basket</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-[#2E89C4]" />
            <h3 className="text-[#1B263B]">Filter & Sort</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search baskets..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
              />
            </div>

            {/* Risk Filter */}
            <div>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
              >
                {riskLevels.map(risk => (
                  <option key={risk} value={risk}>
                    {risk === 'All' ? 'All Risk Levels' : `Risk: ${risk}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#2E89C4] transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Baskets Grid */}
        {filteredBaskets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-[#1B263B] mb-4">
              {userBaskets.length === 0 ? 'No Baskets Created Yet' : 'No Baskets Found'}
            </h2>
            <p className="text-gray-600 mb-8">
              {userBaskets.length === 0 
                ? 'Create your first custom basket to get started' 
                : 'Try adjusting your search or filters'}
            </p>
            {userBaskets.length === 0 && (
              <button
                onClick={() => navigateTo('create-basket')}
                className="bg-[#3BAF4A] hover:bg-[#329940] text-white px-8 py-3 rounded-lg transition-all shadow-lg inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Basket</span>
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredBaskets.length} of {userBaskets.length} basket{userBaskets.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBaskets.map((basket) => (
                <div key={basket.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
                  {/* Basket Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-lg shadow-md flex-shrink-0"
                        style={{ backgroundColor: basket.color }}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigateTo('edit-basket', { basket })}
                          className="p-2 text-[#2E89C4] hover:bg-[#2E89C4]/10 rounded-lg transition-colors"
                          title="Edit Basket"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBasket(basket.id, basket.name)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Basket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-[#1B263B] mb-2">{basket.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{basket.description}</p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Total Funds</p>
                        <p className="text-lg text-[#1B263B]">{basket.funds.length}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Risk Level</p>
                        <p className="text-sm text-[#1B263B]">{basket.riskLevel}</p>
                      </div>
                    </div>

                    {/* Performance */}
                    <div className="bg-gradient-to-r from-[#3BAF4A]/10 to-[#2E89C4]/10 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">3Y CAGR</p>
                          <p className="text-lg text-[#3BAF4A]">{basket.cagr3Y}%</p>
                        </div>
                        <TrendingUp className="w-6 h-6 text-[#2E89C4]" />
                      </div>
                    </div>

                    {/* Min Investment */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Min. Investment</span>
                      <span className="text-lg text-[#1B263B]">₹{basket.minInvestment.toLocaleString()}</span>
                    </div>

                    {/* Created Date */}
                    <div className="text-xs text-gray-500 mb-4">
                      Created: {new Date(basket.createdAt).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 pb-6 space-y-2">
                    <button
                      onClick={() => navigateTo('basket-details', { basketId: basket.id })}
                      className="w-full bg-[#3BAF4A] hover:bg-[#329940] text-white py-3 rounded-lg transition-all"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => navigateTo('edit-basket', { basket })}
                      className="w-full border-2 border-gray-200 hover:border-[#2E89C4] text-gray-700 py-3 rounded-lg transition-colors"
                    >
                      Edit Basket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
