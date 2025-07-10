import React, { useState, useEffect } from 'react';
import type { Therapist } from '../types/Therapist';

interface AppModalProps {
  therapist: Therapist;
  selectedTime: string;
  onClose: () => void;
}

const AppModal: React.FC<AppModalProps> = ({ therapist, selectedTime, onClose }) => {
  const [bookingDate, setBookingDate] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'checking' | 'confirmed' | 'rejected'>('idle');
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  useEffect(() => {
    setIsSubmitEnabled(!!bookingDate);
  }, [bookingDate]);

  const handleBookingSubmit = async () => {
    if (!bookingDate) return;

    setBookingStatus('checking');

    await new Promise(resolve => setTimeout(resolve, 1500)); 

    const isAvailable = Math.random() > 0.5;

    if (isAvailable) {
      setBookingStatus('confirmed');
      console.log(`Booking confirmed for ${therapist.name} on ${bookingDate} at ${selectedTime}`);
    } else {
      setBookingStatus('rejected');
      console.log(`Booking rejected for ${therapist.name} on ${bookingDate} at ${selectedTime}`);
    }
  };

  const today = new Date().toISOString().split('T')[0]; 

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Book Appointment with {therapist.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
            &times;
          </button>
        </div>

        <p className="text-gray-700 mb-4">
          You are requesting an appointment for <span className="font-semibold">{selectedTime}</span>.
        </p>

        <div className="mb-4">
          <label htmlFor="bookingDate" className="block text-gray-700 text-sm font-bold mb-2">
            Select Date:
          </label>
          <input
            type="date"
            id="bookingDate"
            min={today} 
            value={bookingDate}
            onChange={(e) => {
              setBookingDate(e.target.value);
              setBookingStatus('idle');
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mt-6">
          {bookingStatus === 'idle' && (
            <button
              onClick={handleBookingSubmit}
              disabled={!isSubmitEnabled}
              className={`w-full py-2 px-4 rounded-md font-semibold transition-colors duration-200
                ${isSubmitEnabled ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              `}
            >
              Check Availability
            </button>
          )}

          {bookingStatus === 'checking' && (
            <div className="flex items-center justify-center py-2">
              <svg className="animate-spin h-6 w-6 text-blue-500 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-700">Checking therapist's availability...</span>
            </div>
          )}

          {bookingStatus === 'confirmed' && (
            <div className="text-center py-4 text-green-600 font-bold flex flex-col items-center">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-xl">Booking Confirmed!</p>
              <p className="text-sm text-gray-600 mt-1">You will receive a confirmation email shortly.</p>
              <button onClick={onClose} className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-5 rounded-md transition-colors">
                Done
              </button>
            </div>
          )}

          {bookingStatus === 'rejected' && (
            <div className="text-center py-4 text-red-600 font-bold flex flex-col items-center">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-xl">Appointment Not Available</p>
              <p className="text-sm text-gray-600 mt-1">Please choose another date or time.</p>
              <button onClick={() => setBookingStatus('idle')} className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-md transition-colors">
                Try Another Time
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppModal;