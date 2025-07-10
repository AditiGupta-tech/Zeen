import React, { useState } from 'react'; 
import type { Therapist } from '../types/Therapist';
import AppModal from './AppModal';

interface TherapistWithRecommendation extends Therapist {
  isRecommended?: boolean;
}

interface TherapistTableProps {
  therapists: TherapistWithRecommendation[];
}

const TherapistTable: React.FC<TherapistTableProps> = ({ therapists }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null); 
  const [selectedTime, setSelectedTime] = useState<string | null>(null); 
  
  const handleAppointmentClick = (therapist: Therapist, time: string) => {
    setSelectedTherapist(therapist);
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  return (
    <div className="overflow-x-auto shadow-xl rounded-lg border border-gray-200">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-md">
          <tr>
            <th className="py-4 px-4 text-left text-sm font-bold uppercase tracking-wider rounded-tl-lg">Name</th>
            <th className="py-4 px-4 text-left text-sm font-bold uppercase tracking-wider">Experience</th>
            <th className="py-4 px-4 text-left text-sm font-bold uppercase tracking-wider">Rating</th>
            <th className="py-4 px-4 text-left text-sm font-bold uppercase tracking-wider">Location</th>
            <th className="py-4 px-4 text-left text-sm font-bold uppercase tracking-wider">Tags</th>
            <th className="py-4 px-4 text-left text-sm font-bold uppercase tracking-wider">Appointments</th>
            <th className="py-4 px-4 text-left text-sm font-bold uppercase tracking-wider rounded-tr-lg">Website</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {therapists.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-500 italic text-lg">No therapists found matching your criteria.</td>
            </tr>
          ) : (
            therapists.map((therapist, index) => (
              <tr
                key={therapist.id}
                className={`
                  ${therapist.isRecommended
                     ? 'bg-yellow-50 border-l-4 border-yellow-400'
                     : index % 2 === 0
                       ? 'bg-white'
                       : 'bg-gray-50'
                  }
                  hover:bg-teal-50
                  hover:shadow-md
                  transform hover:-translate-y-1
                  transition-all duration-300 ease-in-out
                  cursor-pointer
                `}
              >
                <td className="py-3 px-4 text-sm font-medium text-gray-900">{therapist.name}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{therapist.experience} years</td>
                <td className="py-3 px-4 text-sm text-gray-700">{therapist.rating} ⭐</td>
                <td className="py-3 px-4 text-sm text-gray-700">{therapist.location.city}</td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  <div className="flex flex-wrap gap-1">
                    {therapist.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  <div className="flex flex-wrap gap-1">
                    {therapist.availableAppointments.length > 0 ? (
                      therapist.availableAppointments.map((time, timeIndex) => (
                        <button
                          key={timeIndex}
                          onClick={() => handleAppointmentClick(therapist, time)} 
                          className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                          {time}
                        </button>
                      ))
                    ) : (
                      <span className="text-gray-500 text-xs italic">N/A</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">
                  <a
                    href={therapist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors shadow-sm"
                  >
                    Website ↗
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isModalOpen && selectedTherapist && selectedTime && ( 
        <AppModal
          therapist={selectedTherapist}
          selectedTime={selectedTime}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default TherapistTable;