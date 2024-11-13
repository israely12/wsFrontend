import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User } from "../../types/User";
import { addUser } from "../../store/features/userSlice";
import { AppDispatch, RootState } from "../../store/store";
import style from "./registerComp.module.css";

const Register: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [organization, setOrganization] = useState('');
    const [subOption, setSubOption] = useState('');

    const { error, status } = useSelector((state: RootState) => state.users);

    const handleRegister = async(e: React.FormEvent) => {
        e.preventDefault();
        const newUser: Partial<User> = {
            username: name,
            password: password,
            organization: organization,
            location: organization === 'IDF' ? subOption : '',
        };
        await dispatch(addUser(newUser));

        if (status === 'succeeded') {
            setName('');
            setPassword('');
            }
    };

    return (
        <div className={style["register-container"]}>
            <h2>Register</h2>
            {status === 'loading' && <p>Loading...</p>}
            {error && <p className={style["error-message"]}>Error: {error}</p>}
            <form onSubmit={handleRegister} className={style["register-form"]}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={style["input-field"]}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={style["input-field"]}
                />
                <select 
                    value={organization} 
                    onChange={(e) => setOrganization(e.target.value)} 
                    className={style["input-field"]}
                >
                    <option value=""> Select Organization</option>
                    <option value="IDF">IDF</option>
                    <option value="Hezbollah">Hezbollah</option>
                    <option value="Hamas">Hamas</option>
                    <option value="IRGC">IRGC</option>
                    <option value="Houthis">Houthis</option>
                </select>
                
                {organization === 'IDF' && (
                    <select
                        value={subOption}
                        onChange={(e) => setSubOption(e.target.value)}
                        className={style["input-field"]}
                    >
                        <option value="">Select IDF Area</option>
                        <option value="IDF - North">North Area</option>
                        <option value="IDF - South">South Area</option>
                        <option value="IDF - Center">Center Area</option>
                        <option value="IDF - West Bank">West Bank Area</option>
                    </select>
                )}
                
                <button 
                    type="submit" 
                    disabled={status === 'loading'} 
                    className={style["register-button"]}
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
