import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Community from './Community';
import Events from './Events';
import Therapies from './Therapies';

interface WithAuthProps {
  onLogout: () => void;
}
interface UserProfile {
  email: string;
  relationToChild: string;
  childName: string;
  childDob: string; 
  gender: string;
  condition: string; 
  dyslexiaTypes: string; 
  otherConditionText: string;
  severity: string;
  specifications: string;
  interests: string; 
  learningAreas: string; 
  learningGoals: string; 
}

export default function WithAuth({ onLogout }: WithAuthProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    email: '',
    relationToChild: '',
    childName: '',
    childDob: '',
    gender: '',
    condition: '',
    dyslexiaTypes: '',
    otherConditionText: '',
    severity: '',
    specifications: '',
    interests: '',
    learningAreas: '',
    learningGoals: '',
  });
  
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (showProfileModal) {
      setIsLoadingProfile(true);
      setProfileError(null);
      fetch('/api/profile')
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
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
        })
        .catch(err => {
          console.error('Failed to fetch profile:', err);
          setProfileError('Failed to load profile data. Please try again.');
        })
        .finally(() => {
          setIsLoadingProfile(false);
        });
    } else {
      setEditMode(false);
      setProfile(originalProfile || { 
        email: '', relationToChild: '', childName: '', childDob: '', gender: '',
        condition: '', dyslexiaTypes: '', otherConditionText: '', severity: '',
        specifications: '', interests: '', learningAreas: '', learningGoals: ''
      });
    }
  }, [showProfileModal]);

  const handleProfileSave = async () => {
    setIsLoadingProfile(true);
    setProfileError(null);

    const dataToSendToBackend = {
        email: profile.email,
        relationToChild: profile.relationToChild,
        childName: profile.childName,
        childDob: profile.childDob, 
        gender: profile.gender,
        condition: profile.condition.split(',').map(s => s.trim()).filter(s => s),
        dyslexiaTypes: profile.dyslexiaTypes.split(',').map(s => s.trim()).filter(s => s),
        otherConditionText: profile.otherConditionText,
        severity: profile.severity,
        specifications: profile.specifications,
        interests: profile.interests.split(',').map(s => s.trim()).filter(s => s),
        learningAreas: profile.learningAreas.split(',').map(s => s.trim()).filter(s => s),
        learningGoals: profile.learningGoals,
    };

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSendToBackend), 
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
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
        <h1 className="text-4xl mt-10 md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to bg-pink-400
                                  animate-textGlow drop-shadow-md mb-4"> Welcome to Zeen Personalization
        <p className="mt-2 text-lg text-gray-600">You’re logged in and ready to roll.</p></h1>
      </motion.div>

      {/* Main Sections */}
      <div className="grid gap-8">
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
        {showProfileModal && (
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
                            value={value}
                            onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                            placeholder={value === '' ? `Enter ${label.toLowerCase()}` : undefined}
                          />
                        ) : (
                          <input
                            id={key}
                            type={inputType}
                            disabled={!editMode}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 disabled:opacity-75 disabled:bg-gray-100 placeholder-gray-400
                                      focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800"
                            value={value}
                            onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                            placeholder={value === '' ? `Enter ${label.toLowerCase()}` : undefined}
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