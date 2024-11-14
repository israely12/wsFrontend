import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/features/userSlice";
import { AppDispatch, RootState } from "../../store/store";
import {  useNavigate } from "react-router-dom";
import "./loginComp.css";


const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { status, error } = useSelector((state: RootState) => state.users);

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();
    
    const user = { username, password };
    await dispatch(loginUser(user));
    

    if (status === 'succeeded') {
       
        
      setUsername('');
      setPassword('');

      navigate('/dashboardAttack');
      }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {status === 'loading' && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={status === 'loading'}>Login</button>
      </form>
    </div>
  );
};

export default Login;
