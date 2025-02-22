import React, { useContext } from 'react';
import { EventContext } from '../context/EventProvider';

const ViewSummary = () => {
    const { selectedEventData } = useContext(EventContext);

    if (!selectedEventData) {
        return <p>Loading event data...</p>;
    }

    const { name, participants, drinks, roundHistory } = selectedEventData;

    // Calculate total drinks consumed
    const totalDrinks = roundHistory.flat().length;

    // Drinks per participant
    const drinksPerParticipant = {};
    participants.forEach(participant => drinksPerParticipant[participant.name] = 0);
    roundHistory.flat().forEach(drink => drinksPerParticipant[drink.participant]++);

    // Special stats
    const mostDrinks = Object.entries(drinksPerParticipant).sort((a, b) => b[1] - a[1])[0];
    const leastDrinks = Object.entries(drinksPerParticipant).sort((a, b) => a[1] - b[1])[0];
    const drinkCounts = {};
    roundHistory.flat().forEach(drink => drinkCounts[drink.name] = (drinkCounts[drink.name] || 0) + 1);
    const mostPopularDrink = Object.entries(drinkCounts).sort((a, b) => b[1] - a[1])[0];

    return (
        <div className="receipt bg-gray-100 p-4 rounded-lg shadow-md w-80 mx-auto text-mono">
            <h1 className="text-center font-bold text-lg border-b pb-2 mb-2">Event Receipt</h1>
            <p className="text-center font-semibold">{name}</p>
            <hr className="my-2" />
            
            <p><strong>Participants:</strong></p>
            <ul>
                {participants.map(p => (
                    <li key={p.id}>{p.name} ({drinksPerParticipant[p.name]} drinks)</li>
                ))}
            </ul>
            
            <p><strong>Total Drinks:</strong> {totalDrinks}</p>
            <p><strong>Number of Rounds:</strong> {roundHistory.length}</p>
            
            <hr className="my-2" />
            <p><strong>Stats:</strong></p>
            <p>🥇 Most Drinks: {mostDrinks[0]} ({mostDrinks[1]})</p>
            <p>🥉 Least Drinks: {leastDrinks[0]} ({leastDrinks[1]})</p>
            <p>🍹 Most Popular Drink: {mostPopularDrink[0]} ({mostPopularDrink[1]})</p>
        </div>
    );
};

export default ViewSummary;
