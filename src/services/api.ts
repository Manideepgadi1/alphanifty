// API Service for Alphanifty Backend

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export interface BasketMetrics {
  cagr1Y: number;
  cagr3Y: number;
  cagr5Y: number;
  risk: number;
  sharpe?: number;
  sharpeRatio?: number;
  expenseRatio?: number;
  riskPercentage?: number;
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

export interface DualGraphData {
  absoluteReturns: GraphData;
  rollingReturns: GraphData;
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
  periodReturns?: PeriodReturns;
  graphData: GraphData | DualGraphData;
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
   * Fetch White Basket data from backend
   */
  async getWhiteBasket(years: number = 5): Promise<BasketAPIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/baskets/white-basket?years=${years}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching White Basket:', error);
      throw error;
    }
  },

  /**
   * Fetch Every Common India Basket data from backend
   */
  async getEveryCommonIndiaBasket(years: number = 5): Promise<BasketAPIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/baskets/every-common-india?years=${years}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Every Common India Basket:', error);
      throw error;
    }
  },

  /**
   * Fetch Raising India Basket data from backend
   */
  async getRaisingIndiaBasket(years: number = 5): Promise<BasketAPIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/baskets/raising-india?years=${years}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Raising India Basket:', error);
      throw error;
    }
  },

  /**
   * Fetch Great India Basket data from backend (with dual graph support)
   */
  async getGreatIndiaBasket(years: number = 5): Promise<BasketAPIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/baskets/great-india?years=${years}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Great India Basket:', error);
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
