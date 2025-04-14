import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Loader.css';

const Loader = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // Get the previous route

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      navigate(location.state?.redirectTo || "/landing"); // Redirect to Signin, Signup, or Landing
    }, 3000); // Load for 3 seconds

    return () => clearTimeout(timer);
  }, [navigate, location]);

  return (
    loading ? (
      <div className="loader-container">
        <div className='boxas' style={{display:"flex",justifyContent:"center", alignItems:"center"}}>
          <div className="box blue"></div>
          <div className="box vertical"></div>
          <div className="box blue"></div>
        </div>
      </div>
    ) : null
  );
};

export default Loader;
