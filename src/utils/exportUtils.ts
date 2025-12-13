import { Basket } from '../data/mockData';

// Export basket data as CSV
export const exportToCSV = (basket: Basket) => {
  const headers = ['Fund Name', 'Category', 'Risk', 'Expected Return', 'Min Investment', 'Allocation'];
  const rows = basket.funds.map(fund => [
    fund.name,
    fund.category,
    fund.risk,
    `${fund.expectedReturn}%`,
    `₹${fund.minInvestment.toLocaleString()}`,
    fund.allocation ? `${fund.allocation}%` : 'N/A'
  ]);

  const csvContent = [
    `Basket Name,${basket.name}`,
    `Risk Level,${basket.riskPercentage}%`,
    `CAGR (3Y),${basket.cagr3Y || 'N/A'}%`,
    `CAGR (5Y),${basket.cagr5Y || 'N/A'}%`,
    `Sharpe Ratio,${basket.sharpeRatio || 'N/A'}`,
    `Min Investment,₹${basket.minInvestment.toLocaleString()}`,
    '',
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${basket.name.replace(/\s+/g, '_')}_data.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export basket data as JSON
export const exportToJSON = (basket: Basket) => {
  const jsonContent = JSON.stringify(basket, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${basket.name.replace(/\s+/g, '_')}_data.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate shareable link
export const generateShareableLink = (basketId: string): string => {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#/basket/${basketId}/share`;
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

// Export comparison data
export const exportComparisonToCSV = (baskets: Basket[]) => {
  const headers = ['Metric', ...baskets.map(b => b.name)];
  const metrics = [
    ['CAGR (3Y)', ...baskets.map(b => `${b.cagr3Y || 'N/A'}%`)],
    ['CAGR (5Y)', ...baskets.map(b => `${b.cagr5Y || 'N/A'}%`)],
    ['Risk Level', ...baskets.map(b => `${b.riskPercentage}%`)],
    ['Sharpe Ratio', ...baskets.map(b => b.sharpeRatio || 'N/A')],
    ['Min Investment', ...baskets.map(b => `₹${b.minInvestment.toLocaleString()}`)],
    ['Number of Funds', ...baskets.map(b => b.funds.length)],
    ['Experience Level', ...baskets.map(b => b.experienceLevel)],
  ];

  const csvContent = [
    'Basket Comparison Report',
    `Generated on: ${new Date().toLocaleString()}`,
    '',
    headers.join(','),
    ...metrics.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `basket_comparison_${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Print basket details
export const printBasketDetails = (basket: Basket) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${basket.name} - Basket Details</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #2E89C4; }
        h2 { color: #1B263B; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #2E89C4; color: white; }
        .metric { display: inline-block; margin: 10px 20px 10px 0; }
        .metric-label { font-weight: bold; color: #666; }
        .metric-value { font-size: 18px; color: #333; }
        @media print {
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>${basket.name}</h1>
      <p><strong>Description:</strong> ${basket.description}</p>
      
      <h2>Key Metrics</h2>
      <div class="metric">
        <div class="metric-label">Risk Level</div>
        <div class="metric-value">${basket.riskPercentage}%</div>
      </div>
      <div class="metric">
        <div class="metric-label">CAGR (5Y)</div>
        <div class="metric-value">${basket.cagr5Y || 'N/A'}%</div>
      </div>
      <div class="metric">
        <div class="metric-label">Sharpe Ratio</div>
        <div class="metric-value">${basket.sharpeRatio || 'N/A'}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Min Investment</div>
        <div class="metric-value">₹${basket.minInvestment.toLocaleString()}</div>
      </div>
      
      <h2>Fund Allocation</h2>
      <table>
        <thead>
          <tr>
            <th>Fund Name</th>
            <th>Category</th>
            <th>Risk</th>
            <th>Expected Return</th>
            <th>Allocation</th>
          </tr>
        </thead>
        <tbody>
          ${basket.funds.map(fund => `
            <tr>
              <td>${fund.name}</td>
              <td>${fund.category}</td>
              <td>${fund.risk}</td>
              <td>${fund.expectedReturn}%</td>
              <td>${fund.allocation ? fund.allocation + '%' : 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <p style="margin-top: 40px; color: #666; font-size: 12px;">
        Generated on ${new Date().toLocaleString()} | Alphanifty Investment Platform
      </p>
      
      <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #2E89C4; color: white; border: none; cursor: pointer; border-radius: 5px;">
        Print This Page
      </button>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
