import React from 'react';
import type { Event } from '../types/Event';

interface EventCardProps {
  event: Event;
  isRecommended: boolean;
}

const getThemeClasses = (color: string): { bg: string; border: string; text: string } => {
  switch (color.toLowerCase()) {
    case 'orange':
      return { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-800' };
    case 'yellow':
      return { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-800' };
    case 'red':
      return { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-800' };
    case 'blue':
      return { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-800' };
    case 'green':
      return { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-800' };
    case 'pink':
      return { bg: 'bg-pink-50', border: 'border-pink-500', text: 'text-pink-800' };
    case 'purple':
      return { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-800' };
    case 'cyan':
      return { bg: 'bg-cyan-50', border: 'border-cyan-500', text: 'text-cyan-800' };
    default:
      return { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-800' };
  }
};

const EventCard: React.FC<EventCardProps> = ({ event, isRecommended }) => {
  const theme = getThemeClasses(event.themeColor);

  const cardClasses = `
    relative flex flex-col h-full rounded-xl overflow-hidden transition-all duration-300 ease-in-out
    transform hover:-translate-y-1 hover:shadow-xl
    ${isRecommended 
      ? 'border-4 border-yellow-500 shadow-lg shadow-yellow-200/50 bg-yellow-50' 
      : `${theme.bg} ${theme.border} border shadow-md`
    }
  `;

  return (
    <div className={cardClasses}>
      {/* Recommended Tag */}
      {isRecommended && (
        <div className="absolute top-0 left-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10 animate-pulse-once">
          Recommended
        </div>
      )}
      
      {event.image && (
        <img src={event.image} alt={event.title} className="w-full h-48 object-cover object-center" />
      )}
      <div className="p-5 flex flex-col flex-grow"> 
        <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{event.title}</h3>
        <p className="text-gray-700 text-sm mb-4 flex-grow">{event.description}</p>
        
        <div className="text-gray-600 text-sm mb-2">
          <strong className="font-semibold">Age Group:</strong> {event.ageGroup}
        </div>
        <div className="text-gray-600 text-sm mb-2">
          <strong className="font-semibold">Location:</strong> {event.location.city}
          {' '}
          {event.location.mapUrl && (
            <a
              href={event.location.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline ml-1 inline-flex items-center text-xs"
            >
              (View Map <span className="ml-1 text-xs">🗺️</span>) 
            </a>
          )}
        </div>
        <div className="text-gray-600 text-sm mb-2">
          <strong className="font-semibold">Date:</strong> {event.startDate} to {event.endDate}
        </div>
        <div className="text-gray-600 text-sm mb-4"> 
          <strong className="font-semibold">Time:</strong> {event.time}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-5"> 
          {event.tags.map((tag, index) => (
            <span
              key={index}
              className={`text-xs font-medium px-3 py-1 rounded-full shadow-sm 
                ${theme.bg.replace('-50', '-100')} ${theme.text} border ${theme.border.replace('-500', '-300')}`} // Tags use theme colors
            >
              {tag}
            </span>
          ))}
        </div>
        
        <a
          href={event.registrationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto block w-full text-center bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold
                     hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" // Button styling
        >
          Register Now
        </a>
      </div>
    </div>
  );
};

export default EventCard;