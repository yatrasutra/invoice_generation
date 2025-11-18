import React, { useState } from 'react';

const SubmissionModal = ({ submission, onClose, onApprove, onReject }) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectMessage, setRejectMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleApprove = async () => {
    setProcessing(true);
    await onApprove(submission.id);
    setProcessing(false);
  };

  const handleReject = async () => {
    if (!rejectMessage.trim()) {
      alert('Please provide a rejection message');
      return;
    }
    setProcessing(true);
    await onReject(submission.id, rejectMessage);
    setProcessing(false);
  };

  const fieldLabels = {
    clientName: 'Client Name',
    email: 'Email Address',
    contactNo: 'Contact Number',
    destination: 'Destination',
    duration: 'Duration (Nights)',
    checkInDate: 'Check-in Date',
    checkOutDate: 'Check-out Date',
    numberOfAdults: 'Number of Adults',
    packageType: 'Package Type',
    mealPlan: 'Meal Plan',
    costPerAdult: 'Cost per Adult (INR)',
    additionalServices: 'Additional Services',
    advanceAmount: 'Advance Amount (INR)',
    paymentMode: 'Payment Mode',
    terms: 'Terms Accepted',
    // Legacy fields for backward compatibility
    fullName: 'Full Name',
    phone: 'Phone Number',
    dateOfBirth: 'Date of Birth',
    address: 'Address',
    occupation: 'Occupation',
    country: 'Country',
    experience: 'Years of Experience',
    comments: 'Additional Comments',
  };

  const packageTypeMap = {
    deluxe: 'Deluxe',
    standard: 'Standard',
    premium: 'Premium',
    luxury: 'Luxury',
  };

  const mealPlanMap = {
    MAP: 'MAP (Breakfast & Dinner)',
    CP: 'CP (Breakfast Only)',
    AP: 'AP (All Meals)',
    EP: 'EP (No Meals)',
  };

  const countryMap = {
    us: 'United States',
    uk: 'United Kingdom',
    ca: 'Canada',
    au: 'Australia',
    other: 'Other',
  };

  const formatValue = (key, value) => {
    if (key === 'terms') {
      return value ? 'Yes' : 'No';
    }
    if (key === 'packageType' && packageTypeMap[value]) {
      return packageTypeMap[value];
    }
    if (key === 'mealPlan' && mealPlanMap[value]) {
      return mealPlanMap[value];
    }
    if (key === 'country' && countryMap[value]) {
      return countryMap[value];
    }
    if ((key === 'checkInDate' || key === 'checkOutDate' || key === 'dateOfBirth') && value) {
      return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    if ((key === 'costPerAdult' || key === 'advanceAmount') && value) {
      return `₹${parseFloat(value).toLocaleString('en-IN')}`;
    }
    if (key === 'duration' && value) {
      return `${value} Nights`;
    }
    return value || 'N/A';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Submission Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
            <div className="mb-4">
              <span
                className={`badge ${
                  submission.status === 'pending'
                    ? 'badge-pending'
                    : submission.status === 'approved'
                    ? 'badge-approved'
                    : 'badge-rejected'
                }`}
              >
                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
              </span>
              <p className="text-sm text-gray-600 mt-2">
                Submitted: {new Date(submission.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.entries(submission.data).map(([key, value]) => (
                  <div key={key} className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      {fieldLabels[key] || key.replace(/([A-Z])/g, ' $1').trim()}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatValue(key, value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {submission.pdfUrl && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <a
                  href={submission.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  View Generated PDF
                </a>
              </div>
            )}

            {submission.adminMessage && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-1">Admin Message:</p>
                <p className="text-sm text-gray-700">{submission.adminMessage}</p>
              </div>
            )}

            {showRejectForm && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Message
                </label>
                <textarea
                  value={rejectMessage}
                  onChange={(e) => setRejectMessage(e.target.value)}
                  rows="3"
                  className="input-field"
                  placeholder="Provide a reason for rejection..."
                />
              </div>
            )}
          </div>

          {/* Footer */}
          {submission.status === 'pending' && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              {!showRejectForm ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={processing}
                    className="btn-success flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : 'Approve & Generate PDF'}
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="btn-danger flex-1"
                  >
                    Reject
                  </button>
                  <button onClick={onClose} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    disabled={processing}
                    className="btn-danger flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : 'Confirm Rejection'}
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectMessage('');
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {submission.status !== 'pending' && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <button onClick={onClose} className="btn-secondary w-full">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;

