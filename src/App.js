import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
<Router basename="/drink-manager">
  <Routes>
    <Route path="/" element={<MainMenu />} />
    <Route path="/manage-participants" element={<ManageParticipants />} />
    <Route path="/manage-drinks" element={<ManageDrinks />} />
    <Route path="/log-drinks" element={<LogDrinks />} />
    <Route path="/view-summary" element={<ViewSummary />} />
    <Route path="/manage-events" element={<ManageEvents />} />
    <Route path="*" element={
      <>
      <h1>Not Found !</h1>
      <p>Sorry, there is nothing here.</p>
      <Link to="/">Back to Home</Link>
      </>}
       />
  </Routes>
</Router>
    </EventProvider>
  );
};

export default App;
