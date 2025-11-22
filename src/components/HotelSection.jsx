import React from 'react';

const HotelSection = ({ hotels, onChange }) => {
  const handleHotelChange = (index, field, value) => {
    const updatedHotels = [...hotels];
    updatedHotels[index] = {
      ...updatedHotels[index],
      [field]: field.includes('Cost') ? parseFloat(value) || 0 : value,
    };
    onChange(updatedHotels);
  };

  const addHotel = () => {
    onChange([
      ...hotels,
      {
        name: '',
        category: '3*',
        packageCostPerPerson: 0,
        packageCostPerChild: 0,
      },
    ]);
  };

  const removeHotel = (index) => {
    if (hotels.length > 1) {
      const updatedHotels = hotels.filter((_, i) => i !== index);
      onChange(updatedHotels);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold text-gray-900">Hotel Options</h4>
          <p className="text-sm text-gray-600">Provide multiple accommodation choices</p>
        </div>
        <button
          type="button"
          onClick={addHotel}
          className="btn-secondary flex items-center gap-2 text-sm px-4 py-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Hotel
        </button>
      </div>

      <div className="space-y-4">
        {hotels.map((hotel, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-primary-200 transition-all duration-300 relative group"
          >
            {/* Remove Button */}
            {hotels.length > 1 && (
              <button
                type="button"
                onClick={() => removeHotel(index)}
                className="absolute -top-2 -right-2 h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                title="Remove this hotel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Hotel Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-gray-700">Hotel Option {index + 1}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hotel Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hotel Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={hotel.name}
                  onChange={(e) => handleHotelChange(index, 'name', e.target.value)}
                  placeholder="e.g., IBIS Frazer Park"
                  className="input-field"
                  required
                />
              </div>

              {/* Hotel Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={hotel.category}
                  onChange={(e) => handleHotelChange(index, 'category', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="3*">3 Star</option>
                  <option value="4*">4 Star</option>
                  <option value="5*">5 Star</option>
                </select>
              </div>

              {/* Package Cost Per Person */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cost Per Person (INR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={hotel.packageCostPerPerson}
                  onChange={(e) => handleHotelChange(index, 'packageCostPerPerson', e.target.value)}
                  placeholder="21400"
                  min="0"
                  step="100"
                  className="input-field"
                  required
                />
              </div>

              {/* Package Cost Per Child */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cost Per Child (INR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={hotel.packageCostPerChild}
                  onChange={(e) => handleHotelChange(index, 'packageCostPerChild', e.target.value)}
                  placeholder="17000"
                  min="0"
                  step="100"
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelSection;

