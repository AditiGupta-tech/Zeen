import React, { useState, useEffect, useMemo, useCallback } from 'react';
import EventCard from './EventCard';
import EventTable from './EventTable';
import eventsData from '../data/events.json';
import type { Event, ViewMode } from '../types/Event';
import { Grid, List } from 'lucide-react';

const events: Event[] = eventsData as Event[];

interface UserLocation {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  permissionGranted: boolean;
}

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; 
  return distance;
};

const NEARBY_THRESHOLD_KM = 50; 

const Events: React.FC = () => {
  const [ageFilter, setAgeFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [activityFilter, setActivityFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [userLocation, setUserLocation] = useState<UserLocation>({
    latitude: null,
    longitude: null,
    city: null,
    permissionGranted: false,
  });
  const [showLocationPrompt, setShowLocationPrompt] = useState<boolean>(true);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [isLoadingInterests, setIsLoadingInterests] = useState<boolean>(true);
  const [userCityName, setUserCityName] = useState<string | null>(null); 

  useEffect(() => {
    const fetchUserInterests = async () => {
      setIsLoadingInterests(true);
      const authToken = localStorage.getItem('authToken'); 

      if (!authToken) {
        console.log("No auth token found. Skipping fetching user interests.");
        setUserInterests([]); 
        setIsLoadingInterests(false);
        return;
      }

      try {
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (!response.ok) {
          console.error('Failed to fetch user interests:', response.status, response.statusText);
          if (response.status === 401) {
            localStorage.removeItem('authToken'); 
          }
          setUserInterests([]);
          return;
        }

        const userData = await response.json();
        if (userData && Array.isArray(userData.interests)) {
          setUserInterests(userData.interests);
        } else {
          setUserInterests([]); 
        }
      } catch (error) {
        console.error('Error fetching user interests:', error);
        setUserInterests([]); 
      } finally {
        setIsLoadingInterests(false);
      }
    };

    fetchUserInterests();
  }, []); 

  useEffect(() => {
    setLocationFilter('');
  }, []);

  const uniqueAgeGroups = useMemo(() => {
    const ages = Array.from(new Set(events.map((event) => event.ageGroup)));
    return ['', ...ages.sort()];
  }, []);

  const uniqueLocations = useMemo(() => {
    const locations = Array.from(new Set(events.map((event) => event.location.city)));
    return ['', ...locations.sort()];
  }, []);

  const uniqueActivities = useMemo(() => {
    const activities = Array.from(new Set(events.flatMap((event) => event.tags)));
    return ['', ...activities.sort()];
  }, []);

  const requestLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => { 
          const { latitude, longitude } = position.coords;
          setUserLocation({
            latitude,
            longitude,
            city: null, 
            permissionGranted: true,
          });
          setShowLocationPrompt(false);
          console.log("User location detected:", latitude, longitude);
          setLocationFilter("nearby"); 

          try { 
            //  https://opencagedata.com/
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_OPENCAGE_API_KEY`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const city = data.results[0].components.city || data.results[0].components.town || data.results[0].components.village || data.results[0].components.county;
              setUserLocation(prev => ({ ...prev, city: city || 'Unknown City' }));
              setUserCityName(city || 'Unknown City'); 
              console.log("User city derived:", city);
            } else {
              setUserCityName('Unknown City');
            }
          } catch (error) {
            console.error("Error during reverse geocoding:", error);
            setUserCityName('Error getting city');
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocation(prev => ({ ...prev, permissionGranted: false }));
          setShowLocationPrompt(true); 
          alert("Location access denied or an error occurred. Please enable location services in your browser settings to see nearby events.");
          setLocationFilter(''); 
          setUserCityName(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } 
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setShowLocationPrompt(false);
      setUserCityName(null);
    }
  }, []);

  const filteredEvents = useMemo(() => {
    let currentFilteredEvents = events; 

    if (ageFilter) {
      currentFilteredEvents = currentFilteredEvents.filter((event) => event.ageGroup === ageFilter);
    }

    if (locationFilter) {
      if (locationFilter === "nearby") {
        if (userLocation.permissionGranted && userLocation.latitude && userLocation.longitude) {
          currentFilteredEvents = currentFilteredEvents.filter(event => {
            if (typeof event.location.latitude !== 'number' || typeof event.location.longitude !== 'number') {
              console.warn(`Event ${event.id} (${event.title}) is missing valid latitude/longitude. Skipping for nearby calculation.`);
              return false; 
            }
            const distance = getDistance(
              userLocation.latitude,
              userLocation.longitude,
              event.location.latitude,
              event.location.longitude
            );
            return distance <= NEARBY_THRESHOLD_KM;
          });
          if (currentFilteredEvents.length === 0) {
            console.log("No events found within nearby threshold.");
          }
        } else {
          currentFilteredEvents = [];
        }
      } else {
        currentFilteredEvents = currentFilteredEvents.filter((event) =>
          event.location.city.toLowerCase().includes(locationFilter.toLowerCase())
        );
      }
    }

    if (activityFilter) {
      currentFilteredEvents = currentFilteredEvents.filter((event) =>
        event.tags.some((tag) => tag.toLowerCase().includes(activityFilter.toLowerCase()))
      );
    }

    const hasUserInterests = userInterests.length > 0 && !isLoadingInterests;

    if (hasUserInterests) {
      const recommendedEvents = currentFilteredEvents.filter((event) =>
        userInterests.some((interest) => event.tags.includes(interest))
      );
      const otherEvents = currentFilteredEvents.filter(
        (event) => !userInterests.some((interest) => event.tags.includes(interest))
      );
      return [...recommendedEvents, ...otherEvents]; 
    }

    return currentFilteredEvents;
  }, [
    ageFilter,
    locationFilter,
    activityFilter,
    userLocation.latitude,
    userLocation.longitude,
    userLocation.permissionGranted,
    userInterests,
    isLoadingInterests 
  ]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Explore Events</h1>

      {showLocationPrompt && !userLocation.permissionGranted && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-md shadow-md" role="alert">
          <p className="font-bold mb-2">Enable Location Services</p>
          <p className="text-sm">To see events near you, please enable location services in your browser. This helps us find the most relevant events for you.</p>
          <button
            onClick={requestLocation}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Enable Location
          </button>
        </div>
      )}

      {userLocation.permissionGranted && userCityName && locationFilter === "nearby" && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-6 rounded-md shadow-sm">
          <p className="font-bold">Your current location: <span className="font-semibold text-green-800">{userCityName}</span></p>
          <p className="text-sm">Showing events within {NEARBY_THRESHOLD_KM} km of your location.</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6 items-end">
        {/* Filter controls */}
        <div className="flex flex-col">
          <label htmlFor="ageFilter" className="mb-1 text-sm font-medium text-gray-700">
            Age Group:
          </label>
          <select
            id="ageFilter"
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {uniqueAgeGroups.map((age) => (
              <option key={age} value={age}>
                {age === '' ? 'All Ages' : age}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="locationFilter" className="mb-1 text-sm font-medium text-gray-700">
            Location:
          </label>
          <select
            id="locationFilter"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Locations</option>
            {userLocation.permissionGranted && (
              <option value="nearby">Nearby Events {userCityName ? `(${userCityName})` : ''}</option>
            )}
            {uniqueLocations.map((loc) => (
              loc !== '' && <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="activityFilter" className="mb-1 text-sm font-medium text-gray-700">
            Activity:
          </label>
          <select
            id="activityFilter"
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            className="p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {uniqueActivities.map((activity) => (
              <option key={activity} value={activity}>
                {activity === '' ? 'All Activities' : activity}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex items-center space-x-2">
  <button
    onClick={() => setViewMode('grid')}
    className={`p-2 rounded-full transition-all duration-300
      ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-800'}
      hover:text-white hover:shadow-[0_0_12px_rgba(59,130,246,0.6)]`}
    aria-label="Grid View"
    title="Grid View"
  >
    <Grid className="w-5 h-5" />
  </button>

  <button
    onClick={() => setViewMode('table')}
    className={`p-2 rounded-full transition-all duration-300
      ${viewMode === 'table' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-800'}
      hover:text-white hover:shadow-[0_0_12px_rgba(59,130,246,0.6)]`}
    aria-label="Table View"
    title="Table View"
  >
    <List className="w-5 h-5" />
  </button>
</div>

      </div>

      {isLoadingInterests && (
        <p className="text-center text-gray-600 mt-8">Loading personalized recommendations...</p>
      )}

      {!isLoadingInterests && filteredEvents.length === 0 ? (
        <p className="text-center text-gray-600 mt-8">No events match your current filters.</p>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRecommended={userInterests.some(interest => event.tags.includes(interest))}
                />
              ))}
            </div>
          ) : (
            <EventTable
              events={filteredEvents.map(event => ({
                ...event,
                isRecommended: userInterests.some(interest => event.tags.includes(interest))
              }))}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Events;