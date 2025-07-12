import { useEffect, useState } from 'react';
import Navigation from '../components/Navbar';
import Footer from '../components/Footer';
import WithAuth from '../components/WithAuth';
import WithoutAuth from '../components/WithoutAuth'; 
import LoginPage from './Login'; 
import SignupPage from './Signup'; 
import { BrowserRouter as Routes, Route, useNavigate } from 'react-router-dom';

export default function PersonalizeExperience() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate(); 

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token'); 
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    checkAuthStatus(); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login'); 
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/'); 
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
          <Routes>
            <Route path="/" element={<WithoutAuth />} />
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLogin} />} />
            <Route path="/signup" element={<SignupPage onSignupSuccess={handleLogin} />} />
            <Route path="*" element={<PersonalizeExperience />} />
          </Routes>
        )}
      </main>
      <Footer />
    </div>
  );
}