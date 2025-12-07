import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { itineraryAPI } from '../services/api';
import DayItinerarySection from './DayItinerarySection';
import HotelSection from './HotelSection';
import InclusionsExclusionsEditor from './InclusionsExclusionsEditor';
import TransportationSection from './TransportationSection';
import ActivityRateCardSection from './ActivityRateCardSection';
import ImageUpload from './ImageUpload';

const ItineraryForm = ({ onSuccess }) => {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [days, setDays] = useState([
    { dayNumber: 1, date: '', title: '', description: '', ticketInclusion: '', imageUrl: '' },
  ]);
  const [hotels, setHotels] = useState([
    { 
      nightNumber: 1, 
      location: '', 
      checkInDate: '', 
      name: '', 
      starRating: '3*', 
      roomType: '', 
      numberOfRooms: 1, 
      paxDistribution: '', 
      mealPlan: 'BREAKFAST',
      imageUrl: ''
    },
  ]);
  const [transportation, setTransportation] = useState([]);
  const [activityRateCard, setActivityRateCard] = useState([]);
  const [inclusions, setInclusions] = useState([]);
  const [customInclusions, setCustomInclusions] = useState('');
  const [exclusions, setExclusions] = useState([]);
  const [customExclusions, setCustomExclusions] = useState('');
  const [coverHeroImageUrl, setCoverHeroImageUrl] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      guestName: '',
      destination: '',
      startDate: '',
      duration: '',
      tripId: '',
      quotePrice: '',
      paymentNote: 'Book Now – Pay 50% to Confirm',
      adults: 2,
      children: 0,
      infants: 0,
      hotelCategory: '3*',
      mealPlan: 'BREAKFAST',
      transferPlan: 'PRIVATE',
      consultantName: '',
      consultantPosition: '',
      consultantMobile: '',
      consultantEmail: '',
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

    const emptyDay = days.find(d => !d.title.trim() || !d.description.trim() || !d.date);
    if (emptyDay) {
      setError(`Day ${emptyDay.dayNumber}: Please fill in date, title and description`);
      setSubmitting(false);
      return;
    }

    // Validate hotels
    if (hotels.length === 0) {
      setError('Please add at least one hotel option');
      setSubmitting(false);
      return;
    }

    const emptyHotel = hotels.find(h => !h.name.trim() || !h.location.trim() || !h.checkInDate || !h.roomType.trim() || !h.paxDistribution.trim());
    if (emptyHotel) {
      setError(`Night ${emptyHotel.nightNumber}: Please fill in all hotel details`);
      setSubmitting(false);
      return;
    }

    // Validate inclusions/exclusions
    if (inclusions.length === 0) {
      setError('Please select at least one inclusion');
      setSubmitting(false);
      return;
    }

    try {
      const submissionData = {
        ...formData,
        days,
        hotels,
        transportation,
        activityRateCard,
        inclusions,
        customInclusions,
        exclusions,
        customExclusions,
        coverHeroImageUrl,
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
      { dayNumber: days.length + 1, date: '', title: '', description: '', ticketInclusion: '', imageUrl: '' },
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

  // Get meal plan options from schema
  const mealPlanOptions = [
    { value: 'BREAKFAST', label: 'Breakfast Only' },
    { value: 'HALF BOARD', label: 'Half Board' },
    { value: 'FULL BOARD', label: 'Full Board' },
    { value: 'ALL INCLUSIVE', label: 'All Inclusive' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-primary-600 to-orange-500 p-8 shadow-travel">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-white text-sm font-semibold">Yatrasutra Holidays - Itinerary Generator</span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Create Custom Itinerary PDF</h2>
          <p className="text-primary-50 text-lg">
            Design a detailed travel itinerary with day-by-day plans, hotel options, and package details for your clients
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
          {/* Section 1: Cover Page Details */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Cover Page Details</h3>
                <p className="text-sm text-gray-600">Guest information and trip summary</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Guest Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Guest Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('guestName', { required: 'Guest name is required' })}
                  type="text"
                  placeholder="John Doe"
                  className="input-field"
                />
                {errors.guestName && (
                  <p className="mt-1 text-sm text-red-600">{errors.guestName.message}</p>
                )}
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Destination <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('destination', { required: 'Destination is required' })}
                  type="text"
                  placeholder="Port Blair"
                  className="input-field"
                />
                {errors.destination && (
                  <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('startDate', { required: 'Start date is required' })}
                  type="date"
                  className="input-field"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration (Nights / Days) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('duration', { required: 'Duration is required' })}
                  type="text"
                  placeholder="3 Nights / 4 Days"
                  className="input-field"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                )}
              </div>

              {/* Trip ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trip ID <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('tripId', { required: 'Trip ID is required' })}
                  type="text"
                  placeholder="YS-2025-001"
                  className="input-field"
                />
                {errors.tripId && (
                  <p className="mt-1 text-sm text-red-600">{errors.tripId.message}</p>
                )}
              </div>

              {/* Quote Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quote Price (Total in INR) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('quotePrice', { 
                    required: 'Quote price is required',
                    min: { value: 1, message: 'Price must be greater than 0' }
                  })}
                  type="number"
                  placeholder="85000"
                  min="1"
                  step="100"
                  className="input-field"
                />
                {errors.quotePrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.quotePrice.message}</p>
                )}
              </div>

              {/* Payment Note */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Note
                </label>
                <input
                  {...register('paymentNote')}
                  type="text"
                  placeholder="Book Now – Pay 50% to Confirm"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Passenger Details */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Passenger Details</h3>
                <p className="text-sm text-gray-600">Number of travelers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Adults */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adults <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('adults', { 
                    required: 'Number of adults is required',
                    min: { value: 1, message: 'Minimum 1 adult' },
                    max: { value: 50, message: 'Maximum 50 adults' }
                  })}
                  type="number"
                  min="1"
                  max="50"
                  placeholder="2"
                  className="input-field"
                />
                {errors.adults && (
                  <p className="mt-1 text-sm text-red-600">{errors.adults.message}</p>
                )}
              </div>

              {/* Children */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Children
                </label>
                <input
                  {...register('children', { 
                    min: { value: 0, message: 'Cannot be negative' },
                    max: { value: 20, message: 'Maximum 20 children' }
                  })}
                  type="number"
                  min="0"
                  max="20"
                  placeholder="1"
                  className="input-field"
                />
                {errors.children && (
                  <p className="mt-1 text-sm text-red-600">{errors.children.message}</p>
                )}
              </div>

              {/* Infants */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Infants
                </label>
                <input
                  {...register('infants', { 
                    min: { value: 0, message: 'Cannot be negative' },
                    max: { value: 10, message: 'Maximum 10 infants' }
                  })}
                  type="number"
                  min="0"
                  max="10"
                  placeholder="0"
                  className="input-field"
                />
                {errors.infants && (
                  <p className="mt-1 text-sm text-red-600">{errors.infants.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Trip Configuration */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Trip Configuration</h3>
                <p className="text-sm text-gray-600">Hotel, meal, and transfer preferences</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Hotel Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hotel Category <span className="text-red-500">*</span>
                </label>
                <select {...register('hotelCategory')} className="input-field">
                  <option value="3*">3 Star</option>
                  <option value="4*">4 Star</option>
                  <option value="5*">5 Star</option>
                  <option value="Resort">Resort</option>
                  <option value="Budget">Budget</option>
                </select>
              </div>

              {/* Meal Plan */}
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

              {/* Transfer Plan */}
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

          {/* Section 4: Cover Hero Image */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-pink-100 rounded-xl flex items-center justify-center">
                <svg className="h-5 w-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Cover Page Hero Image</h3>
                <p className="text-sm text-gray-600">Main destination image for the cover page</p>
              </div>
            </div>

            <ImageUpload
              label="Hero Image"
              value={coverHeroImageUrl}
              onChange={setCoverHeroImageUrl}
              required={false}
            />
          </div>

          {/* Section 5: Day-by-Day Itinerary */}
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

          {/* Section 6: Hotel Options */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Accommodation Details</h3>
                <p className="text-sm text-gray-600">Hotel information for each night</p>
              </div>
            </div>
            <HotelSection hotels={hotels} onChange={setHotels} mealPlanOptions={mealPlanOptions} />
          </div>

          {/* Section 7: Transportation & Activities */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Transportation & Activities (Optional)</h3>
                <p className="text-sm text-gray-600">Day-wise transport and activity details</p>
              </div>
            </div>
            <TransportationSection transportation={transportation} onChange={setTransportation} />
          </div>

          {/* Section 8: Inclusions */}
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

          {/* Section 9: Exclusions */}
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

          {/* Section 10: Activity Rate Card */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <svg className="h-5 w-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Optional Activities</h3>
                <p className="text-sm text-gray-600">Add-on activities and pricing</p>
              </div>
            </div>
            <ActivityRateCardSection activities={activityRateCard} onChange={setActivityRateCard} />
          </div>

          {/* Section 11: Consultant Information */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Travel Consultant Information</h3>
                <p className="text-sm text-gray-600">Your contact details for the client</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Consultant Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Consultant Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('consultantName', { required: 'Consultant name is required' })}
                  type="text"
                  placeholder="Rajesh Kumar"
                  className="input-field"
                />
                {errors.consultantName && (
                  <p className="mt-1 text-sm text-red-600">{errors.consultantName.message}</p>
                )}
              </div>

              {/* Consultant Position */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('consultantPosition', { required: 'Position is required' })}
                  type="text"
                  placeholder="Travel Consultant / Senior Executive"
                  className="input-field"
                />
                {errors.consultantPosition && (
                  <p className="mt-1 text-sm text-red-600">{errors.consultantPosition.message}</p>
                )}
              </div>

              {/* Consultant Mobile */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('consultantMobile', { required: 'Mobile number is required' })}
                  type="text"
                  placeholder="+91 98765 43210"
                  className="input-field"
                />
                {errors.consultantMobile && (
                  <p className="mt-1 text-sm text-red-600">{errors.consultantMobile.message}</p>
                )}
              </div>

              {/* Consultant Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('consultantEmail', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  placeholder="rajesh@yatrasutra.com"
                  className="input-field"
                />
                {errors.consultantEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.consultantEmail.message}</p>
                )}
              </div>
            </div>
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
                  I confirm that all information provided is accurate and I agree to the booking policy and terms & conditions
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
