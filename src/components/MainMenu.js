import React from 'react';
import { Link } from 'react-router-dom';
import ManageEvents from '../pages/ManageEvents';
import './MainMenu.css';

import {EventContext} from '../context/EventProvider';

const MainMenu = () => {
  const {selectedEventData, handleEventSelect, handleSwitchEvent} = React.useContext(EventContext);

  if (!selectedEventData?.id) {
    // Pass the `handleEventSelect` function as the `onSelectEvent` prop
    return <ManageEvents onSelectEvent={handleEventSelect} />;
  }

  return (
    <div className="main-menu">
      <h1>Manage {selectedEventData.name}</h1>
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
