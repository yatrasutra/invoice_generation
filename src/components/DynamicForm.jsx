import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { formAPI } from '../services/api';

const DynamicForm = ({ onSuccess }) => {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchSchema();
  }, []);

  const fetchSchema = async () => {
    try {
      const response = await formAPI.getSchema();
      setSchema(response.data);
    } catch (error) {
      console.error('Error fetching schema:', error);
      setError('Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');

    try {
      await formAPI.submitForm(data);
      onSuccess && onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.response?.data?.error || 'Failed to submit form');
    } finally {
      setSubmitting(false);
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

  const renderField = (field) => {
    const commonProps = {
      ...register(field.name, {
        required: field.required ? `${field.label} is required` : false,
        min: field.min,
        max: field.max,
      }),
      id: field.name,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <input
            {...commonProps}
            type={field.type}
            className="input-field"
          />
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows="4"
            className="input-field"
          />
        );

      case 'select':
        return (
          <select {...commonProps} className="input-field">
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              {...commonProps}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor={field.name} className="ml-2 text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  // Group fields into sections
  const clientFields = schema?.fields?.slice(0, 3) || [];
  const bookingFields = schema?.fields?.slice(3, 10) || [];
  const costFields = schema?.fields?.slice(10) || [];

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-blue-600 p-8 shadow-travel">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-white text-sm font-semibold">Quick & Easy Booking</span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Book Your Dream Tour</h2>
          <p className="text-primary-50 text-lg">
            Fill out the form below and we'll get back to you with confirmation within 24 hours.
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
        {/* Client Details Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
              <p className="text-sm text-gray-600">Tell us about yourself</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {clientFields.map((field) => (
              <div key={field.name} className={field.name === 'clientName' ? 'md:col-span-2' : ''}>
                {field.type !== 'checkbox' && (
                  <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                
                {renderField(field)}

                {errors[field.name] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[field.name].message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Booking Details Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Trip Details</h3>
              <p className="text-sm text-gray-600">Where and when would you like to go?</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bookingFields.map((field) => (
              <div key={field.name}>
                {field.type !== 'checkbox' && (
                  <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                
                {renderField(field)}

                {errors[field.name] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[field.name].message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cost Details Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Pricing & Payment</h3>
              <p className="text-sm text-gray-600">Investment details for your journey</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {costFields.map((field) => (
              <div key={field.name} className={field.name === 'additionalServices' ? 'md:col-span-2' : ''}>
                {field.type !== 'checkbox' && (
                  <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                
                {renderField(field)}

                {errors[field.name] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[field.name].message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 mt-8 border-t-2 border-gray-100">
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">Ready to Submit?</h4>
                <p className="text-sm text-gray-600">
                  By submitting this form, you agree to our terms and conditions. 
                  Our admin team will review your booking and get back to you within 24 hours.
                </p>
              </div>
            </div>
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
                <span className="font-semibold">Processing Your Booking...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <span className="font-semibold">Submit Booking Request</span>
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

export default DynamicForm;

