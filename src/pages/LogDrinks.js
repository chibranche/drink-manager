import React, {useContext, useState} from 'react';
import { Link } from 'react-router-dom';

import {EventContext} from '../context/EventProvider';

import './LogDrinks.css';

// Select a drink, select participants, then "log"
const LogDrinks = () => {
    const {selectedEventData, logDrink, undoDrink, confirmationMessage, closeConfirmationMessage} = useContext(EventContext);
    
    const [displayType, setDisplayType] = useState('selectDrink'); //selectDrink, selectParticipant
    const [drinkName, setDrinkName] = useState('');
    const [participantsIdArray, setParticipantsIdArray] = useState([]);
    const [currentRoundIndex, setCurrentRoundIndex] = useState();

    const selectDrinkFunc = () => {
        const drinkList = selectedEventData.drinks;
    
        return (
            <div className="select-drink">
                <h2>Select Drink</h2>
                <div className="drink-grid">
                    {drinkList.map((drink, index) => (
                        <button 
                            key={index} 
                            className="drink-button"
                            onClick={() => {
                                setDrinkName(drink);
                                setDisplayType("selectParticipant");
                            }}
                        >
                            {drink}
                        </button>
                    ))}
                </div>
            </div>
        );
    };    

    const selectParticipantFunc = () => {
        const participants = selectedEventData.participants;
    
        return (
            <div className="select-participant">
                <h2>Select Participants</h2>
                <div className="selected-drink">
                    <p>Selected drink: <b>{drinkName}</b></p>
                    <button onClick={() => { setDisplayType('selectDrink'); }}>Change drink</button>
                </div>
    
                <p>Who is drinking?</p>
                <div className="participant-grid">
                    {
                        // Order alphabetically
                        participants
                        .sort((a, b) => a.name.localeCompare(b.name))
                    .map((participant, index) => (
                        <button 
                            key={index} 
                            className={`participant-button ${participantsIdArray.includes(participant.id) ? 'selected' : ''}`}
                            onClick={() => {
                                if (participantsIdArray.includes(participant.id)) {
                                    setParticipantsIdArray(participantsIdArray.filter(id => id !== participant.id));
                                } else {
                                    setParticipantsIdArray([...participantsIdArray, participant.id]);
                                }
                            }}
                        >
                            {participant.name}
                        </button>
                    ))}
                </div>
    
                <button onClick={() => {
                    logDrink(participantsIdArray, drinkName);
                    setParticipantsIdArray([]);
                }}>Confirm !</button>
    
                <button onClick={() => {
                    setParticipantsIdArray([]);
                    setDisplayType('selectDrink');
                }}>Clear all</button>
            </div>
        );
    };
    

    const displayLogFunc = () => {
        if (!selectedEventData) {
            return <p>Loading event data...</p>;
        }

        const hasRoundInHistory = selectedEventData.roundHistory.length > 0;
        if (!hasRoundInHistory) {
            return <p className="no-log">No drinks logged yet</p>;
        }

        const roundindex = currentRoundIndex !== undefined ? currentRoundIndex : selectedEventData.roundHistory.length - 1;
    
        // Get the selected round from history
        const selectedRound = selectedEventData.roundHistory[roundindex];

        if (!selectedRound) {
            return <p>Round not found</p>;
        }
    
        // Extract participant names and drink name
        const participants = selectedEventData.participants.filter(participant => 
            selectedRound.participants.includes(participant.id)
        );
        const drinkName = selectedRound.drink;
    
        return (
            <div className="log-container">
                <h2>Round {selectedRound.roundNumber}</h2>
                <div className="log-details">
                    <p><strong>Drink:</strong> {drinkName}</p>
                    <p><strong>Participants:</strong> {participants.map(participant => participant.name).join(', ')}</p>
                    <p><strong>Time:</strong> {new Date(selectedRound.timestamp).toLocaleString()}</p>
                </div>
                
                <div className="log-navigation">
                    <button 
                        className="nav-button" 
                        onClick={() => {
                            setCurrentRoundIndex(prev => prev !== undefined ? Math.max(prev - 1, 0) : roundindex-1)
                        }}
                        disabled={roundindex === 0}
                    >
                        ⬅ Previous
                    </button>
                    <button 
                        className="nav-button" 
                        onClick={() =>{
                             setCurrentRoundIndex(prev => prev !== undefined ? Math.min(prev + 1, selectedEventData.roundHistory.length - 1) : roundindex)}
                            }
                             disabled={roundindex === selectedEventData.roundHistory.length - 1}
                    >
                        Next ➡
                    </button>

                    <button className="undo-button" onClick={() => {
                        undoDrink(roundindex);
                        setCurrentRoundIndex(undefined);
                    }
                        }>🗑 DELETE</button>
    
                </div>
            </div>
        );
    };
    

    return (
        <div className="log-drinks">
        {/* Notification */}
        {confirmationMessage && (
            <div onClick={closeConfirmationMessage} className="confirmation-message notification">
                <p>{confirmationMessage}</p>
            </div>
        )}

            <h1>Log Drinks</h1>

            {/* Select drink */}
            {displayType === 'selectDrink' && selectDrinkFunc()}

            {/* Select participant */}
            {displayType === 'selectParticipant' && selectParticipantFunc()}

            {/* Display last log */}
            {displayType === 'displayLastLog' && displayLogFunc()}



            {/* Go back to main menu Link */}
            <div className="menu-buttons">
                {displayType === 'displayLastLog' && 
                    <button 
                        onClick={()=>{setDisplayType("selectDrink")}}
                        className="menu-button">
                        Log another drink
                    </button>
                }
                {displayType !== 'displayLastLog' &&
                    <button 
                        onClick={()=>{setDisplayType("displayLastLog")}}
                        className="menu-button">
                        See last drink logged
                    </button>
                }
                <Link to="/" className="menu-button">Main menu</Link>
            </div>
        </div>
    );
};

export default LogDrinks;