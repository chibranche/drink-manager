import React, { createContext, useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create the context
export const EventContext = createContext();

// Create the provider component
export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [confirmationMessage, setConfirmationMessage] = useState(null);

    const selectedEventData = useMemo(() => {
      let currentEventData = events.find((event) => event.id === selectedEventId);
      if (!currentEventData) {
        return {
          id: null,
          name: '',
          participants: [],
          drinks: [],
          createdOn: null,
          roundHistory: [],
        }
      }
      return currentEventData;
    }, [events, selectedEventId]);

    // ############################
    // useEffects
    // ############################

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

    // Load the selected event from local storage when the app starts
    useEffect(() => {
      const savedEvent = localStorage.getItem('selectedEventId');
      if (savedEvent) {
        setSelectedEventId(savedEvent);
      }
    }, []);

    // Autoclose confirmation message after 3 seconds
    useEffect(() => {
      if (confirmationMessage) {
        const timeout = setTimeout(() => {
          setConfirmationMessage(null);
        }, 3000);
        return () => clearTimeout(timeout);
      }
    }, [confirmationMessage]);

// ############################
// State edit functions
// ############################

    // Handle selecting an event
    const handleEventSelect = (event) => {
      setSelectedEventId(event.id);
      localStorage.setItem('selectedEventId', event.id);
    };

      // Handle switching events
  const handleSwitchEvent = () => {
    setSelectedEventId(null);
    localStorage.removeItem('selectedEventId');
  };

  const createEvent = (name) => {
    if (name.trim()) {
      const newEvent = { 
        id: uuidv4(), 
        name: name.trim(), 
        createdOn: new Date().toISOString(),
        participants: [], 
        drinks: []
       };
      setEvents([...events, newEvent]);
    }
};

const deleteEvent = (id) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents);
}

const editEventName = (id, newName) => {
    const updatedEvents = events.map((event) => {
        if (event.id === id) {
            return { ...event, name: newName };
        }
        return event;
    });
    setEvents(updatedEvents);
}

const copyEvent = (id) => {
    const eventToCopy = events.find((event) => event.id === id);
    if (eventToCopy) {
        const newEvent = { 
          ...eventToCopy, 
          name: `${eventToCopy.name} (copy)`, 
          id: uuidv4() 
        };

        setEvents([...events, newEvent]);
    }
}

const closeConfirmationMessage = () => {
    setConfirmationMessage(null);
}

const addParticipant = (participantName) => {
    const updatedEvent = { ...selectedEventData, participants: [...selectedEventData.participants, 
              {name: participantName, id: uuidv4(), drinks:[], drinkHistory: [] }
            ]}

    const newEvents = events.map((event) => event.id === selectedEventData.id ? updatedEvent : event);
    setEvents(newEvents);
}

const deleteParticipant = (participantId) => {
    const updatedEvent = {...selectedEventData, participants: selectedEventData.participants.filter((p) => p.id !== participantId)};

    const newEvents = events.map((event) => event.id === selectedEventData.id ? updatedEvent : event);
    setEvents(newEvents);
}

const addDrink = (drinkName) => {
  const updatedEvent = { 
    ...selectedEventData,
    //Filter for duplicates
    drinks: [...selectedEventData.drinks, drinkName].filter((value, index, self) => self.indexOf(value) === index)};

  const newEvents = events.map((event) => event.id === selectedEventData.id ? updatedEvent : event);
  setEvents(newEvents);
}

const deleteDrink = (drinkName) => {
  const updatedEvent = { ...selectedEventData, drinks: selectedEventData.drinks.filter((name) => name !== drinkName) };

  const newEvents = events.map((event) => event.id === selectedEventData.id ? updatedEvent : event);
  setEvents(newEvents);
}

const editParticipant = (participantId, newName) => {
    const updatedEvent = { ...selectedEventData, participants: selectedEventData.participants.map((p) => p.id === participantId ? { ...p, name: newName } : p) };

    const newEvents = events.map((event) => event.id === selectedEventData.id ? updatedEvent : event);
    setEvents(newEvents);
}

