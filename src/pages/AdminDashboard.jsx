import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI, adminItineraryAPI } from '../services/api';
import SubmissionModal from '../components/SubmissionModal';
import ItineraryModal from '../components/ItineraryModal';
import { 
  AppHeader, 
  NavTab, 
  Toast, 
  Spinner, 
  StatCard, 
  EmptyState,
  FilterTabs,
  StatusBadge 
} from '../components/ui';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [managementType, setManagementType] = useState('itineraries');
  const [submissions, setSubmissions] = useState([]);
  const [itinerarySubmissions, setItinerarySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (managementType === 'invoices') {
      fetchSubmissions();
    } else {
      fetchItinerarySubmissions();
    }
  }, [filter, managementType]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getSubmissions(filter === 'all' ? undefined : filter);
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
      const response = await adminItineraryAPI.getSubmissions(filter === 'all' ? undefined : filter);
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

  const handleApprove = async (submissionId) => {
    try {
      await adminAPI.approveSubmission(submissionId);
      showNotification('Submission approved successfully!', 'success');
      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (error) {
      console.error('Error approving submission:', error);
      showNotification(error.response?.data?.error || 'Failed to approve submission', 'error');
    }
  };

  const handleReject = async (submissionId, message) => {
    try {
      await adminAPI.rejectSubmission(submissionId, message);
      showNotification('Submission rejected', 'success');
      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (error) {
      console.error('Error rejecting submission:', error);
      showNotification(error.response?.data?.error || 'Failed to reject submission', 'error');
    }
  };

  const handleApproveItinerary = async (itineraryId) => {
    try {
      await adminItineraryAPI.approveItinerary(itineraryId);
      showNotification('Itinerary approved successfully!', 'success');
      setSelectedItinerary(null);
      fetchItinerarySubmissions();
    } catch (error) {
      console.error('Error approving itinerary:', error);
      showNotification(error.response?.data?.error || 'Failed to approve itinerary', 'error');
    }
  };

  const handleRejectItinerary = async (itineraryId, message) => {
    try {
      await adminItineraryAPI.rejectItinerary(itineraryId, message);
      showNotification('Itinerary rejected', 'success');
      setSelectedItinerary(null);
      fetchItinerarySubmissions();
    } catch (error) {
      console.error('Error rejecting itinerary:', error);
      showNotification(error.response?.data?.error || 'Failed to reject itinerary', 'error');
    }
  };

  const currentSubmissions = managementType === 'invoices' ? submissions : itinerarySubmissions;
  
  const stats = {
    total: currentSubmissions.length,
    pending: currentSubmissions.filter(s => s.status === 'pending').length,
    approved: currentSubmissions.filter(s => s.status === 'approved').length,
    rejected: currentSubmissions.filter(s => s.status === 'rejected').length,
  };

  const filterOptions = [
    { value: 'all', label: 'All', count: stats.total },
    { value: 'pending', label: 'Pending', count: stats.pending },
    { value: 'approved', label: 'Approved', count: stats.approved },
    { value: 'rejected', label: 'Rejected', count: stats.rejected },
  ];

  // Icons
  const icons = {
    itinerary: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    invoice: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    clock: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    check: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    x: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    download: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AppHeader 
        brandName="Admin Panel" 
        user={user} 
        onLogout={logout}
      >
        <NavTab 
          active={managementType === 'itineraries'} 
          onClick={() => { setManagementType('itineraries'); setFilter('all'); }}
          icon={icons.itinerary}
        >
          Itineraries
        </NavTab>
        <NavTab 
          active={managementType === 'invoices'} 
          onClick={() => { setManagementType('invoices'); setFilter('all'); }}
          icon={icons.invoice}
        >
          Invoices
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
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {managementType === 'itineraries' ? 'Itinerary Submissions' : 'Invoice Submissions'}
            </h1>
            <p className="text-gray-500 mt-1">
              Review and manage {managementType === 'itineraries' ? 'travel itinerary' : 'booking invoice'} requests
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            label={`Total ${managementType === 'itineraries' ? 'Itineraries' : 'Invoices'}`}
            value={stats.total}
            color="primary"
            icon={managementType === 'itineraries' ? icons.itinerary : icons.invoice}
          />
          <StatCard 
            label="Pending Review" 
            value={stats.pending}
            color="warning"
            icon={icons.clock}
          />
          <StatCard 
            label="Approved" 
            value={stats.approved}
            color="success"
            icon={icons.check}
          />
          <StatCard 
            label="Rejected" 
            value={stats.rejected}
            color="error"
            icon={icons.x}
          />
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <FilterTabs 
            filters={filterOptions}
            activeFilter={filter}
            onFilterChange={setFilter}
          />
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : currentSubmissions.length === 0 ? (
          <div className="card">
            <EmptyState 
              title={`No ${filter === 'all' ? '' : filter} ${managementType === 'itineraries' ? 'itineraries' : 'invoices'} found`}
              description={filter === 'all' 
                ? `There are no ${managementType} submissions yet.` 
                : `No ${managementType} with ${filter} status.`}
            />
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {currentSubmissions.map((submission) => (
              <div 
                key={submission.id} 
                className="itinerary-card group"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    {/* Left Content */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        managementType === 'itineraries' 
                          ? 'bg-primary-50 text-primary-600' 
                          : 'bg-blue-50 text-blue-600'
                      }`}>
                        {managementType === 'itineraries' ? icons.itinerary : icons.invoice}
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {managementType === 'itineraries' 
                              ? submission.data?.destination || 'Untitled Itinerary'
                              : submission.data?.clientName || submission.data?.fullName || 'Unknown Client'
                            }
                          </h3>
                          <StatusBadge status={submission.status} />
                        </div>
                        
                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          {managementType === 'itineraries' ? (
                            <>
                              {submission.data?.guestName && (
                                <span className="flex items-center gap-1.5">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  {submission.data.guestName}
                                </span>
                              )}
                              {submission.data?.duration && (
                                <span className="flex items-center gap-1.5">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {submission.data.duration}
                                </span>
                              )}
                              {submission.data?.days && (
                                <span className="flex items-center gap-1.5">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                  </svg>
                                  {submission.data.days.length} Days
                                </span>
                              )}
                            </>
                          ) : (
                            <>
                              {submission.data?.email && (
                                <span className="flex items-center gap-1.5">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  {submission.data.email}
                                </span>
                              )}
                              {submission.data?.destination && (
                                <span className="flex items-center gap-1.5">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {submission.data.destination}
                                </span>
                              )}
                            </>
                          )}
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(submission.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3 ml-4">
                      {submission.status === 'approved' && submission.pdfUrl && (
                        <a
                          href={submission.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-success flex items-center gap-2"
                        >
                          {icons.download}
                          <span className="hidden sm:inline">Download PDF</span>
                        </a>
                      )}
                      <button
                        onClick={() => managementType === 'itineraries' 
                          ? setSelectedItinerary(submission) 
                          : setSelectedSubmission(submission)
                        }
                        className="btn-secondary"
                      >
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Submission Modal */}
      {selectedSubmission && (
        <SubmissionModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* Itinerary Modal */}
      {selectedItinerary && (
        <ItineraryModal
          submission={selectedItinerary}
          onClose={() => setSelectedItinerary(null)}
          onApprove={handleApproveItinerary}
          onReject={handleRejectItinerary}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
