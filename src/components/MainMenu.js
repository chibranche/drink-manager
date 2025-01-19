import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ManageEvents from '../pages/ManageEvents';
import './MainMenu.css';

const MainMenu = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Load the selected event from local storage when the app starts
  useEffect(() => {
    const savedEvent = JSON.parse(localStorage.getItem('selectedEvent'));
    if (savedEvent) {
      setSelectedEvent(savedEvent);
    }
  }, []);

  // Handle selecting an event
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    localStorage.setItem('selectedEvent', JSON.stringify(event));
  };

  // Handle switching events
  const handleSwitchEvent = () => {
    setSelectedEvent(null);
    localStorage.removeItem('selectedEvent');
  };

  if (!selectedEvent) {
    // Pass the `handleEventSelect` function as the `onSelectEvent` prop
    return <ManageEvents onSelectEvent={handleEventSelect} />;
  }

  return (
    <div className="main-menu">
      <h1>Manage {selectedEvent.name}</h1>
      <p>Welcome to the event management system!</p>
      <div className="menu-buttons">
        <Link to="/manage-participants" className="menu-button">Manage Participants</Link>
        <Link to="/manage-drinks" className="menu-button">Manage Drinks</Link>
        <Link to="/log-drinks" className="menu-button">Log Drinks</Link>
        <Link to="/view-summary" className="menu-button">View Summary</Link>
      </div>
      <button className="switch-event-button" onClick={handleSwitchEvent}>
        Switch Event
      </button>
    </div>
  );
};

export default MainMenu;
