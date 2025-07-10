import React, { useState } from 'react';
import type { Therapist } from '../types/Therapist';
import AppModal from './AppModal';

interface TherapistCardProps {
  therapist: Therapist;
  isRecommended: boolean;
}

const getTherapistThemeClasses = (rating: number): { bg: string; border: string; text: string } => {
  if (rating >= 4.8) {
    return { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-800' };
  } else if (rating >= 4.5) {
    return { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-800' };
  } else {
    return { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-800' };
  }
};

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, isRecommended }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [hoveredTimeIndex, setHoveredTimeIndex] = useState<number | null>(null); 

  const theme = getTherapistThemeClasses(therapist.rating);

  const cardClasses = `
    relative flex flex-col h-full rounded-xl overflow-hidden transition-all duration-300 ease-in-out
    transform hover:-translate-y-1 hover:shadow-xl
    ${isRecommended
      ? 'border-4 border-yellow-500 shadow-lg shadow-yellow-200/50 bg-yellow-50'
      : `${theme.bg} ${theme.border} border shadow-md`
    }
  `;

  const handleAppointmentClick = (time: string) => {
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  return (
    <div className={cardClasses}>
      {/* Recommended Tag */}
      {isRecommended && (
        <div className="absolute top-0 left-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10 animate-pulse-once">
          Recommended
        </div>
      )}

      {therapist.image && (
        <img src={therapist.image} alt={therapist.name} className="w-full h-56 object-cover object-center" />
      )}
      <div className="px-5 py-5 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{therapist.name}</h3>
        <div className="text-gray-700 text-sm mb-4 flex-grow">
          <p className="mb-1"><strong className="font-semibold">Experience:</strong> {therapist.experience} years</p>
          <p className="mb-1"><strong className="font-semibold">Rating:</strong> {therapist.rating} ⭐</p>
          <p className="mb-1"><strong className="font-semibold">Location:</strong> {therapist.location.city}, {therapist.location.state}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {therapist.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className={`text-xs font-medium px-3 py-1 rounded-full shadow-sm
                ${theme.bg.replace('-50', '-100')} ${theme.text} border ${theme.border.replace('-500', '-300')}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Available Appointments:</h4>
          <div className="flex flex-wrap gap-2">
            {therapist.availableAppointments.length > 0 ? (
              therapist.availableAppointments.map((time, index) => (
                <div
                  key={index}
                  className="relative" 
                  onMouseEnter={() => setHoveredTimeIndex(index)}
                  onMouseLeave={() => setHoveredTimeIndex(null)}
                >
                  <button
                    onClick={() => handleAppointmentClick(time)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                  >
                    {time}
                  </button>
                  {hoveredTimeIndex === index && (
                    <div
                      className="absolute bottom-[-2.5rem] left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap z-20"
                    >
                      Click to book appointment
                      <div className="absolute left-1/2 transform -translate-x-1/2 -top-1 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-gray-800"></div> {/* Tooltip arrow */}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <span className="text-gray-500 text-sm italic">No appointments available.</span>
            )}
          </div>
        </div>

        <a
          href={therapist.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto block w-full text-center bg-purple-600 text-white py-2 px-4 rounded-md font-semibold
                      hover:bg-purple-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Visit Website
        </a>
      </div>

      {isModalOpen && selectedTime && (
        <AppModal
          therapist={therapist}
          selectedTime={selectedTime}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TherapistCard;