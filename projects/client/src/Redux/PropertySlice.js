import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    value: {
        name: "",
        index: null,
        active: false,
        offMarket: false,
        statusAll: true,
        statusAllLength: null,
        statusActiveLength: null,
        statusOffMarketLength: null
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
        },
        activeMarket: (state) => {
            state.value.active = true
            state.value.offMarket = false
            state.value.statusAll = false
        },
        offMarket: (state) => {
            state.value.offMarket = true
            state.value.active = false
            state.value.statusAll = false
        },
        statusAll: (state) => {
            state.value.statusAll = true
            state.value.active = false
            state.value.offMarket = false
        },
        getStatusAllLength: (state, action) => {
            state.value.statusAllLength = action.payload
        },
        getStatusActiveLength: (state, action) => {
            state.value.statusActiveLength = action.payload
        },
        getStatusOffMarketLength: (state, action) => {
            state.value.statusOffMarketLength = action.payload
        }
    }
})

export const {
    getName, getIndex, activeMarket,
    offMarket, statusAll, getStatusAllLength,
    getStatusActiveLength, getStatusOffMarketLength
} = propertySlice.actions
export default propertySlice.reducer