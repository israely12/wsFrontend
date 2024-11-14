import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { Attack } from '../../types/Attack';
import axios from 'axios'

const BASE_URL = "http://localhost:5000/api/attacks/";


interface AttackState {
    attacks: Attack[]
    attacksToDefend: Attack[] 
    status: 'idle' | 'loading' | 'succeeded'| 'failed'
    error: string | null
    
    }  

const initialState: AttackState = {
    attacks: [],
    attacksToDefend: [],
    status: 'idle',
    error: null,
    
}

export const fetchAttacksByDestination = createAsyncThunk('attacksToDefend/fetchAttacks', async (destination: string) : Promise<Attack[] | undefined> => {
    
    const response = await axios.get(`${BASE_URL}destination/${destination}`);    
    
    return response.data;
});

export const fetchAttacksByLocation = createAsyncThunk('attacks/fetchSentAttacks', async (location: string) : Promise<Attack[] | undefined> => {
    
    const response = await axios.get(`${BASE_URL}location/${location}`);
        
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
        .addCase(fetchAttacksByDestination.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchAttacksByDestination.fulfilled, (state, action) => {
            if(action.payload) 
            state.status = 'succeeded';
            state.attacksToDefend = [];action.payload;
            
            
        })
        .addCase(fetchAttacksByDestination.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message ?? 'Unknown error';
        })
        .addCase(fetchAttacksByLocation.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchAttacksByLocation.fulfilled, (state, action) => {
            if(action.payload) 
            state.attacks = action.payload;  
            state.status = 'succeeded';
            
        })
        .addCase(fetchAttacksByLocation.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message ?? 'Unknown error';
        })
        .addCase(addAttack.pending, (state) => {
            state.status = 'loading';
            
        })
        .addCase(addAttack.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.attacks = action.payload;
            console.log(state.attacks);
          
            
            
        })
        .addCase(addAttack.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message ?? 'Unknown error';
            
        })
        
    },
} 

)
export default attackSlice.reducer