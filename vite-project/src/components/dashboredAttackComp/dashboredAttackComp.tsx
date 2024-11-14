import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from "../../store/store";
import { Attack } from "../../types/Attack";
import { addAttack, fetchAttacksByDestination, fetchAttacksByLocation } from "../../store/features/attackSlice";
import "./dashBoredAttack.css"
import { IMissileDetails } from "../../types/Attack";
import { LoginResponse } from '../../store/features/userSlice';

const DashboardAttack: React.FC = () => {
    const currentUser = useSelector((state: RootState) => state.users.currentUser);
    const [user, setUser] = useState<LoginResponse>({message: '', responseData: {username: '', organization: '', weapons: []}, token: ''});
    const dispatch = useDispatch<AppDispatch>();

    const [selectedTarget, setSelectedTarget] = useState<string>('');
    const [attacks, setAttacks] = useState<Attack[]>([]);

    useEffect(() => {
        dispatch(fetchAttacksByLocation(currentUser!.responseData.organization));
        
        setUser(currentUser!);
        
    }, [dispatch]);



    useEffect(() => {
        if (attacks.length > 0) {
            localStorage.setItem('attacks', JSON.stringify(attacks));
        }
    }, [attacks]);


    // useEffect(() => {
    //     const storedAttacks = localStorage.getItem('attacks');
    //     if (storedAttacks) {
    //         setAttacks(JSON.parse(storedAttacks));  
    //     }
    // }, []);

    

    // useEffect(() => {
        
    // }, [dispatch]);

    
    const handleTargetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTarget(event.target.value);
    };

    const calculateArrivalTime = (speed: number, distance: number = 100): number => {
        return distance / speed;    
    };

    const handleLaunch = (weaponName: string, speed: number, intercepts: string[], price: number, amount: any) => {
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

        // const weaponIndex = currentUser?.responseData.weapons.findIndex(w => w.name === weaponName);
        // if (weaponIndex !== undefined && weaponIndex >= 0 && currentUser!.responseData.weapons[weaponIndex].amount > 0) {
        //     currentUser!.responseData.weapons[weaponIndex].amount -= 1;
        // }
    };

    if (currentUser === null || undefined)
        currentUser == localStorage.getItem('currentUser')
     
        // console.log("Current User is nulll:", currentUser);
        // return <div>Loading user data...</div>;
        const attacksList = useSelector((state: RootState) => state.attacks.attacks);
        

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

            <div className="target-selector">
                <label>Select Target Area:</label>
                <select value={selectedTarget} onChange={handleTargetChange}>
                    <option value="">Choose Target</option>
                    <option value="IDF - North">North Israel</option>
                    <option value="IDF - South">South Israel</option>
                    <option value="IDF - Center">Center Israel</option>
                    <option value="IDF - West Bank">West Bank Israel</option>
                </select>
            </div>

            <div className="attack-log">
                <h3>Attack Log</h3>
                <table className="attack-table">
                    <thead>
                        <tr>
                            <th>Missile</th>
                            <th>Destination</th>
                            <th>Arrival Time (seconds)</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attacksList.map((attack: Attack) => (
                            <tr key={attack._id}>
                                <td>{attack.missileName}</td>
                                <td>{attack.destination}</td>
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

export default DashboardAttack;
