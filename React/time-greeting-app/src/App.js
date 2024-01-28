// src/App.js
import React, { useEffect, useState } from 'react';
import './styles.css';

const App = () => {
  const [greeting, setGreeting] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    const updateGreetingAndColor = () => {
      const currentHour = new Date().getHours();

      if (currentHour >= 0 && currentHour < 12) {
        setGreeting('Good morning');
        setColor('red');
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting('Good afternoon');
        setColor('green');
      } else {
        setGreeting('Good evening');
        setColor('blue');
      }
    };

    updateGreetingAndColor(); // Initial call
    const intervalId = setInterval(updateGreetingAndColor, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div>
      <h1 style={{ color }} className="heading">
        {greeting}
      </h1>
    </div>
  );
};

export default App;
