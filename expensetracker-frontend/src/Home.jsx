// Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <h1 className="mb-4">Expense Tracker</h1>
      <button
        className="btn btn-primary"
        onClick={() => navigate('/app')}
      >
        Go to App
      </button>
    </div>
  );
};

export default Home;
