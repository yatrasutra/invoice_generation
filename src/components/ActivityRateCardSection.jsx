import React from 'react';

const ActivityRateCardSection = ({ activities, onChange }) => {
  const handleActivityChange = (index, field, value) => {
    const updated = [...activities];
    updated[index] = {
      ...updated[index],
      [field]: field === 'pricePerPerson' ? parseFloat(value) || 0 : value,
    };
    onChange(updated);
  };

  const addActivity = () => {
    onChange([
      ...activities,
      {
        activityName: '',
        pricePerPerson: 0,
        note: '',
      },
    ]);
  };

  const removeActivity = (index) => {
    const updated = activities.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold text-gray-900">Activity Rate Card (Optional)</h4>
          <p className="text-sm text-gray-600">Add optional activities and pricing</p>
        </div>
        <button
          type="button"
          onClick={addActivity}
          className="btn-secondary flex items-center gap-2 text-sm px-4 py-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Activity
        </button>
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-600">No activities yet. Click "Add Activity" to include optional activities.</p>
        </div>
      )}

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-5 border-2 border-teal-200 relative group hover:shadow-lg transition-all duration-300"
          >
            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeActivity(index)}
              className="absolute -top-2 -right-2 h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              title="Remove this activity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Activity Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-gray-700">Activity {index + 1}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Activity Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Activity Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={activity.activityName}
                  onChange={(e) => handleActivityChange(index, 'activityName', e.target.value)}
                  placeholder="Scuba Diving"
                  className="input-field"
                  required
                />
              </div>

              {/* Price Per Person */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Per Person (INR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={activity.pricePerPerson}
                  onChange={(e) => handleActivityChange(index, 'pricePerPerson', e.target.value)}
                  placeholder="3500"
                  min="0"
                  step="100"
                  className="input-field"
                  required
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Note
                </label>
                <input
                  type="text"
                  value={activity.note}
                  onChange={(e) => handleActivityChange(index, 'note', e.target.value)}
                  placeholder="Weather subject, government rules, etc."
                  className="input-field"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityRateCardSection;


