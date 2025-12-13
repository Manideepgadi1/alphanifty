import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What is Alphanifty?',
        a: 'Alphanifty is an investment platform that helps you create and manage diversified mutual fund baskets tailored to your financial goals and risk appetite.'
      },
      {
        q: 'How do I get started?',
        a: 'Simply explore our pre-curated baskets or create your own custom basket by selecting mutual funds that match your investment objectives.'
      },
      {
        q: 'What is a basket?',
        a: 'A basket is a curated collection of mutual funds designed to achieve specific investment goals while maintaining proper diversification.'
      }
    ]
  },
  {
    category: 'Investment Baskets',
    questions: [
      {
        q: 'How are baskets different from individual funds?',
        a: 'Baskets provide instant diversification across multiple funds, reducing risk and providing exposure to various market segments in one go.'
      },
      {
        q: 'Can I customize a basket?',
        a: 'Yes! You can modify fund allocations, add or remove funds, and create completely custom baskets based on your preferences.'
      },
      {
        q: 'What is the minimum investment amount?',
        a: 'Minimum investment varies by basket, typically ranging from ₹500 to ₹5,000. Check individual basket details for specific amounts.'
      }
    ]
  },
  {
    category: 'Performance & Returns',
    questions: [
      {
        q: 'What is CAGR?',
        a: 'CAGR (Compound Annual Growth Rate) represents the mean annual growth rate of an investment over a specified period, assuming profits are reinvested.'
      },
      {
        q: 'What is Sharpe Ratio?',
        a: 'Sharpe Ratio measures risk-adjusted returns. A higher ratio indicates better risk-adjusted performance. Generally, a ratio above 1 is considered good.'
      },
      {
        q: 'Are past returns guaranteed?',
        a: 'No. Past performance is not indicative of future results. All investments carry risk, and returns can vary based on market conditions.'
      }
    ]
  },
  {
    category: 'Risk Management',
    questions: [
      {
        q: 'How is risk percentage calculated?',
        a: 'Risk percentage indicates portfolio volatility based on fund categories, market exposure, and historical performance patterns.'
      },
      {
        q: 'What risk level should I choose?',
        a: 'Choose based on your age, investment horizon, and risk tolerance. Younger investors can typically handle higher risk, while those nearing retirement should prefer lower risk baskets.'
      },
      {
        q: 'Can I change baskets if my risk appetite changes?',
        a: 'Yes! You can switch between baskets or rebalance your portfolio as your financial situation and risk tolerance evolve.'
      }
    ]
  },
  {
    category: 'Features & Tools',
    questions: [
      {
        q: 'What is the SIP Calculator?',
        a: 'The SIP Calculator helps you estimate future returns based on monthly investments, expected returns, and investment duration.'
      },
      {
        q: 'How does the comparison tool work?',
        a: 'The comparison tool lets you compare up to 3 baskets side-by-side to evaluate performance metrics, risk levels, and fund composition.'
      },
      {
        q: 'Can I export basket data?',
        a: 'Yes! You can export basket details as CSV or JSON files, and even print detailed reports for your records.'
      }
    ]
  }
];

export function HelpFAQPage({ onClose }: { onClose: () => void }) {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-[#2E89C4] to-[#1B6EA1] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Help & FAQ</h2>
                <p className="text-blue-100 text-sm">Find answers to common questions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-y-auto p-6">
          {filteredFAQs.map((category, catIndex) => (
            <div key={catIndex} className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">{category.category}</h3>
              <div className="space-y-2">
                {category.questions.map((faq, qIndex) => {
                  const key = `${catIndex}-${qIndex}`;
                  const isOpen = openIndex === key;
                  
                  return (
                    <div key={qIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : key)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 text-left">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No results found for "{searchTerm}"</p>
            </div>
          )}

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h4 className="font-bold text-gray-900 mb-2">Still have questions?</h4>
            <p className="text-gray-700 mb-4">Our support team is here to help!</p>
            <button className="bg-[#2E89C4] text-white px-6 py-2 rounded-lg hover:bg-[#1B6EA1] transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
