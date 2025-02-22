import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import ManageParticipants from './pages/ManageParticipants';
import ManageDrinks from './pages/ManageDrinks';
import LogDrinks from './pages/LogDrinks';
import ViewSummary from './pages/ViewSummary';
import ManageEvents from './pages/ManageEvents';

import { EventProvider } from './context/EventProvider';

const App = () => {
  return (
    <EventProvider >
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/manage-participants" element={<ManageParticipants />} />
        <Route path="/manage-drinks" element={<ManageDrinks />} />
        <Route path="/log-drinks" element={<LogDrinks />} />
        <Route path="/view-summary" element={<ViewSummary />} />
        <Route path="/manage-events" element={<ManageEvents />} />
      </Routes>
    </Router>
    </EventProvider>
  );
};

export default App;
