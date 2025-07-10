import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TherapistCard from './TherapistCard';
import TherapistTable from './TherapistTable';
import therapistsData from '../data/therapy.json'; 
import type { Therapist, ViewMode } from '../types/Therapist';
import { Grid, List } from 'lucide-react';

const therapists: Therapist[] = therapistsData as Therapist[];

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

const Therapies: React.FC = () => {
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [conditionFilter, setConditionFilter] = useState<string>(''); 
  const [experienceFilter, setExperienceFilter] = useState<string>(''); 
  const [ratingFilter, setRatingFilter] = useState<string>(''); 
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
        console.log("No auth token found. Skipping fetching user interests for therapies.");
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
          console.error('Failed to fetch user interests for therapies:', response.status, response.statusText);
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
        console.error('Error fetching user interests for therapies:', error);
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

  const uniqueLocations = useMemo(() => {
    const locations = Array.from(new Set(therapists.map((therapist) => therapist.location.city)));
    return ['', ...locations.sort()];
  }, []);

  const uniqueConditions = useMemo(() => {
    const conditions = Array.from(new Set(therapists.flatMap((therapist) => therapist.tags)));
    return ['', ...conditions.sort()];
  }, []);

  const experienceOptions = useMemo(() => {
    const years = Array.from(new Set(therapists.map(t => t.experience))).sort((a, b) => a - b);
    const options: string[] = ['']; 
    if (years.length > 0) {
      options.push('0-5 years');
      options.push('5-10 years');
      options.push('10+ years');
      options.push('15+ years'); 
    }
    return options;
  }, []);

  const ratingOptions = useMemo(() => {
    const ratings = Array.from(new Set(therapists.map(t => Math.floor(t.rating * 2) / 2))).sort((a, b) => b - a); 
    const options: string[] = [''];
    ratings.forEach(r => {
      options.push(`${r}+`);
    });
    return options;
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
          alert("Location access denied or an error occurred. Please enable location services in your browser settings to see nearby therapists.");
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

  const filteredTherapists = useMemo(() => {
    let currentFilteredTherapists = therapists;

    if (locationFilter) {
      if (locationFilter === "nearby") {
        if (userLocation.permissionGranted && userLocation.latitude && userLocation.longitude) {
          currentFilteredTherapists = currentFilteredTherapists.filter(therapist => {
            const distance = getDistance(
              userLocation.latitude!,
              userLocation.longitude!,
              therapist.location.latitude,
              therapist.location.longitude
            );
            return distance <= NEARBY_THRESHOLD_KM;
          });
        } else {
          currentFilteredTherapists = [];
        }
      } else {
        currentFilteredTherapists = currentFilteredTherapists.filter((therapist) =>
          therapist.location.city.toLowerCase().includes(locationFilter.toLowerCase())
        );
      }
    }

    if (conditionFilter) {
      currentFilteredTherapists = currentFilteredTherapists.filter((therapist) =>
        therapist.tags.some((tag) => tag.toLowerCase().includes(conditionFilter.toLowerCase()))
      );
    }

    if (experienceFilter) {
      currentFilteredTherapists = currentFilteredTherapists.filter((therapist) => {
        const exp = therapist.experience;
        if (experienceFilter === '0-5 years') return exp >= 0 && exp <= 5;
        if (experienceFilter === '5-10 years') return exp > 5 && exp <= 10;
        if (experienceFilter === '10+ years') return exp > 10;
        if (experienceFilter === '15+ years') return exp > 15;
        return true; 
      });
    }

    if (ratingFilter) {
      currentFilteredTherapists = currentFilteredTherapists.filter((therapist) => {
        const minRating = parseFloat(ratingFilter.replace('+', ''));
        return therapist.rating >= minRating;
      });
    }

    const hasUserInterests = userInterests.length > 0 && !isLoadingInterests;

    if (hasUserInterests) {
      const recommendedTherapists = currentFilteredTherapists.filter((therapist) =>
        userInterests.some((interest) => therapist.tags.includes(interest))
      );
      const otherTherapists = currentFilteredTherapists.filter(
        (therapist) => !userInterests.some((interest) => therapist.tags.includes(interest))
      );
      return [...recommendedTherapists, ...otherTherapists];
    }

    return currentFilteredTherapists;
  }, [
    locationFilter,
    conditionFilter,
    experienceFilter,
    ratingFilter,
    userLocation.latitude,
    userLocation.longitude,
    userLocation.permissionGranted,
    userInterests,
    isLoadingInterests
  ]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Find a Therapist</h1>

      {showLocationPrompt && !userLocation.permissionGranted && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-md shadow-md" role="alert">
          <p className="font-bold mb-2">Enable Location Services</p>
          <p className="text-sm">To see therapists near you, please enable location services in your browser. This helps us find the most relevant support for you.</p>
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
          <p className="text-sm">Showing therapists within {NEARBY_THRESHOLD_KM} km of your location.</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-8 items-end justify-center md:justify-start"> 
        {/* Filter controls */}
        <div className="flex flex-col">
          <label htmlFor="locationFilter" className="mb-1 text-sm font-medium text-gray-700">
            Location:
          </label>
          <select
            id="locationFilter"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="p-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 min-w-[150px]"
          >
            <option value="">All Locations</option>
            {userLocation.permissionGranted && (
              <option value="nearby">Nearby Therapists {userCityName ? `(${userCityName})` : ''}</option>
            )}
            {uniqueLocations.map((loc) => (
              loc !== '' && <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="conditionFilter" className="mb-1 text-sm font-medium text-gray-700">
            Condition/Issue:
          </label>
          <select
            id="conditionFilter"
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="p-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 min-w-[150px]"
          >
            {uniqueConditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition === '' ? 'All Conditions' : condition}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="experienceFilter" className="mb-1 text-sm font-medium text-gray-700">
            Experience:
          </label>
          <select
            id="experienceFilter"
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="p-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 min-w-[120px]"
          >
            {experienceOptions.map((option) => (
              <option key={option} value={option}>
                {option === '' ? 'Any Experience' : option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="ratingFilter" className="mb-1 text-sm font-medium text-gray-700">
            Min. Rating:
          </label>
          <select
            id="ratingFilter"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="p-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 min-w-[100px]"
          >
            {ratingOptions.map((option) => (
              <option key={option} value={option}>
                {option === '' ? 'Any Rating' : option}
              </option>
            ))}
          </select>
        </div>


       <div className="ml-auto flex items-center space-x-2 mt-4 md:mt-0">
  <button
    onClick={() => setViewMode('grid')}
    className={`p-2 rounded-full transition-all duration-300 
      ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-200 text-gray-800'} 
      hover:text-white hover:shadow-[0_0_12px_rgba(147,51,234,0.6)]`}
    aria-label="Grid View"
  >
    <Grid className="w-5 h-5" />
  </button>
  <button
    onClick={() => setViewMode('table')}
    className={`p-2 rounded-full transition-all duration-300 
      ${viewMode === 'table' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-200 text-gray-800'} 
      hover:text-white hover:shadow-[0_0_12px_rgba(147,51,234,0.6)]`}
    aria-label="Table View"
  >
    <List className="w-5 h-5" />
  </button>
</div>

      </div>

      {isLoadingInterests ? (
        <p className="text-center text-gray-600 mt-8 text-lg">Loading personalized therapist recommendations...</p>
      ) : (
        <>
          {filteredTherapists.length === 0 ? (
            <p className="text-center text-gray-600 mt-8 text-lg">No therapists found matching your current filters.</p>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"> {/* Adjusted grid columns */}
                  {filteredTherapists.map((therapist) => (
                    <TherapistCard
                      key={therapist.id}
                      therapist={therapist}
                      isRecommended={userInterests.some(interest => therapist.tags.includes(interest))}
                    />
                  ))}
                </div>
              ) : (
                <TherapistTable
                  therapists={filteredTherapists.map(therapist => ({
                    ...therapist,
                    isRecommended: userInterests.some(interest => therapist.tags.includes(interest))
                  }))}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Therapies;