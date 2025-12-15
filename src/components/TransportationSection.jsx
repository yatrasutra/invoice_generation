import React from 'react';

const TransportationSection = ({ transportation, onChange }) => {
  const handleTransportChange = (index, field, value) => {
    const updated = [...transportation];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const addTransportation = () => {
    onChange([
      ...transportation,
      {
        day: '',
        serviceDescription: '',
        vehicleType: '',
        ticketsIncluded: '',
        ferryDetails: '',
      },
    ]);
  };

  const removeTransportation = (index) => {
    const updated = transportation.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold text-gray-900">Transportation & Activities</h4>
          <p className="text-sm text-gray-600">Day-wise transport and activity details</p>
        </div>
        <button
          type="button"
          onClick={addTransportation}
          className="btn-secondary flex items-center gap-2 text-sm px-4 py-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Entry
        </button>
      </div>

      {transportation.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <p className="text-sm text-gray-600">No transportation entries yet. Click "Add Entry" to start.</p>
        </div>
      )}

      <div className="space-y-4">
        {transportation.map((item, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 border-2 border-purple-200 relative group hover:shadow-lg transition-all duration-300"
          >
            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeTransportation(index)}
              className="absolute -top-2 -right-2 h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              title="Remove this entry"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Entry Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="text-sm font-bold text-gray-700">Entry {index + 1}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Day */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Day <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={item.day}
                  onChange={(e) => handleTransportChange(index, 'day', e.target.value)}
                  placeholder="e.g., 1st Day, Wed 11 Feb"
                  className="input-field"
                  required
                />
              </div>

              {/* Service Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={item.serviceDescription}
                  onChange={(e) => handleTransportChange(index, 'serviceDescription', e.target.value)}
                  placeholder="Airport pickup, ferry transfer, sightseeing"
                  className="input-field"
                  required
                />
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <input
                  type="text"
                  value={item.vehicleType}
                  onChange={(e) => handleTransportChange(index, 'vehicleType', e.target.value)}
                  placeholder="Xylo / Ertiga / Innova"
                  className="input-field"
                />
              </div>

              {/* Tickets Included */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tickets Included
                </label>
                <input
                  type="text"
                  value={item.ticketsIncluded}
                  onChange={(e) => handleTransportChange(index, 'ticketsIncluded', e.target.value)}
                  placeholder="Cellular Jail Entry Ticket – 4 Adults + 1 Child"
                  className="input-field"
                />
              </div>

              {/* Ferry Details */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ferry Details
                </label>
                <input
                  type="text"
                  value={item.ferryDetails}
                  onChange={(e) => handleTransportChange(index, 'ferryDetails', e.target.value)}
                  placeholder="Operator, duration, category"
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

export default TransportationSection;


