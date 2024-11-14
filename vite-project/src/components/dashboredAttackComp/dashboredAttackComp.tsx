import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from "../../store/store";
import { Attack } from "../../types/Attack";
import { addAttack } from "../../store/features/attackSlice";
import "./dashBoredAttack.css"
import { IMissileDetails } from "../../types/Attack";
import { spread } from 'axios';

const DashboardAttack: React.FC = () => {
    const currentUser = useSelector((state: RootState) => state.users.currentUser);
    const dispatch = useDispatch<AppDispatch>();

    const [selectedTarget, setSelectedTarget] = useState<string>('');
    const [attacks, setAttacks] = useState<Attack[]>([]);

    useEffect(() => {
        console.log("Current User:", currentUser);
    }, [currentUser]);
    

    // קריאת הנתונים מה-localStorage בעת אתחול הרכיב
    useEffect(() => {
        const storedAttacks = localStorage.getItem('attacks');
        if (storedAttacks) {
            setAttacks(JSON.parse(storedAttacks)); // המרת המידע מ-missing storage לאובייקט
        }
    }, []);

    // שמירת ההתקפות ב-localStorage כל פעם שהסטייט של attacks משתנה
    useEffect(() => {
        if (attacks.length > 0) {
            localStorage.setItem('attacks', JSON.stringify(attacks));
        }
    }, [attacks]);

    // Handle change in target selection
    const handleTargetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTarget(event.target.value);
    };

    // Calculate arrival time based on weapon speed and simulate distance (assume fixed distance for now)
    const calculateArrivalTime = (speed: number, distance: number = 100): number => {
        return distance / speed; // זמן פגיעה בשניות
    };

    // Launch the weapon and log the attack
    const handleLaunch = (weaponName: string, speed: number, intercepts: string[], price: number, amount: any) => {
        if (!selectedTarget) {
            alert('Please select a target before launching.');
            return;
        }

        const arrivalTime = speed;

        // יצירת אובייקט התקפה בצורה נכונה
        const newAttack: Attack = {
            _id: Math.random().toString(36).substring(7), // ניתן להשתמש ב-ID אקראי או ID מהשרת
            missileName: weaponName,
            location: currentUser!.responseData.organization,
            destination: selectedTarget,
            missileDetails: {  // יצירת פרטי טיל בצורה נכונה
                speed: speed,
                intercepts: intercepts,  // מערך של טילים שניתן ליירט
                price: price,
                amount: amount,
                arrivalTime: arrivalTime,  // זמן הגעת הטיל
            },
            status: 'Launched'  // סטטוס התקיפה
        };

        // שלח את אובייקט ההתקפה ל-redux
        dispatch(addAttack(newAttack));
        // עדכן את הסטייט של ההתקפות עם ההתקפה החדשה
        setAttacks(prevAttacks => [...prevAttacks, newAttack]);

        // עדכון כמות הטילים
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
                        {attacks.map((attack: Attack) => (
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
