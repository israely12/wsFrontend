import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import type { User } from '../../types/User'
import axios from 'axios'

const BASE_URL = "http://localhost:5000/api/users/";

export interface Weapon {
    name: string;
    description: string;
    speed: number;
    intercepts: string[];
    price: number;
    amount: number;
}

export interface UserResponseData {
    username: string;
    organization: string;
    weapons: Weapon[];
}

export interface LoginResponse {
    message: string;
    responseData: UserResponseData;
    token: string;
}
interface UserState {
    users: User[]
    currentUser: LoginResponse | null
    status: 'idle' | 'loading' | 'succeeded'| 'failed'
    error: string | null
    
    }  

const initialState: UserState = {
    users: [],
    currentUser: null,
    status: 'idle',
    error: null,
    
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () : Promise<User[] | undefined> => {
    
    const response = await axios.get(BASE_URL);    
    return response.data;
});

export const addUser = createAsyncThunk('users/addUser', async (user:Partial<User>) => {
    
    const response = await axios.post(`${BASE_URL}register`, user);
    return response.data;  
})

export const loginUser = createAsyncThunk('users/loginUser', async (user:Partial<User>) => {
    
    const response = await axios.post(`${BASE_URL}login`, user);
    
    if(response.data){
    const token : string = response.data.token;
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('attacks');
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(response.data.responseData));

    return response.data;
    }
    return;
    
})

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchUsers.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
            if(action.payload) 
            state.users = action.payload;
            state.status = 'succeeded';
            
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message ?? 'Unknown error';
        })
        .addCase(addUser.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(addUser.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.users.push(action.payload);
        })
        .addCase(addUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message ?? 'Unknown error';
        })
        .addCase(loginUser.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.currentUser = action.payload;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message ?? 'Unknown error';
        })

        
    },
} 

)
export default usersSlice.reducer
