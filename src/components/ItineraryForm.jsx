import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { itineraryAPI } from '../services/api';
import DayItinerarySection from './DayItinerarySection';
import HotelSection from './HotelSection';
import InclusionsExclusionsEditor from './InclusionsExclusionsEditor';

const ItineraryForm = ({ onSuccess }) => {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [days, setDays] = useState([
    { dayNumber: 1, title: '', description: '' },
  ]);
  const [hotels, setHotels] = useState([
    { name: '', category: '3*', packageCostPerPerson: 0, packageCostPerChild: 0 },
  ]);
  const [inclusions, setInclusions] = useState([]);
  const [customInclusions, setCustomInclusions] = useState('');
  const [exclusions, setExclusions] = useState([]);
  const [customExclusions, setCustomExclusions] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      destination: '',
      travelDate: '',
      duration: 3,
      adults: 2,
      children: 0,
      infants: 0,
      hotelCategory: '3*',
      mealPlan: 'BREAKFAST',
      transferPlan: 'PRIVATE',
      acceptTerms: false,
    },
  });

  useEffect(() => {
    fetchSchema();
  }, []);

  const fetchSchema = async () => {
    try {
      const response = await itineraryAPI.getSchema();
      setSchema(response.data);
      
      // Set default inclusions/exclusions from schema
      if (response.data.metadata?.inclusionsList) {
        setInclusions(response.data.metadata.inclusionsList.slice(0, 3)); // Pre-select first 3
      }
      if (response.data.metadata?.exclusionsList) {
        setExclusions(response.data.metadata.exclusionsList.slice(0, 2)); // Pre-select first 2
      }
    } catch (error) {
      console.error('Error fetching schema:', error);
      setError('Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    setError('');

    // Validate days
    if (days.length === 0) {
      setError('Please add at least one day to the itinerary');
      setSubmitting(false);
      return;
    }

    const emptyDay = days.find(d => !d.title.trim() || !d.description.trim());
    if (emptyDay) {
      setError(`Day ${emptyDay.dayNumber}: Please fill in both title and description`);
      setSubmitting(false);
      return;
    }

    // Validate hotels
    if (hotels.length === 0) {
      setError('Please add at least one hotel option');
      setSubmitting(false);
      return;
    }

    const emptyHotel = hotels.find(h => !h.name.trim() || h.packageCostPerPerson <= 0);
    if (emptyHotel) {
      setError('Please fill in all hotel details with valid pricing');
      setSubmitting(false);
      return;
    }

    // Validate inclusions/exclusions
    if (inclusions.length === 0) {
      setError('Please add at least one inclusion');
      setSubmitting(false);
      return;
    }

    try {
      const submissionData = {
        ...formData,
        days,
        hotels,
        inclusions,
        customInclusions,
        exclusions,
        customExclusions,
      };

      await itineraryAPI.submitItinerary(submissionData);
      onSuccess && onSuccess();
    } catch (error) {
      console.error('Error submitting itinerary:', error);
      setError(error.response?.data?.error || 'Failed to submit itinerary');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDayChange = (index, updatedDay) => {
    const updatedDays = [...days];
    updatedDays[index] = updatedDay;
    setDays(updatedDays);
  };

  const addDay = () => {
    setDays([
      ...days,
      { dayNumber: days.length + 1, title: '', description: '' },
    ]);
  };

  const removeDay = (index) => {
    if (days.length > 1) {
      const updatedDays = days.filter((_, i) => i !== index);
      // Renumber days
      updatedDays.forEach((day, i) => {
        day.dayNumber = i + 1;
      });
      setDays(updatedDays);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error && !schema) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-primary-600 to-blue-600 p-8 shadow-travel">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-white text-sm font-semibold">Create Custom Itinerary</span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Design Your Travel Brochure</h2>
          <p className="text-primary-50 text-lg">
            Create a detailed itinerary with day-by-day plans, hotel options, and package details
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="card">
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-start gap-3 animate-slide-in">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Section 1: Basic Travel Information */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Basic Travel Information</h3>
                <p className="text-sm text-gray-600">Essential details about the trip</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Destination <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('destination', { required: 'Destination is required' })}
                  type="text"
                  placeholder="e.g., KUALA LUMPUR"
                  className="input-field"
                />
                {errors.destination && (
                  <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Travel Date <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('travelDate', { required: 'Travel date is required' })}
                  type="text"
                  placeholder="e.g., Nov 2025"
                  className="input-field"
                />
                {errors.travelDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.travelDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration (Nights) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('duration', { 
                    required: 'Duration is required',
                    min: { value: 1, message: 'Minimum 1 night' }
                  })}
                  type="number"
                  min="1"
                  placeholder="3"
                  className="input-field"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adults <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('adults', { 
                    required: 'Number of adults is required',
                    min: { value: 1, message: 'Minimum 1 adult' }
                  })}
                  type="number"
                  min="1"
                  placeholder="2"
                  className="input-field"
                />
                {errors.adults && (
                  <p className="mt-1 text-sm text-red-600">{errors.adults.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Children
                </label>
                <input
                  {...register('children', { min: { value: 0, message: 'Cannot be negative' } })}
                  type="number"
                  min="0"
                  placeholder="0"
                  className="input-field"
                />
                {errors.children && (
                  <p className="mt-1 text-sm text-red-600">{errors.children.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Infants
                </label>
                <input
                  {...register('infants', { min: { value: 0, message: 'Cannot be negative' } })}
                  type="number"
                  min="0"
                  placeholder="0"
                  className="input-field"
                />
                {errors.infants && (
                  <p className="mt-1 text-sm text-red-600">{errors.infants.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hotel Category <span className="text-red-500">*</span>
                </label>
                <select {...register('hotelCategory')} className="input-field">
                  <option value="3*">3 Star</option>
                  <option value="4*">4 Star</option>
                  <option value="5*">5 Star</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Meal Plan <span className="text-red-500">*</span>
                </label>
                <select {...register('mealPlan')} className="input-field">
                  <option value="BREAKFAST">Breakfast Only</option>
                  <option value="HALF BOARD">Half Board</option>
                  <option value="FULL BOARD">Full Board</option>
                  <option value="ALL INCLUSIVE">All Inclusive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transfer Plan <span className="text-red-500">*</span>
                </label>
                <select {...register('transferPlan')} className="input-field">
                  <option value="PRIVATE">Private</option>
                  <option value="SHARED">Shared</option>
                  <option value="SIC">SIC (Seat in Coach)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Day-by-Day Itinerary */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Day-by-Day Itinerary</h3>
                  <p className="text-sm text-gray-600">Plan each day's activities and highlights</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addDay}
                className="btn-primary flex items-center gap-2 text-sm px-5 py-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Day
              </button>
            </div>

            <div className="space-y-5">
              {days.map((day, index) => (
                <DayItinerarySection
                  key={index}
                  day={day}
                  index={index}
                  onChange={handleDayChange}
                  onRemove={removeDay}
                  canRemove={days.length > 1}
                />
              ))}
            </div>
          </div>

          {/* Section 3: Hotel Options */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Accommodation Details</h3>
                <p className="text-sm text-gray-600">Provide hotel options with package pricing</p>
              </div>
            </div>
            <HotelSection hotels={hotels} onChange={setHotels} />
          </div>

          {/* Section 4: Inclusions */}
          <div>
            <InclusionsExclusionsEditor
              title="Package Inclusions"
              items={inclusions}
              customText={customInclusions}
              onItemsChange={setInclusions}
              onCustomTextChange={setCustomInclusions}
              predefinedItems={schema?.metadata?.inclusionsList || []}
              type="inclusions"
            />
          </div>

          {/* Section 5: Exclusions */}
          <div>
            <InclusionsExclusionsEditor
              title="Package Exclusions"
              items={exclusions}
              customText={customExclusions}
              onItemsChange={setExclusions}
              onCustomTextChange={setCustomExclusions}
              predefinedItems={schema?.metadata?.exclusionsList || []}
              type="exclusions"
            />
          </div>

          {/* Terms & Submit */}
          <div className="pt-6 border-t-2 border-gray-100">
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-4 mb-5">
                <div className="h-12 w-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">Booking Policy & Terms</h4>
                  <div className="text-sm text-gray-700 space-y-2 mt-3">
                    {schema?.metadata?.bookingPolicy && (
                      <>
                        <p className="font-semibold">Payment Policy:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Passport copy with 50% payment required as advance</li>
                          <li>Full payment required 15 days prior to travel date</li>
                        </ul>
                        <p className="font-semibold mt-3">Cancellation Policy:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Before 15 days: 75% refund</li>
                          <li>Before 10 days: 100% cancellation charge</li>
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white rounded-xl p-4">
                <input
                  {...register('acceptTerms', { required: 'You must accept the terms' })}
                  type="checkbox"
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
                />
                <label className="text-sm font-medium text-gray-700 cursor-pointer">
                  I confirm that all information provided is accurate and I agree to the booking policy
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="mt-2 text-sm text-red-600 ml-8">{errors.acceptTerms.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-5 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="font-semibold">Submitting Itinerary...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <span className="font-semibold">Submit Itinerary for Approval</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItineraryForm;

