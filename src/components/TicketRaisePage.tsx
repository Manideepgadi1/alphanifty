import { useState } from 'react';
import { Header } from './Header';
import { User } from '../App';
import { MessageSquare, Send, CheckCircle, Clock, AlertCircle, FileText, Mail, Phone, User as UserIcon, ArrowLeft } from 'lucide-react';

interface TicketRaisePageProps {
  navigateTo: (page: any) => void;
  user: User | null;
}

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  description: string;
  createdAt: string;
  lastUpdated: string;
}

export function TicketRaisePage({ navigateTo, user }: TicketRaisePageProps) {
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [description, setDescription] = useState('');
  const [contactMethod, setContactMethod] = useState('email');
  const [submitted, setSubmitted] = useState(false);

  // Mock existing tickets
  const [tickets] = useState<Ticket[]>([
    {
      id: 'TKT-001',
      subject: 'Unable to complete SIP payment',
      category: 'Payment Issue',
      priority: 'High',
      status: 'In Progress',
      description: 'I tried to set up SIP for Orange Basket but payment is failing.',
      createdAt: '2025-11-25',
      lastUpdated: '2025-11-26',
    },
    {
      id: 'TKT-002',
      subject: 'Query about portfolio rebalancing',
      category: 'General Inquiry',
      priority: 'Medium',
      status: 'Resolved',
      description: 'How often should I rebalance my portfolio?',
      createdAt: '2025-11-20',
      lastUpdated: '2025-11-21',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setSubject('');
      setCategory('');
      setPriority('');
      setDescription('');
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'In Progress':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'Resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Closed':
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-700';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'Resolved':
        return 'bg-green-100 text-green-700';
      case 'Closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header navigateTo={navigateTo} user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigateTo('dashboard')}
          className="flex items-center space-x-2 text-[#2E89C4] hover:text-[#1B263B] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-[#1B263B] mb-2">Support Center</h1>
          <p className="text-gray-600">Raise a ticket or track your existing support requests</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#3BAF4A] hover:bg-[#329940] text-white px-6 py-3 rounded-lg transition-all flex items-center space-x-2 shadow-lg"
          >
            <MessageSquare className="w-5 h-5" />
            <span>{showForm ? 'Cancel' : 'Raise New Ticket'}</span>
          </button>
          <button
            onClick={() => navigateTo('dashboard')}
            className="bg-white hover:bg-gray-50 text-[#1B263B] px-6 py-3 rounded-lg transition-all border-2 border-gray-200 flex items-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>View Dashboard</span>
          </button>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8 flex items-start space-x-4">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-green-900 mb-1">Ticket Submitted Successfully!</h3>
              <p className="text-green-700">Your ticket has been created. Our support team will respond within 24 hours.</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Raise Ticket Form */}
          {showForm && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-[#1B263B] mb-6">Create Support Ticket</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Subject */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief description of your issue"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Category & Priority */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Payment Issue">Payment Issue</option>
                        <option value="Technical Problem">Technical Problem</option>
                        <option value="Account Query">Account Query</option>
                        <option value="Investment Query">Investment Query</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Complaint">Complaint</option>
                        <option value="Feature Request">Feature Request</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Priority *</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
                        required
                      >
                        <option value="">Select Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Description *</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please provide detailed information about your issue..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E89C4] focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-3">Preferred Contact Method</label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="contact"
                          value="email"
                          checked={contactMethod === 'email'}
                          onChange={(e) => setContactMethod(e.target.value)}
                          className="w-4 h-4 text-[#2E89C4]"
                        />
                        <Mail className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Email</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="contact"
                          value="phone"
                          checked={contactMethod === 'phone'}
                          onChange={(e) => setContactMethod(e.target.value)}
                          className="w-4 h-4 text-[#2E89C4]"
                        />
                        <Phone className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Phone</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#3BAF4A] hover:bg-[#329940] text-white py-4 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                    <span>Submit Ticket</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* My Tickets */}
          <div className={showForm ? 'lg:col-span-1' : 'lg:col-span-3'}>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-[#1B263B] mb-6">My Tickets</h2>
              
              {tickets.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No tickets raised yet</p>
                  <p className="text-gray-500 text-sm mt-2">Create your first support ticket to get help</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="border border-gray-200 rounded-lg p-6 hover:border-[#2E89C4] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-[#2E89C4] font-mono text-sm">{ticket.id}</span>
                            <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <h3 className="text-[#1B263B] mb-2">{ticket.subject}</h3>
                          <p className="text-gray-600 text-sm mb-3">{ticket.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Created: {ticket.createdAt}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>Updated: {ticket.lastUpdated}</span>
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          {getStatusIcon(ticket.status)}
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                          {ticket.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Help Resources */}
        <div className="mt-8 bg-gradient-to-r from-[#2E89C4]/10 to-[#3BAF4A]/10 rounded-xl p-8">
          <h3 className="text-[#1B263B] mb-4">Need Immediate Help?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <Mail className="w-6 h-6 text-[#2E89C4] flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700 mb-1">Email Support</p>
                <p className="text-[#2E89C4]">support@alphanifty.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="w-6 h-6 text-[#3BAF4A] flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700 mb-1">Phone Support</p>
                <p className="text-[#3BAF4A]">1800-123-4567</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="w-6 h-6 text-[#E8C23A] flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700 mb-1">Support Hours</p>
                <p className="text-[#1B263B]">Mon-Fri: 9 AM - 6 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
