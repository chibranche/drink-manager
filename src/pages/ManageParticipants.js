import React, {useContext, useState} from 'react';
import { Link } from 'react-router-dom';

import {EventContext} from '../context/EventProvider';

const ManageParticipants = () => {
    const [participantName, setParticipantName] = useState('');
    const [editParticipantId, setEditParticipantId] = useState(null);
    const [editParticipantInput, setEditParticipantInput] = useState('');

    const {selectedEventData, addParticipant, deleteParticipant, editParticipant} = useContext(EventContext);

    return (
        <div className="manage-participants">
        <h1>Manage Participants</h1>

        {/* Normal menu when not editing name */}
        {!editParticipantId && (
            <>
                <div className="add-participant">
                <input
                  type="text"
                  placeholder="Enter participant name"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                />
                <button onClick={()=>{
                    addParticipant(participantName)
                    setParticipantName('')
                    }}>Add Participant</button>
                </div>
        
                <ul className="participant-list">
                {selectedEventData.participants.map((participant) => (
                  <li key={participant.id} style={{marginBottom: '1rem'}}>
                    <b>{participant.name}</b>
                    <br />
                    <button onClick={() => deleteParticipant(participant.id)}>Delete</button>
                    <button onClick={() => {
                      setEditParticipantId(participant.id)
                      setEditParticipantInput(participant.name)
                    }}>Edit</button>
                  </li>
                ))}
                </ul>
                </>
        )}


        {/* Menu when editing name */}
        {!!editParticipantId && (
            <div className="edit-participant">
            <input
                type="text"
                value={editParticipantInput}
                onChange={(e) => setEditParticipantInput(e.target.value)}
            />
            <button onClick={() => {
                editParticipant(editParticipantId, editParticipantInput);
                setEditParticipantId(null);
                setEditParticipantInput('');
            }
            }>Save</button>

            <button onClick={() => {
                setEditParticipantId(null);
                setEditParticipantInput('');
            }
            }>Cancel</button>

            </div>)}


            {/* Go back to main menu Link */}
      <div className="menu-buttons">
        <Link to="/" className="menu-button">Main menu</Link>
      </div>
                </div>

    );

}

export default ManageParticipants;