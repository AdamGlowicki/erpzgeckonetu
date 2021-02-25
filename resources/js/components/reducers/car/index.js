import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {getData} from "../../common/apiMethods/apiMethods";

const initialState = {
    cars: [],
    userPhotos: [],
    navifleetCars: [],
}

export const fetchCars = createAsyncThunk(
    'cars/fetchCars',
    async (cookies) => {
        try {
            const result = await getData('/automobile', cookies)
            return result.data
        } catch (e) {
            console.log(e)
        }
    }
)

export const fetchFleetCars = createAsyncThunk(
    'car/fetchFleetCars',
    async (cookies) => {
        try {
            const result = await getData('navifleet/cars', cookies)
            return result.data.data
        } catch (e) {
            console.log(e)
        }
    })

const cars = createSlice({
    name: 'cars',
    initialState,
    extraReducers: {
        [fetchCars.fulfilled]: (state, {payload}) => {
            state.cars = [...payload]
        },
        [fetchFleetCars.fulfilled]: (state, {payload}) => {
            state.navifleetCars = [...payload]
        },
    }
})

export default cars.reducer
