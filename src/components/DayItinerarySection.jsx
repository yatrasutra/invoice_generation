import React from 'react';

const DayItinerarySection = ({ day, index, onChange, onRemove, canRemove }) => {
  const handleChange = (field, value) => {
    onChange(index, { ...day, [field]: value });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-primary-50 rounded-2xl p-6 border-2 border-blue-200 relative group hover:shadow-lg transition-all duration-300">
      {/* Day Number Badge */}
      <div className="absolute -top-3 -left-3 h-12 w-12 bg-gradient-to-br from-primary-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-lg">Day {day.dayNumber}</span>
      </div>

      {/* Remove Button */}
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute -top-3 -right-3 h-10 w-10 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
          title="Remove this day"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="space-y-4 mt-4">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Day Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={day.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., ARRIVAL KUALA LUMPUR - CITY TOUR + KL TOWER"
            className="input-field"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Brief title for this day's activities
          </p>
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Day Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={day.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Detailed description of the day's itinerary..."
            rows="6"
            className="input-field resize-none"
            required
          />
          <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
            <span>Detailed description of activities, timings, and highlights</span>
            <span className={`font-medium ${day.description.length > 500 ? 'text-primary-600' : 'text-gray-400'}`}>
              {day.description.length} characters
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayItinerarySection;

