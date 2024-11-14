import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { Attack } from '../../types/Attack';
import axios from 'axios'

const BASE_URL = "http://localhost:5000/api/attacks/";


interface AttackState {
    attacks: Attack[]
    status: 'idle' | 'loading' | 'succeeded'| 'failed'
    error: string | null
    
    }  

const initialState: AttackState = {
    attacks: [],
    status: 'idle',
    error: null,
    
}

export const fetchAttacksByLocation = createAsyncThunk('attacks/fetchAttacks', async (destination: string) : Promise<Attack[] | undefined> => {
    
    const response = await axios.get(`${BASE_URL}${destination}`);    
    return response.data;
});

export const addAttack = createAsyncThunk('attacks/addAttack', async (attack:Partial<Attack>) => {
    
    const response = await axios.post(`${BASE_URL}add`, attack);
    return response.data;  
})



export const attackSlice = createSlice({
    name: 'attacks',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
        // .addCase(fetchUsers.pending, (state) => {
        //     state.status = 'loading';
        // })
        // .addCase(fetchUsers.fulfilled, (state, action) => {
        //     if(action.payload) 
        //     state.users = action.payload;
        //     state.status = 'succeeded';
            
        // })
        // .addCase(fetchUsers.rejected, (state, action) => {
        //     state.status = 'failed';
        //     state.error = action.error.message ?? 'Unknown error';
        // })
        .addCase(addAttack.pending, (state) => {
            state.status = 'loading';
            
        })
        .addCase(addAttack.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.attacks.push(action.payload);
            console.log(action.payload);
            
        })
        .addCase(addAttack.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message ?? 'Unknown error';
            
        })
        
    },
} 

)
export default attackSlice.reducer