const editDrink = (oldName, newName) => {
  const updatedEvent = { ...selectedEventData,
    drinks: selectedEventData.drinks.map((name) => name === oldName ? newName : name).filter((value, index, self) => self.indexOf(value) === index),
    participants: selectedEventData.participants.map((p) => ({ ...p, drinks: p.drinks.map((name) => name === oldName ? newName : name) }))
  };

    const newEvents = events.map((event) => event.id === selectedEventData.id ? updatedEvent : event);
    setEvents(newEvents);
  }

  //Add a drink to a participant
  // participant.drinks = [{name: 'Coke', count: 2}, {name: 'Pepsi', count: 1}]
  // participant.drinkHistory = [{name: 'Coke', timestamp: '2021-09-01T12:00:00'}, {name: 'Pepsi', timestamp: '2021-09-01T12:00:00'}]
  const logDrink = (participantIdsArray, drinkName) => {
    let updatedParticipants = selectedEventData.participants.map((participant) => {
        if (participantIdsArray.includes(participant.id)) {
            let drink = participant.drinks.find((d) => d.name === drinkName);
            
            participant.drinkHistory.push({ name: drinkName, timestamp: new Date().toISOString() });
            
            if (drink) {
                participant.drinks = participant.drinks.map((d) => 
                    d.name === drinkName ? { name: drinkName, count: d.count + 1 } : d
                );
            } else {
                participant.drinks.push({ name: drinkName, count: 1 });
            }
        }

        // Display a confirmation message on top of the page
        setConfirmationMessage(`${participantIdsArray.length} drink(s) logged`);

        return participant;
    });

    const lastRound = {participants: participantIdsArray, drink: drinkName, timestamp: new Date().toISOString(), roundNumber: selectedEventData.roundHistory.length + 1};

    const newRoundHistory = selectedEventData?.roundHistory ? [...selectedEventData.roundHistory, lastRound] : [lastRound];

    const updatedEvent = { ...selectedEventData, participants: updatedParticipants, roundHistory: newRoundHistory };

    const newEvents = events.map((event) => event.id === selectedEventData.id ? updatedEvent : event);
    setEvents(newEvents);
};


const undoDrink = (index) => {
  if (!selectedEventData?.roundHistory?.length) {
      return;
  }

  const roundToDelete = selectedEventData.roundHistory[index]

  // const lastRound = selectedEventData.roundHistory.pop();

  const participantIdsArray = roundToDelete.participants;

  const updatedEvent = { ...selectedEventData, participants: selectedEventData.participants.map((participant) => {
      if (participantIdsArray.includes(participant.id)) {
          let lastDrink = participant.drinkHistory.pop();
          let drink = participant.drinks.find((d) => d.name === lastDrink.name);
          if (drink) {
              participant.drinks = participant.drinks.map((d) => d.name === lastDrink.name ? { name: lastDrink.name, count: d.count - 1 } : d);
          }
      } 
      return participant;
  }),
  roundHistory: selectedEventData.roundHistory.filter((round, i) => i !== index)
};

    const newEvents = events.map((event) => event.id === selectedEventData.id ? updatedEvent : event);
    setEvents(newEvents);

    // Add notification
    setConfirmationMessage('Drink undone');
  }


    return (
        <EventContext.Provider value={{ 
            events,
            selectedEventId,
            selectedEventData,
            confirmationMessage,
            closeConfirmationMessage,

            handleEventSelect,
            handleSwitchEvent,
            createEvent,
            deleteEvent,
            editEventName,
            copyEvent,

            addParticipant,
            deleteParticipant,
            editParticipant,
            addDrink,
            deleteDrink,
            editDrink,
            logDrink,
            undoDrink,
             }}>
            {children}
        </EventContext.Provider>
    );
};