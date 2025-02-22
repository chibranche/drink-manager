import React, { useState } from 'react';

import {EventContext} from '../context/EventProvider';

import "./ManageEvents.css"

const ManageEvents = (props) => {
  const [eventName, setEventName] = useState('');
  const [editNameId, setEditNameId] = useState(null);
  const [editNameInput, setEditNameInput] = useState('');

const {events, createEvent, editEventName, deleteEvent, copyEvent} = React.useContext(EventContext);

  return (
    <div className="manage-events">
      <h1>Select or Create an Event</h1>

      {/* Normal menu when not editing name */}
      {!editNameId && (
        <>
        <div className="add-event">
        <input
          type="text"
          placeholder="Enter event name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <button onClick={()=>{createEvent(eventName)}}>Add Event</button>
      </div>
      <ul className="event-list">
      {events.map((event) => {
        return(
        <li key={event.id} style={{marginBottom: '1rem'}}>
          <b>{event.name}</b> - created on {event?.createdOn}
          <br />
          <button onClick={() => props.onSelectEvent(event)}>Select</button>
          <button onClick={() => deleteEvent(event.id)}>Delete</button>
          <button onClick={() => {
            setEditNameId(event.id)
            setEditNameInput(event.name)
            }}>Edit</button>
            <button onClick={() => copyEvent(event.id)}>Copy</button>
        </li>
      )})}
    </ul>
    </>
      )}

{/* Menu when editing name */}
{!!editNameId && (
  <div className="edit-name">
    <input
      type="text"
      value={editNameInput}
      onChange={(e) => setEditNameInput(e.target.value)}
    />
    <button onClick={() => {
      editEventName(editNameId, editNameInput);
      setEditNameId(null);
      setEditNameInput('');
    }}>Save</button>

    <button onClick={() => {
      setEditNameId(null);
      setEditNameInput('');
    }}>Cancel</button>

  </div>)}

    </div>
  )

};

export default ManageEvents;
