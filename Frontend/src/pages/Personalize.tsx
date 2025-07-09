import { useState } from 'react';
import WithoutAuth from '../components/WithoutAuth'; 
import Navigation from '../components/Navbar';
import Footer from '../components/Footer';
// import WithAuth from './withAuth'; 

export default function PersonalizeExperience() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  const handleLogin = () => {
    setIsAuthenticated(true);
    console.log("User logged in!");
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
    console.log("User signed up!");
  };

  return (
    <div>
      <Navigation />
      {isAuthenticated ? (
        <div className="px-6 md:px-20 py-16 bg-blue-50 text-gray-800 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-6">
            Welcome Back! Your Personalized Journey Awaits.
          </h1>
          <p className="text-xl text-gray-700">
            This is where your personalized content for authenticated users would go.
          </p>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="mt-8 px-6 py-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600"
          >
            Log Out (for testing)
          </button>
        </div>
        // <WithAuth />
      ) : (
        <WithoutAuth />
      )}
      <Footer />
    </div>
  );
}