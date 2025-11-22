import React, { useState } from 'react';

const ItineraryModal = ({ submission, onClose, onApprove, onReject }) => {
  const [rejectMessage, setRejectMessage] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(submission.id);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectMessage.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setLoading(true);
    try {
      await onReject(submission.id, rejectMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm" />

        {/* Modal panel */}
        <div
          className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-primary-600 to-blue-600 px-8 py-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Itinerary Details</h3>
                  <p className="text-primary-100 text-sm mt-1">{submission.data?.destination || 'Untitled'}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Basic Travel Information */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Travel Information
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Destination</p>
                    <p className="text-sm font-semibold text-gray-900">{submission.data?.destination}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Travel Date</p>
                    <p className="text-sm font-semibold text-gray-900">{submission.data?.travelDate}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Duration</p>
                    <p className="text-sm font-semibold text-gray-900">{submission.data?.duration} Nights</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Passengers</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {submission.data?.adults}A {submission.data?.children > 0 && `${submission.data.children}C`} {submission.data?.infants > 0 && `${submission.data.infants}I`}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Hotel Category</p>
                    <p className="text-sm font-semibold text-gray-900">{submission.data?.hotelCategory}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Meal Plan</p>
                    <p className="text-sm font-semibold text-gray-900">{submission.data?.mealPlan}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Transfer</p>
                    <p className="text-sm font-semibold text-gray-900">{submission.data?.transferPlan}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Submitted</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(submission.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Day-by-Day Itinerary */}
              {submission.data?.days && submission.data.days.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Itinerary ({submission.data.days.length} Days)
                  </h4>
                  <div className="space-y-3">
                    {submission.data.days.map((day, index) => (
                      <div key={index} className="bg-gradient-to-br from-blue-50 to-primary-50 rounded-xl p-4 border-2 border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">{day.dayNumber}</span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-gray-900 mb-2">{day.title}</h5>
                            <p className="text-sm text-gray-700 leading-relaxed">{day.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hotel Options */}
              {submission.data?.hotels && submission.data.hotels.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Hotel Options
                  </h4>
                  <div className="overflow-x-auto rounded-xl border-2 border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Hotel Name</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Category</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Per Person</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Per Child</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {submission.data.hotels.map((hotel, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">{hotel.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{hotel.category}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">₹{hotel.packageCostPerPerson?.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">₹{hotel.packageCostPerChild?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inclusions */}
                {submission.data?.inclusions && submission.data.inclusions.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Inclusions
                    </h4>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                      <ul className="space-y-2 text-sm text-gray-700">
                        {submission.data.inclusions.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-600 font-bold mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      {submission.data.customInclusions && (
                        <div className="mt-3 pt-3 border-t-2 border-green-200">
                          <p className="text-xs font-bold text-gray-700 mb-1">Additional:</p>
                          <p className="text-sm text-gray-700">{submission.data.customInclusions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Exclusions */}
                {submission.data?.exclusions && submission.data.exclusions.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Exclusions
                    </h4>
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border-2 border-red-200">
                      <ul className="space-y-2 text-sm text-gray-700">
                        {submission.data.exclusions.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-600 font-bold mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      {submission.data.customExclusions && (
                        <div className="mt-3 pt-3 border-t-2 border-red-200">
                          <p className="text-xs font-bold text-gray-700 mb-1">Additional:</p>
                          <p className="text-sm text-gray-700">{submission.data.customExclusions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          {submission.status === 'pending' && (
            <div className="bg-gray-50 px-8 py-6 border-t-2 border-gray-200">
              {!showRejectForm ? (
                <div className="flex items-center justify-end gap-4">
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="px-6 py-3 bg-white border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {loading ? 'Approving...' : 'Approve & Generate PDF'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reason for Rejection
                    </label>
                    <textarea
                      value={rejectMessage}
                      onChange={(e) => setRejectMessage(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Explain why this itinerary is being rejected..."
                    />
                  </div>
                  <div className="flex items-center justify-end gap-4">
                    <button
                      onClick={() => setShowRejectForm(false)}
                      className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={loading || !rejectMessage.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50"
                    >
                      {loading ? 'Rejecting...' : 'Confirm Rejection'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {submission.status !== 'pending' && (
            <div className="bg-gray-50 px-8 py-4 border-t-2 border-gray-200">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-4 py-2 rounded-xl font-semibold ${
                  submission.status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </span>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryModal;

