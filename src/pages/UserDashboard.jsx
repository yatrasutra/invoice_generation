import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formAPI, itineraryAPI } from '../services/api';
import DynamicForm from '../components/DynamicForm';
import SubmissionsList from '../components/SubmissionsList';
import ItineraryForm from '../components/ItineraryForm';
import ItinerarySubmissionsList from '../components/ItinerarySubmissionsList';
import { 
  AppHeader, 
  NavTab, 
  Toast, 
  Spinner, 
  StatCard, 
  EmptyState,
  FilterTabs 
} from '../components/ui';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [submissions, setSubmissions] = useState([]);
  const [itinerarySubmissions, setItinerarySubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Fetch data when switching to relevant tabs
    if (activeTab === 'submissions' || activeTab === 'dashboard') {
      fetchSubmissions();
    }
    if (activeTab === 'itinerary-submissions' || activeTab === 'dashboard') {
      fetchItinerarySubmissions();
    }
  }, [activeTab]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await formAPI.getMySubmissions();
      setSubmissions(response.data.submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      showNotification('Failed to fetch submissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchItinerarySubmissions = async () => {
    setLoading(true);
    try {
      const response = await itineraryAPI.getMySubmissions();
      setItinerarySubmissions(response.data.submissions);
    } catch (error) {
      console.error('Error fetching itinerary submissions:', error);
      showNotification('Failed to fetch itinerary submissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFormSubmit = () => {
    showNotification('Form submitted successfully! Waiting for admin approval.', 'success');
    setActiveTab('submissions');
    fetchSubmissions();
  };

  const handleItinerarySubmit = () => {
    showNotification('Itinerary submitted successfully! Waiting for admin approval.', 'success');
    setActiveTab('itinerary-submissions');
    fetchItinerarySubmissions();
  };

  // Calculate stats
  const stats = {
    totalItineraries: itinerarySubmissions.length,
    pending: itinerarySubmissions.filter(s => s.status === 'pending').length,
    approved: itinerarySubmissions.filter(s => s.status === 'approved').length,
    totalBookings: submissions.length,
  };

  // Icons
  const icons = {
    dashboard: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    itinerary: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    booking: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    plus: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AppHeader 
        brandName="Yatrasutra Holidays" 
        user={user} 
        onLogout={logout}
      >
        <NavTab 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')}
          icon={icons.dashboard}
        >
          Dashboard
        </NavTab>
        <NavTab 
          active={activeTab === 'itinerary-form'} 
          onClick={() => setActiveTab('itinerary-form')}
          icon={icons.plus}
        >
          Create Itinerary
        </NavTab>
        <NavTab 
          active={activeTab === 'itinerary-submissions'} 
          onClick={() => setActiveTab('itinerary-submissions')}
          icon={icons.itinerary}
        >
          My Itineraries
        </NavTab>
        <NavTab 
          active={activeTab === 'form'} 
          onClick={() => setActiveTab('form')}
          icon={icons.booking}
        >
          New Booking
        </NavTab>
        <NavTab 
          active={activeTab === 'submissions'} 
          onClick={() => setActiveTab('submissions')}
        >
          My Bookings
        </NavTab>
      </AppHeader>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50">
          <Toast 
            message={notification.message} 
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile Tab Navigation */}
        <div className="md:hidden mb-6 overflow-x-auto">
          <div className="inline-flex bg-gray-100 p-1 rounded-lg min-w-full">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'dashboard' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('itinerary-form')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'itinerary-form' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setActiveTab('itinerary-submissions')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'itinerary-submissions' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Itineraries
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'submissions' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Bookings
            </button>
          </div>
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.name?.split(' ')[0] || 'there'}
                </h1>
                <p className="text-gray-500 mt-1">
                  Manage your travel itineraries and bookings
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('itinerary-form')}
                className="btn-primary hidden sm:flex"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Itinerary
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                label="Total Itineraries" 
                value={stats.totalItineraries}
                color="primary"
                icon={icons.itinerary}
              />
              <StatCard 
                label="Pending Approval" 
                value={stats.pending}
                color="warning"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard 
                label="Approved" 
                value={stats.approved}
                color="success"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              />
              <StatCard 
                label="Total Bookings" 
                value={stats.totalBookings}
                color="gray"
                icon={icons.booking}
              />
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button 
                  onClick={() => setActiveTab('itinerary-form')}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 text-left"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                    {icons.plus}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Create Itinerary</p>
                    <p className="text-sm text-gray-500">Build a new travel PDF</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('itinerary-submissions')}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 text-left"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    {icons.itinerary}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">View Itineraries</p>
                    <p className="text-sm text-gray-500">Manage your PDFs</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('form')}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 text-left"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    {icons.booking}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">New Booking</p>
                    <p className="text-sm text-gray-500">Create invoice request</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Itineraries */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Itineraries</h3>
                <button 
                  onClick={() => setActiveTab('itinerary-submissions')}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  View all
                </button>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : itinerarySubmissions.length === 0 ? (
                <EmptyState 
                  title="No itineraries yet"
                  description="Create your first travel itinerary to get started"
                  action={() => setActiveTab('itinerary-form')}
                  actionLabel="Create Itinerary"
                />
              ) : (
                <div className="space-y-3">
                  {itinerarySubmissions.slice(0, 5).map((submission) => (
                    <div 
                      key={submission.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-150"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                          {icons.itinerary}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {submission.data?.destination || 'Untitled'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {submission.data?.duration || 'N/A'} | {new Date(submission.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`badge badge-${submission.status}`}>
                          {submission.status}
                        </span>
                        {submission.status === 'approved' && submission.pdfUrl && (
                          <a
                            href={submission.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary text-xs px-3 py-1.5"
                          >
                            Download
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking Form */}
        {activeTab === 'form' && (
          <div className="max-w-3xl animate-fade-in">
            <DynamicForm onSuccess={handleFormSubmit} />
          </div>
        )}

        {/* Submissions List */}
        {activeTab === 'submissions' && (
          <div className="animate-fade-in">
            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <SubmissionsList submissions={submissions} onUpdate={fetchSubmissions} />
            )}
          </div>
        )}

        {/* Itinerary Form */}
        {activeTab === 'itinerary-form' && (
          <div className="max-w-5xl mx-auto animate-fade-in">
            <ItineraryForm onSuccess={handleItinerarySubmit} />
          </div>
        )}

        {/* Itinerary Submissions */}
        {activeTab === 'itinerary-submissions' && (
          <div className="animate-fade-in">
            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <ItinerarySubmissionsList 
                submissions={itinerarySubmissions} 
                onUpdate={fetchItinerarySubmissions} 
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
