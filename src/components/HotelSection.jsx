import React from 'react';
import ImageUpload from './ImageUpload';

const HotelSection = ({ hotels, onChange, mealPlanOptions = [] }) => {
  const handleHotelChange = (index, field, value) => {
    const updatedHotels = [...hotels];
    updatedHotels[index] = {
      ...updatedHotels[index],
      [field]: field === 'numberOfRooms' ? parseInt(value) || 0 : value,
    };
    onChange(updatedHotels);
  };

  const addHotel = () => {
    onChange([
      ...hotels,
      {
        nightNumber: hotels.length + 1,
        location: '',
        checkInDate: '',
        name: '',
        starRating: '3*',
        roomType: '',
        numberOfRooms: 1,
        paxDistribution: '',
        mealPlan: 'BREAKFAST',
        imageUrl: '',
      },
    ]);
  };

  const removeHotel = (index) => {
    if (hotels.length > 1) {
      const updatedHotels = hotels.filter((_, i) => i !== index);
      // Renumber nights
      updatedHotels.forEach((hotel, i) => {
        hotel.nightNumber = i + 1;
      });
      onChange(updatedHotels);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold text-gray-900">Accommodation Options</h4>
          <p className="text-sm text-gray-600">One hotel entry per night</p>
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
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-200 relative group hover:shadow-lg transition-all duration-300"
          >
            {/* Night Number Badge */}
            <div className="absolute -top-3 -left-3 h-12 w-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">Night {hotel.nightNumber}</span>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={hotel.location}
                  onChange={(e) => handleHotelChange(index, 'location', e.target.value)}
                  placeholder="Port Blair"
                  className="input-field"
                  required
                />
              </div>

              {/* Check-in Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Check-in Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={hotel.checkInDate}
                  onChange={(e) => handleHotelChange(index, 'checkInDate', e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              {/* Hotel Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hotel Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={hotel.name}
                  onChange={(e) => handleHotelChange(index, 'name', e.target.value)}
                  placeholder="Sea Shell Resort"
                  className="input-field"
                  required
                />
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Star Rating <span className="text-red-500">*</span>
                </label>
                <select
                  value={hotel.starRating}
                  onChange={(e) => handleHotelChange(index, 'starRating', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="3*">3 Star</option>
                  <option value="4*">4 Star</option>
                  <option value="5*">5 Star</option>
                  <option value="Resort">Resort</option>
                  <option value="Budget">Budget</option>
                </select>
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Room Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={hotel.roomType}
                  onChange={(e) => handleHotelChange(index, 'roomType', e.target.value)}
                  placeholder="Deluxe Sea View"
                  className="input-field"
                  required
                />
              </div>

              {/* Number of Rooms */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Rooms <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={hotel.numberOfRooms}
                  onChange={(e) => handleHotelChange(index, 'numberOfRooms', e.target.value)}
                  placeholder="2"
                  min="1"
                  className="input-field"
                  required
                />
              </div>

              {/* Pax Distribution */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pax Distribution <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={hotel.paxDistribution}
                  onChange={(e) => handleHotelChange(index, 'paxDistribution', e.target.value)}
                  placeholder="2 Adults + 1 Child per room"
                  className="input-field"
                  required
                />
              </div>

              {/* Meal Plan */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Meal Plan <span className="text-red-500">*</span>
                </label>
                <select
                  value={hotel.mealPlan}
                  onChange={(e) => handleHotelChange(index, 'mealPlan', e.target.value)}
                  className="input-field"
                  required
                >
                  {mealPlanOptions.length > 0 ? (
                    mealPlanOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="BREAKFAST">Breakfast Only</option>
                      <option value="HALF BOARD">Half Board</option>
                      <option value="FULL BOARD">Full Board</option>
                      <option value="ALL INCLUSIVE">All Inclusive</option>
                    </>
                  )}
                </select>
              </div>

              {/* Hotel Image Upload */}
              <div className="md:col-span-2">
                <ImageUpload
                  label="Hotel Image"
                  value={hotel.imageUrl || ''}
                  onChange={(url) => handleHotelChange(index, 'imageUrl', url)}
                  required={false}
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



