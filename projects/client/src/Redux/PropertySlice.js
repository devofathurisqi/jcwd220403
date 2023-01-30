import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    value: {
        name: "",
        index : null
    }
}

const propertySlice = createSlice({
    name: "property",
    initialState,
    reducers: {
        getName: (state, action) => {
            state.value.name = action.payload
        },
        getIndex: (state, action) => {
            state.value.index = action.payload
        }
    }
})

export const { getName, getIndex } = propertySlice.actions
export default propertySlice.reducer