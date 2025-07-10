import { useEffect, useState } from 'react';
import Navigation from '../components/Navbar';
import Footer from '../components/Footer';
import WithAuth from '../components/WithAuth';
import WithoutAuth from '../components/WithoutAuth';

export default function PersonalizeExperience() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsAuthenticated(!!token);
  }, []);

 const handleLogout = () => {
  localStorage.removeItem('userToken');
  setIsAuthenticated(false); 
};


  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        {isAuthenticated ? (
          <WithAuth onLogout={handleLogout} />
        ) : (
          <WithoutAuth />
        )}
      </main>
      <Footer />
    </div>
  );
}