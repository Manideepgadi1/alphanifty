// API Service for Alphanifty Backend

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export interface BasketMetrics {
  cagr1Y: number;
  cagr3Y: number;
  cagr5Y: number;
  risk: number;
  sharpeRatio: number;
  expenseRatio: number;
}

export interface PeriodReturns {
  '1M': number;
  '3M': number;
  '6M': number;
  '1Y': number;
  '3Y': number;
  '5Y': number;
}

export interface GraphData {
  labels: string[];
  basketData: number[];
  niftyData: number[];
}

export interface BasketAPIResponse {
  id: string;
  name: string;
  color: string;
  description: string;
  ageRange: string;
  riskLevel: string;
  minInvestment: number;
  timeHorizon: string;
  goals: string[];
  experienceLevel: string;
  metrics: BasketMetrics;
  periodReturns: PeriodReturns;
  graphData: GraphData;
  funds: any[];
  rationale: string;
  philosophy: string;
  suitableFor: string;
  rebalancingFrequency: string;
}

export const basketAPI = {
  /**
   * Fetch Conservative Balanced Basket data from backend
   */
  async getConservativeBalancedBasket(years: number = 5): Promise<BasketAPIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/baskets/conservative-balanced?years=${years}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Conservative Balanced Basket:', error);
      throw error;
    }
  },

  /**
   * Fetch Aggressive Hybrid Basket data from backend
   */
  async getAggressiveHybridBasket(years: number = 5): Promise<BasketAPIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/baskets/aggressive-hybrid?years=${years}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Aggressive Hybrid Basket:', error);
      throw error;
    }
  },

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API health check failed:', error);
      throw error;
    }
  }
};
