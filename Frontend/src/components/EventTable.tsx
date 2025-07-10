import React from 'react';
import type { Event } from '../types/Event';

interface EventWithRecommendation extends Event {
  isRecommended?: boolean;
}

interface EventTableProps {
  events: EventWithRecommendation[];
}

const EventTable: React.FC<EventTableProps> = ({ events }) => {
  return (
    <div className="overflow-x-auto shadow-xl rounded-lg border border-gray-200"> 
      <table className="min-w-full bg-white divide-y divide-gray-200"> 
        <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
          <tr>
            <th className="py-4 px-4 text-left text-sm font-bold uppercase tracking-wider rounded-tl-lg">Title</th> 
            <th className="py-4 px-4 text-left text-sm font-bold uppercase tracking-wider">Age Group</th>
            <th className="py-4 px-4 text-left text-sm font-bold uppercase tracking-wider">Location</th>
            <th className="py-4 px-4 text-left text-sm font-bold uppercase tracking-wider">Date</th>
            <th className="py-4 px-4 text-left text-sm font-bold uppercase tracking-wider">Time</th>
            <th className="py-4 px-4 text-left text-sm font-bold uppercase tracking-wider">Tags</th>
            <th className="py-4 px-4 text-left text-sm font-bold uppercase tracking-wider rounded-tr-lg">Registration</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200"> 
          {events.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-500 italic text-lg">No events found matching your criteria.</td> {/* Larger text for empty state */}
            </tr>
          ) : (
            events.map((event, index) => (
              <tr
                key={event.id}
                className={`
                  ${event.isRecommended 
                     ? 'bg-yellow-50 border-l-4 border-yellow-400' 
                     : index % 2 === 0 
                       ? 'bg-white' 
                       : 'bg-gray-50' 
                  } 
                  hover:bg-blue-50 
                  hover:shadow-md 
                  transform hover:-translate-y-1 
                  transition-all duration-300 ease-in-out 
                  cursor-pointer
                `} 
              >
                <td className="py-3 px-4 text-sm font-medium text-gray-900">{event.title}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{event.ageGroup}</td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {event.location.city}
                  {' '}
                  {event.location.mapUrl && (
                    <a
                      href={event.location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline ml-1 inline-flex items-center text-xs" // Consistent link style
                    >
                      (Map <span className="ml-0.5">↗</span>)
                    </a>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">{event.startDate}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{event.time}</td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  <div className="flex flex-wrap gap-1">
                    {event.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm" // Tag styling
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-md" // Button-like registration link with shadow
                  >
                    Register Now
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;