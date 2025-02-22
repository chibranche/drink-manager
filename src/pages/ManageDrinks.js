import React, {useContext, useState} from 'react';
import { Link } from 'react-router-dom';

import {EventContext} from '../context/EventProvider';


const ManageDrinks = () => {
    const {selectedEventData, addDrink, deleteDrink, editDrink} = useContext(EventContext);

    const [newDrinkName, setNewDrinkName] = useState('');
    const [editDrinkName, setEditDrinkName] = useState(''); //Initial name of the drink to be edited
    const [editDrinkInput, setEditDrinkInput] = useState(''); //New name for the drink to be edited

    const drinkList = selectedEventData.drinks

    return(
        <div className="manage-drinks">
                            <h1>Manage Drinks</h1>

            {/* Normal menu when not editing a drink name */}
            {!editDrinkName?.length && (
                <>
            <div className="add-drink">
                <input
                    type="text"
                    placeholder="Enter drink name"
                    value={newDrinkName}
                    onChange={(e) => setNewDrinkName(e.target.value)}
                />
                <button onClick={() => {
                    addDrink(newDrinkName)
                    setNewDrinkName('')
                }}>Add Drink</button>
            </div>
            <ul className="drink-list">
                {drinkList.map((drink, index) => (
                    <li key={index} style={{marginBottom: '1rem'}}>
                        <b>{drink}</b>
                        <br />
                        <button onClick={() => deleteDrink(drink)}>Delete</button>
                        <button onClick={() => {
                            setEditDrinkName(drink)
                            setEditDrinkInput(drink)
                        }}>Edit</button>
                    </li>
                ))}
            </ul>
                </>
            )}
            
            {/* Editing a drink name */}
            {!!editDrinkName?.length && (
                <div className="edit-drink">
                    <input
                        type="text"
                        value={editDrinkInput}
                        onChange={(e) => setEditDrinkInput(e.target.value)}
                    />
                    <button onClick={() => {
                        editDrink(editDrinkName, editDrinkInput)
                        setEditDrinkName('')
                        setEditDrinkInput('')
                    }}>Save</button>
                </div>
            )}

            {/* Go back to main menu Link */}
      <div className="menu-buttons">
        <Link to="/" className="menu-button">Main menu</Link>
      </div>

        </div>
    )
}

export default ManageDrinks;