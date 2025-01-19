import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ManageEvents = (props) => {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState('');

  console.log('props', props); // Logging props to see the onSelectEvent function

  // Load events from local storage when the component mounts
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setEvents(savedEvents);
  }, []);

  // Save events to local storage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('events', JSON.stringify(events));
    }
  }, [events]);

  // Handle adding a new event
  const addEvent = () => {
    if (eventName.trim()) {
      const newEvent = { id: uuidv4(), name: eventName.trim() };
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents); // Update state
      localStorage.setItem('events', JSON.stringify(updatedEvents)); // Save to localStorage
      setEventName(''); // Clear the input field
    }
  };

  // Handle deleting an event
  const deleteEvent = (id) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents); // Update state
    localStorage.setItem('events', JSON.stringify(updatedEvents)); // Save to localStorage
  };

  return (
    <div className="manage-events">
      <h1>Select or Create an Event</h1>
      <div className="add-event">
        <input
          type="text"
          placeholder="Enter event name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <button onClick={addEvent}>Add Event</button>
      </div>
      <ul className="event-list">
        {events.map((event) => (
          <li key={event.id}>
            {event.name}
            <button onClick={() => props.onSelectEvent(event)}>Select</button>
            <button onClick={() => deleteEvent(event.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageEvents;
