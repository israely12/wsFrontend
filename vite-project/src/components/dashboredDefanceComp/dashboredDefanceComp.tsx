import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from "../../store/store";
import { Attack } from "../../types/Attack";
import { addAttack ,fetchAttacksByDestination} from "../../store/features/attackSlice";
import { IMissileDetails } from "../../types/Attack";
import { LoginResponse } from '../../store/features/userSlice';

import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

const DashboardDefence: React.FC = () => {

    const currentUser = useSelector((state: RootState) => state.users.currentUser);

    const attackToDefend = useSelector((state: RootState) => state.attacks.attacksToDefend);
    const dispatch = useDispatch<ThunkDispatch<RootState, unknown, UnknownAction >>();

    const [selectedTarget, setSelectedTarget] = useState<string>('');
    const [attacks, setAttacks] = useState<Attack[]>([]);

    useEffect(() => {
         
         dispatch(fetchAttacksByDestination(currentUser!.responseData.organization));
        
    }, [dispatch]);
    

    // useEffect(() => {
    //     const storedAttacks = localStorage.getItem('attacks');
    //     if (storedAttacks) {
    //         setAttacks(JSON.parse(storedAttacks));  
    //     }
    // }, []);

    // useEffect(() => {
    //     if (attacks.length > 0) {
    //         localStorage.setItem('attacks', JSON.stringify(attacks));
    //     }
    // }, [attacks]);

    const handleTargetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTarget(event.target.value);
    };

    const handleLaunch = (weaponName: string, speed: number, intercepts: string[], price: number, amount: number) => {
        if (!selectedTarget) {
            alert('Please select a target before launching.');
            return;
        }

        const arrivalTime = speed;

        const newAttack: Attack = {
            _id: Math.random().toString(36).substring(7),
            missileName: weaponName,
            location: currentUser!.responseData.organization,
            destination: selectedTarget,
            missileDetails: {    
                speed: speed,
                intercepts: intercepts,  
                price: price,
                amount: amount,
                arrivalTime: arrivalTime,    
            },
            status: 'Launched'  
        };

        dispatch(addAttack(newAttack));

        setAttacks(prevAttacks => [...prevAttacks, newAttack]);

        const weaponIndex = currentUser?.responseData.weapons.findIndex(w => w.name === weaponName);
        if (weaponIndex !== undefined && weaponIndex >= 0 && currentUser!.responseData.weapons[weaponIndex].amount > 0) {
            currentUser!.responseData.weapons[weaponIndex].amount -= 1;
        }
    };

    if (!currentUser) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="dashboard-attack">
            <h1>Organization: {currentUser?.responseData.organization}</h1>
        
            <div className="navbar">
                {currentUser?.responseData.weapons.map((weapon: any) => (
                    <button 
                        key={weapon.name} 
                        onClick={() => handleLaunch(
                            weapon.name, 
                            weapon.speed, 
                            weapon.intercepts, 
                            weapon.price, 
                            weapon.amount
                        )} 
                        disabled={weapon.amount <= 0}
                        className="weapon-button"
                    >
                        {weapon.name} ({weapon.amount})
                    </button>
                    
                ))}
            </div>

            {/* <div className="target-selector">
                <label>Select Target Area:</label>
                <select value={selectedTarget} onChange={handleTargetChange}>
                    <option value="">Choose Target</option>
                    <option value="IDF - North">North Israel</option>
                    <option value="IDF - South">South Israel</option>
                    <option value="IDF - Center">Center Israel</option>
                    <option value="IDF - West Bank">West Bank Israel</option>
                </select>
            </div> */}

            <div className="attack-log">
                <h3>Defance Log</h3>
                <table className="attack-table">
                    <thead>
                        <tr>
                            <th>Missile</th>
                            <th>Launch Location</th>
                            <th>Arrival Time (seconds)</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attackToDefend.map((attack: Attack) => (
                            <tr key={attack._id}>
                                <td>{attack.missileName}</td>
                                <td>{attack.location}</td>
                                <td>{attack.missileDetails.arrivalTime}</td>
                                <td>{attack.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardDefence;
