import { useState } from 'react';
import { MapPin, Star, CalendarCheck } from 'lucide-react';

// Dummy Data (replace with real API later)
const therapists = [
  {
    id: 1,
    name: 'Dr. Aarti Sharma',
    image: '/therapists/aarti.jpg',
    tags: ['Dyslexia', 'Speech Therapy'],
    experience: 8,
    rating: 4.7,
    location: 'Delhi',
    website: 'https://aartisharma.com'
  },
  // ... more therapists
];

const events = [
  {
    id: 1,
    name: 'Storytelling Workshop',
    category: 'Reading',
    ageGroup: '6-8',
    date: '2025-08-12',
    location: 'Mumbai',
    link: 'https://example.com/register1',
    interestBased: true
  },
  // ... more events
];

const groups = [
  { id: 1, name: 'Dyslexia Support India', members: 253 },
  { id: 2, name: 'Parents of Visual Learners', members: 142 },
];

export default function ZeenExplore({ userLocation = 'Delhi', userInterests = ['Reading'] }) {
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);

  const joinGroup = (id: number) => {
    if (!joinedGroups.includes(id)) setJoinedGroups([...joinedGroups, id]);
  };

  return (
    <div className="space-y-12 p-4 md:p-10">
      {/* Therapy Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-purple-700">Find Therapists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapists.filter(t => t.location === userLocation).map(t => (
            <div key={t.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
              <img src={t.image} alt={t.name} className="w-full h-40 object-cover rounded-md" />
              <h3 className="text-lg font-bold mt-2">{t.name}</h3>
              <p className="text-sm text-gray-500">{t.tags.join(', ')}</p>
              <div className="flex items-center justify-between text-sm mt-2">
                <p>{t.experience} yrs exp</p>
                <p className="flex items-center"><Star className="h-4 w-4 text-yellow-500 mr-1" />{t.rating}</p>
              </div>
              <p className="text-gray-600 mt-1 flex items-center"><MapPin className="h-4 w-4 mr-1" />{t.location}</p>
              <a
                href={t.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 text-purple-600 hover:underline"
              >Visit Website</a>
              <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Book Appointment</button>
            </div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-green-700">Community Groups</h2>
        <div className="space-y-4">
          {groups.map(group => (
            <div key={group.id} className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm">
              <div>
                <h4 className="text-lg font-bold text-gray-800">{group.name}</h4>
                <p className="text-sm text-gray-500">{group.members} members</p>
              </div>
              <button
                onClick={() => joinGroup(group.id)}
                className={`px-4 py-2 rounded ${joinedGroups.includes(group.id) ? 'bg-gray-300 text-gray-600' : 'bg-green-600 text-white hover:bg-green-700'}`}
              >{joinedGroups.includes(group.id) ? 'Joined' : 'Join'}</button>
            </div>
          ))}
        </div>
      </section>

      {/* Events Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-orange-700">Upcoming Events</h2>

        {/* Interest-based Events */}
        {events.some(e => userInterests.includes(e.category)) && (
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-yellow-600 mb-3">Suggested for {userInterests.join(', ')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.filter(e => userInterests.includes(e.category)).map(event => (
                <EventCard key={event.id} event={event} highlight />
              ))}
            </div>
          </div>
        )}

        {/* Other Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.filter(e => !userInterests.includes(e.category)).map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}

function EventCard({ event, highlight = false }: { event: any, highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-lg border shadow-md ${highlight ? 'bg-yellow-50 border-yellow-300' : 'bg-white'}`}>
      <h4 className="text-xl font-bold text-gray-800">{event.name}</h4>
      <p className="text-sm text-gray-600 mb-1">Category: {event.category}</p>
      <p className="text-sm text-gray-600 mb-1">Age Group: {event.ageGroup}</p>
      <p className="text-sm text-gray-600 mb-1 flex items-center"><CalendarCheck className="h-4 w-4 mr-1" />{event.date}</p>
      <p className="text-sm text-gray-600 mb-1 flex items-center">
        <MapPin className="h-4 w-4 mr-1" />
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >{event.location}</a>
      </p>
      <a
        href={event.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >Register</a>
    </div>
  );
}
