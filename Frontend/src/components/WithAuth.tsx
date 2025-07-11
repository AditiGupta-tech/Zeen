import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SchedulePage from './schedule/SchedulePage';
import Community from './Community';
import Events from './Events';
import Therapies from './Therapies';
import { useAppContext } from '../context/appContext'; 
import ConfettiCannon from './schedule/Confetti';

interface UserProfile {
  email: string;
  relationToChild: string;
  childName: string;
  childDob: string;
  gender: string;
  condition: string | string[]; 
  dyslexiaTypes: string | string[]; 
  otherConditionText: string;
  severity: string;
  specifications: string;
  interests: string | string[];
  learningAreas: string | string[];
  learningGoals: string;
}

interface WithAuthProps {
  onLogout: () => void;
}

export default function WithAuth({ onLogout }: WithAuthProps) {
  const { user, setUser, isLoading: isAppContextLoading, error: appContextError } = useAppContext();
  
  const [profile, setProfile] = useState<UserProfile>({
    email: '', relationToChild: '', childName: '', childDob: '', gender: '',
    condition: '', dyslexiaTypes: '', otherConditionText: '', severity: '',
    specifications: '', interests: '', learningAreas: '', learningGoals: '',
  });

  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true); 
  const [profileError, setProfileError] = useState<string | null>(null);

  // UI state for menu and modals
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // State to control visibility of SchedulePage within WithAuth
  const [showSchedulePage, setShowSchedulePage] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoadingProfile(true);
      setProfileError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Authentication token not found. Please log in.");
        setProfileError("You are not logged in. Please log in to view your profile.");
        setIsLoadingProfile(false);
        onLogout(); 
        return;
      }

      try {
        const res = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`HTTP error! status: ${res.status}, Response: ${errorText}`);
          if (res.status === 401) {
            // Token invalid/expired, force re-authentication
            localStorage.removeItem('token');
            onLogout(); // Call onLogout to redirect
            setProfileError("Session expired. Please log in again.");
          } else {
            setProfileError(`Failed to load profile data: ${errorText || 'Unknown error'}.`);
          }
          throw new Error(`HTTP error! status: ${res.status}, Message: ${errorText}`);
        }

        const data = await res.json();
        const mappedProfile: UserProfile = {
          email: data.email || '',
          relationToChild: data.relationToChild || '',
          childName: data.childName || '',
          childDob: data.childDob ? new Date(data.childDob).toISOString().split('T')[0] : '',
          gender: data.gender || '',
          condition: Array.isArray(data.condition) ? data.condition.join(', ') : data.condition || '',
          dyslexiaTypes: Array.isArray(data.dyslexiaTypes) ? data.dyslexiaTypes.join(', ') : data.dyslexiaTypes || '',
          otherConditionText: data.otherConditionText || '',
          severity: data.severity || '',
          specifications: data.specifications || '',
          interests: Array.isArray(data.interests) ? data.interests.join(', ') : data.interests || '',
          learningAreas: Array.isArray(data.learningAreas) ? data.learningAreas.join(', ') : data.learningAreas || '',
          learningGoals: data.learningGoals || '',
        };
        setProfile(mappedProfile);
        setOriginalProfile(mappedProfile);
        setUser(mappedProfile); 
      } catch (err: any) {
        console.error('Failed to fetch profile in WithAuth:', err);
        if (!profileError) {
          setProfileError(`Failed to load profile data: ${err.message || 'Unknown error'}. Please try logging in again.`);
        }
        setUser(null);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (!user || !profile.email) { 
      fetchProfileData();
    }
  }, [user, profile.email, setUser, onLogout, profileError]); 

  const handleProfileSave = async () => {
    setIsLoadingProfile(true); 
    setProfileError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Authentication token not found for save. Please log in.");
      setProfileError("You are not logged in. Please log in to save your profile.");
      setIsLoadingProfile(false);
      onLogout(); 
      return;
    }

    if (!profile) {
      setProfileError("No profile data to save.");
      setIsLoadingProfile(false);
      return;
    }

    const dataToSendToBackend = {
      email: profile.email,
      relationToChild: profile.relationToChild,
      childName: profile.childName,
      childDob: profile.childDob,
      gender: profile.gender,
      condition: typeof profile.condition === 'string' ? profile.condition.split(',').map(s => s.trim()).filter(s => s) : profile.condition,
      dyslexiaTypes: typeof profile.dyslexiaTypes === 'string' ? profile.dyslexiaTypes.split(',').map(s => s.trim()).filter(s => s) : profile.dyslexiaTypes,
      otherConditionText: profile.otherConditionText,
      severity: profile.severity,
      specifications: profile.specifications,
      interests: typeof profile.interests === 'string' ? profile.interests.split(',').map(s => s.trim()).filter(s => s) : profile.interests,
      learningAreas: typeof profile.learningAreas === 'string' ? profile.learningAreas.split(',').map(s => s.trim()).filter(s => s) : profile.learningAreas,
      learningGoals: profile.learningGoals,
    };

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSendToBackend),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `Server responded with status ${res.status}` }));
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedData = await res.json();
      const remappedUpdatedData: UserProfile = {
        email: updatedData.email || '',
        relationToChild: updatedData.relationToChild || '',
        childName: updatedData.childName || '',
        childDob: updatedData.childDob ? new Date(updatedData.childDob).toISOString().split('T')[0] : '',
        gender: updatedData.gender || '',
        condition: Array.isArray(updatedData.condition) ? updatedData.condition.join(', ') : updatedData.condition || '',
        dyslexiaTypes: Array.isArray(updatedData.dyslexiaTypes) ? updatedData.dyslexiaTypes.join(', ') : updatedData.dyslexiaTypes || '',
        otherConditionText: updatedData.otherConditionText || '',
        severity: updatedData.severity || '',
        specifications: updatedData.specifications || '',
        interests: Array.isArray(updatedData.interests) ? updatedData.interests.join(', ') : updatedData.interests || '',
        learningAreas: Array.isArray(updatedData.learningAreas) ? updatedData.learningAreas.join(', ') : updatedData.learningAreas || '',
        learningGoals: updatedData.learningGoals || '',
      };
      setProfile(remappedUpdatedData);
      setOriginalProfile(remappedUpdatedData);
      setUser(remappedUpdatedData); 
      alert('Profile updated successfully!');
      setEditMode(false);
      setShowProfileModal(false);
    } catch (err: any) {
      console.error(err);
      setProfileError(`Error updating profile: ${err.message || 'Unknown error'}`);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    if (originalProfile) {
      setProfile(originalProfile);
    }
    setShowProfileModal(false);
  };

  if (isAppContextLoading || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-700">Loading authenticated content...</p>
      </div>
    );
  }

  if (appContextError || profileError || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md text-red-600">
          <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
          <p>{appContextError || profileError || "You are not logged in. Please log in to access this page."}</p>
          <button
            onClick={onLogout}
            className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-20 pb-10 relative">
      {/* Hamburger Menu */}
      <div className="absolute top-20 right-6 z-50">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 rounded-full border border-green-500 text-lg font-semibold bg-white shadow-md hover:shadow-green-300 transition-all duration-300 hover:scale-105 focus:outline-none"
          style={{
            boxShadow: '0 0 8px rgba(34, 197, 94, 0.7)',
          }}
        >
          ☰
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
            <button
              onClick={() => {
                setShowProfileModal(true);
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              View Profile
            </button>
            <button
              onClick={() => {
                setShowLogoutModal(true);
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mt-12 mb-10 px-2"
      >
        <h1 className="text-4xl mt-10 md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-400
                         animate-textGlow drop-shadow-md mb-4"> Welcome to Zeen Personalization
        <p className="mt-2 text-lg text-gray-600">You’re logged in and ready to roll.</p></h1>
      </motion.div>

      {/* Track Progress Button */}
      {!showSchedulePage && (
        <div className="text-center my-8">
          <button
            onClick={() => setShowSchedulePage(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg
                         hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300
                         focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Track My Progress
          </button>
        </div>
      )}

      {/* Main Content Sections */}
      <div className="grid gap-8">
        {showSchedulePage && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            {user?.severity ? (
                <SchedulePage userSeverity={user.severity} />
            ) : (
                <div className="text-center text-red-600 p-4 border border-red-300 rounded-md">
                    Cannot display schedule: Dyslexia severity not found in your profile. Please update your profile.
                </div>
            )}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Therapies />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <Community />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
          <Events />
        </motion.div>
      </div>

      <ConfettiCannon /> 

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white p-6 rounded-lg shadow-lg text-center w-[90%] max-w-sm"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <h2 className="text-xl font-semibold mb-4">Are you sure you want to logout?</h2>
              <div className="flex justify-around">
                <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
                  Cancel
                </button>
                <button onClick={onLogout} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && profile && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl overflow-y-auto max-h-[95vh] relative"
              initial={{ scale: 0.8, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}>

              {/* Close Button */}
              <button
                onClick={handleCancelEdit}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200"
                aria-label="Close profile modal"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Your Profile</h2>

              {isLoadingProfile && (
                <div className="text-center text-blue-600 mb-4">Loading profile...</div>
              )}

              {profileError && (
                <div className="text-center text-red-600 mb-4">{profileError}</div>
              )}

              {!isLoadingProfile && !profileError && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {Object.entries(profile).map(([key, value]) => {
                    let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    if (key === 'childDob') label = 'Child Date of Birth';
                    if (key === 'learningAreas') label = 'Learning Areas (comma-separated)';
                    if (key === 'learningGoals') label = 'Learning Goals';
                    if (key === 'relationToChild') label = 'Relation To Child';
                    if (key === 'otherConditionText') label = 'Other Condition Details';
                    if (key === 'dyslexiaTypes') label = 'Dyslexia Types (comma-separated)';

                    const inputType = key === 'childDob' ? 'date' : (key === 'email' ? 'email' : 'text');

                    const isTextArea = ['specifications', 'interests', 'learningAreas', 'learningGoals', 'otherConditionText'].includes(key);

                    const displayValue = Array.isArray(value) ? value.join(', ') : (value || '');

                    return (
                      <div key={key} className="flex flex-col">
                        <label htmlFor={key} className="block text-sm font-semibold text-gray-700 mb-1">
                          {label}
                        </label>
                        {isTextArea ? (
                          <textarea
                            id={key}
                            disabled={!editMode}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 disabled:opacity-75 disabled:bg-gray-100 placeholder-gray-400
                                          focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 min-h-[80px]"
                            value={displayValue}
                            onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                            placeholder={displayValue === '' ? `Enter ${label.toLowerCase()}` : undefined}
                          />
                        ) : (
                          <input
                            id={key}
                            type={inputType}
                            disabled={!editMode}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 disabled:opacity-75 disabled:bg-gray-100 placeholder-gray-400
                                          focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800"
                            value={displayValue}
                            onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                            placeholder={displayValue === '' ? `Enter ${label.toLowerCase()}` : undefined}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-8 border-t border-gray-200 mt-8">
                {!editMode ? (
                  <button
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-200"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition-all duration-200"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-all duration-200"
                      onClick={handleProfileSave}
                      disabled={isLoadingProfile}
                    >
                      {isLoadingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}