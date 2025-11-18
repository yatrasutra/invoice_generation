import React, { useState } from 'react';

const SubmissionsList = ({ submissions, onUpdate }) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Helper to get display name from data
  const getDisplayName = (data) => {
    return data.clientName || data.fullName || 'N/A';
  };

  if (submissions.length === 0) {
    return (
      <div className="card text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by filling out the booking form.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge badge-pending',
      approved: 'badge badge-approved',
      rejected: 'badge badge-rejected',
    };
    return badges[status] || 'badge';
  };

  return (
    <div className="space-y-5">
      {submissions.map((submission) => (
        <div key={submission.id} className="card hover:shadow-travel transition-all duration-300 border-2 border-transparent hover:border-primary-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {getDisplayName(submission.data)}
                  </h3>
                  <span className={getStatusBadge(submission.status)}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 ml-15">
                {submission.data.destination && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{submission.data.destination}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{new Date(submission.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {submission.status === 'pending' && (
                <div className="mt-4 flex items-center gap-3 text-sm bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-3 rounded-xl border-2 border-yellow-200">
                  <div className="h-8 w-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-900">Under Review</p>
                    <p className="text-xs text-yellow-700">Waiting for admin approval</p>
                  </div>
                </div>
              )}

              {submission.status === 'approved' && submission.pdfUrl && (
                <div className="mt-4">
                  <a
                    href={submission.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                    </svg>
                    <span>Download Your Booking Confirmation</span>
                  </a>
                </div>
              )}

              {submission.status === 'rejected' && submission.adminMessage && (
                <div className="mt-4 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-red-900 mb-1">Booking Declined</p>
                      <p className="text-sm text-red-700">{submission.adminMessage}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedSubmission(selectedSubmission?.id === submission.id ? null : submission)}
              className="ml-4 px-5 py-3 bg-white border-2 border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-300 rounded-xl transition-all duration-300 font-semibold flex items-center gap-2"
            >
              <span>{selectedSubmission?.id === submission.id ? 'Hide' : 'View'} Details</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${selectedSubmission?.id === submission.id ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {selectedSubmission?.id === submission.id && (
            <div className="mt-6 pt-6 border-t-2 border-gray-100 animate-slide-up">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900">Complete Booking Details</h4>
              </div>
              <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {Object.entries(submission.data).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-100">
                    <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </dt>
                    <dd className="text-sm font-semibold text-gray-900">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || 'N/A'}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubmissionsList;

