import React, { useState } from 'react';
import './App.css';
import LoginComponent from './components/LoginComponent';
import DashboardComponent from './components/DashboardComponent';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        {isLoggedIn ? (
          <DashboardComponent onLogout={handleLogout} />
        ) : (
          <LoginComponent onLogin={handleLogin} />
        )}
      </header>
    </div>
  );
}

export default App;
