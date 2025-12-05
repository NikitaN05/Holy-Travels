import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from 'react-query';
import { motion } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  HiUser,
  HiCalendar,
  HiClock,
  HiCurrencyRupee,
  HiPlus,
  HiX,
  HiCheck
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { toursAPI, bookingsAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const Booking = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(null);
  const [step, setStep] = useState(1);

  const { data: tourData, isLoading } = useQuery(
    ['tourForBooking', tourId],
    () => toursAPI.getBySlug(tourId).then(res => res.data.data),
    { enabled: !!tourId }
  );

  const tour = tourData?.tour;

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      passengers: [{ name: user?.name || '', age: '', gender: '', phone: user?.phone || '' }],
      specialRequests: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'passengers'
  });

  const passengers = watch('passengers');

  const createBookingMutation = useMutation(
    (data) => bookingsAPI.create(data),
    {
      onSuccess: (response) => {
        toast.success(t('booking.bookingConfirmed'));
        navigate('/profile');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Booking failed');
      }
    }
  );

  const onSubmit = (data) => {
    if (!selectedDate) {
      toast.error('Please select a travel date');
      return;
    }

    createBookingMutation.mutate({
      tour: tour._id,
      tourDate: selectedDate,
      passengers: data.passengers,
      specialRequests: data.specialRequests
    });
  };

  const calculateTotal = () => {
    if (!tour) return 0;
    const basePrice = tour.price?.discountedAmount || tour.price?.amount;
    const subtotal = basePrice * passengers.length;
    const taxes = Math.round(subtotal * 0.05);
    return { subtotal, taxes, total: subtotal + taxes };
  };

  const pricing = calculateTotal();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour not found</h2>
        </div>
      </div>
    );
  }

  const availableDates = tour.startDates?.filter(d => 
    d.status === 'upcoming' && d.availableSeats >= passengers.length
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-gray-900">{t('booking.title')}</h1>
          <p className="text-gray-600 mt-1">{tour.title?.[lang] || tour.title?.en}</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  step >= s ? 'bg-saffron-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s ? <HiCheck className="w-6 h-6" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-20 h-1 ${step > s ? 'bg-saffron-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={step >= 1 ? 'text-saffron-600' : 'text-gray-500'}>Select Date</span>
            <span className={step >= 2 ? 'text-saffron-600' : 'text-gray-500'}>Passengers</span>
            <span className={step >= 3 ? 'text-saffron-600' : 'text-gray-500'}>Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Select Date */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <HiCalendar className="w-6 h-6 mr-2 text-saffron-500" />
                    {t('booking.selectDate')}
                  </h2>

                  {availableDates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableDates.map((date, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedDate(date.date)}
                          className={`p-4 border-2 rounded-xl text-left transition-all ${
                            selectedDate === date.date
                              ? 'border-saffron-500 bg-saffron-50'
                              : 'border-gray-200 hover:border-saffron-300'
                          }`}
                        >
                          <div className="font-semibold text-gray-900">
                            {new Date(date.date).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500">
                              {date.availableSeats} seats available
                            </span>
                            {selectedDate === date.date && (
                              <HiCheck className="w-5 h-5 text-saffron-500" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No dates available for this tour currently.
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => selectedDate && setStep(2)}
                    disabled={!selectedDate}
                    className="mt-6 btn-primary w-full disabled:opacity-50"
                  >
                    Continue
                  </button>
                </motion.div>
              )}

              {/* Step 2: Passenger Details */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <HiUser className="w-6 h-6 mr-2 text-saffron-500" />
                    {t('booking.passengers')}
                  </h2>

                  <div className="space-y-6">
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-4 bg-gray-50 rounded-xl relative">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          >
                            <HiX className="w-5 h-5" />
                          </button>
                        )}
                        <h3 className="font-semibold text-gray-900 mb-4">Passenger {index + 1}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <input
                              {...register(`passengers.${index}.name`, { required: 'Required' })}
                              className="input-field"
                              placeholder="As per ID proof"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Age
                            </label>
                            <input
                              type="number"
                              {...register(`passengers.${index}.age`, { required: 'Required', min: 0 })}
                              className="input-field"
                              placeholder="Age"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Gender
                            </label>
                            <select
                              {...register(`passengers.${index}.gender`, { required: 'Required' })}
                              className="input-field"
                            >
                              <option value="">Select</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone
                            </label>
                            <input
                              {...register(`passengers.${index}.phone`)}
                              className="input-field"
                              placeholder="Phone number"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => append({ name: '', age: '', gender: '', phone: '' })}
                    className="mt-4 flex items-center text-saffron-600 hover:text-saffron-700"
                  >
                    <HiPlus className="w-5 h-5 mr-1" />
                    Add Another Passenger
                  </button>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      {...register('specialRequests')}
                      rows="3"
                      className="input-field"
                      placeholder="Any dietary requirements, accessibility needs, etc."
                    />
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 btn-primary"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Review Your Booking</h2>

                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Tour Details</h3>
                      <p className="text-gray-700">{tour.title?.[lang] || tour.title?.en}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                        <span className="flex items-center">
                          <HiCalendar className="w-4 h-4 mr-1" />
                          {new Date(selectedDate).toLocaleDateString('en-IN')}
                        </span>
                        <span className="flex items-center">
                          <HiClock className="w-4 h-4 mr-1" />
                          {tour.duration?.days} Days
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Passengers ({passengers.length})</h3>
                      {passengers.map((p, i) => (
                        <p key={i} className="text-gray-700">
                          {i + 1}. {p.name} ({p.age}y, {p.gender})
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={createBookingMutation.isLoading}
                      className="flex-1 btn-primary disabled:opacity-50"
                    >
                      {createBookingMutation.isLoading ? 'Processing...' : t('booking.proceedPayment')}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          {/* Price Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Price Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    ₹{(tour.price?.discountedAmount || tour.price?.amount)?.toLocaleString()} × {passengers.length} passengers
                  </span>
                  <span className="font-medium">₹{pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees (5%)</span>
                  <span className="font-medium">₹{pricing.taxes.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>{t('booking.totalAmount')}</span>
                  <span className="text-saffron-600">₹{pricing.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Includes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {(tour.price?.includes || []).slice(0, 5).map((item, i) => (
                    <li key={i} className="flex items-start">
                      <HiCheck className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

