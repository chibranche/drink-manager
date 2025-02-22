import React, { useContext, useRef } from 'react';
import { useReactToPrint } from "react-to-print";

import { EventContext } from '../context/EventProvider';

import './ViewSummary.css';

const ViewSummary = () => {
    const { selectedEventData } = useContext(EventContext);

    const receiptRef = useRef(null); // Reference for printing

    const handlePrint = useReactToPrint({
        contentRef: receiptRef, // Reference to the component to be printed
        removeAfterPrint: true, // Optional: removes content after print
    });

    if (!selectedEventData) {
        return <p>Loading event data...</p>;
    }

    const { name, participants, roundHistory } = selectedEventData;

    // Total drinks ordered
    let totalDrinksOrdered = {};

    // Calculate total drinks consumed
    const totalDrinks = roundHistory.reduce((acc, round) => {
        totalDrinksOrdered[round.drink] = (totalDrinksOrdered[round.drink] || 0) + round.participants.length;
        return acc + round.participants.length;
    }, 0);

    // Drinks per participant
    const drinksPerParticipant = participants.reduce((acc, participant) => {
        const drinksOrdered = roundHistory.reduce((acc, round) => {
            return acc + (round.participants.includes(participant.id) ? 1 : 0);
        }, 0);

        return { ...acc, [participant.name]: drinksOrdered };
    }, {});

    // Special stats
    const mostDrinks = Object.entries(drinksPerParticipant).sort((a, b) => b[1] - a[1])[0];
    const leastDrinks = Object.entries(drinksPerParticipant).sort((a, b) => a[1] - b[1])[0];
    const drinkCounts = {};
    roundHistory.flat().forEach(drink => drinkCounts[drink.name] = (drinkCounts[drink.name] || 0) + 1);
    const mostPopularDrink = Object.entries(totalDrinksOrdered).sort((a, b) => b[1] - a[1])[0];

    if (!mostDrinks) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div className="receipt" ref={receiptRef}>
                <h1>Event Receipt</h1>
                <p className="text-center"><b>{name}</b> - {new Date().toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                    hour: 'numeric',
                    minute: 'numeric',
                })}</p>
                <hr />

                <p><strong><b>{participants.length} participants:</b></strong></p>
                <ul>
                    {participants.map(p => (
                        <li key={p.id} className="participant">
                            {p.name}
                            <ul className="drinks-list">
                                {p.drinks
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map(d => (
                                        <li key={d.name} className="drink-entry">
                                            {d.name}  x{d.count}
                                        </li>
                                    ))}
                            </ul>
                            <strong>Total:</strong> {totalDrinksOrdered[p.name]}
                        </li>
                    ))}
                </ul>

                <hr />
                <p><strong>Drinks summary:</strong></p>
                <ul>
                    {Object.entries(totalDrinksOrdered).map(([drink, count]) => (
                        <li key={drink}>{drink}  x{count}</li>
                    ))}
                </ul>

                <p><strong>Total Drinks:</strong> {totalDrinks}</p>
                <p><strong>Number of Rounds:</strong> {roundHistory.length}</p>

                <hr />
                <p><strong>Stats:</strong></p>
                <p>🥇 Most Drinks: {mostDrinks[0]} ({mostDrinks[1]})</p>
                <p>🥉 Least Drinks: {leastDrinks[0]} ({leastDrinks[1]})</p>
                <p>🍹 Most Popular Drink: {mostPopularDrink[0]} ({mostPopularDrink[1]})</p>
                <hr />
            </div>

            <button onClick={() => window.history.back()}>Back</button>
            <button className="print-button" onClick={handlePrint}>🖨 Print / Save as PDF</button>
        </>
    );
};

export default ViewSummary;
