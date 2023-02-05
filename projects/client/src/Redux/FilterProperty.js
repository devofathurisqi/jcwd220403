import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    value: {
        statusAll: true,
        bestSeller : false,
        notSold : false,
        Sort : "DESC"
    }
}

const FilterProperty = createSlice({
    name: "property",
    initialState,
    reducers: {
        activeStatus: (state) => {
            state.value.statusAll = true
            state.value.bestSeller = false
            state.value.notSold = false
        },
        activeBestSeller: (state) => {
            state.value.bestSeller = true
            state.value.statusAll = false
            state.value.notSold = false
        },
        activeNotSold : (state) => {
            state.value.notSold = true
            state.value.statusAll = false
            state.value.bestSeller = false
        },
        Sort : (state, action) => {
            state.value.Sort = action.payload
        }
    }
})

export const { activeStatus, activeBestSeller, activeNotSold, Sort } = FilterProperty.actions
export default FilterProperty.reducer