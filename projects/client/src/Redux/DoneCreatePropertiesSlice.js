import { createSlice } from "@reduxjs/toolkit"

const doneCreateData = createSlice({
    name:"doneCreateData",
    initialState: {
        isDone : false,
        isDeleteProperty: false
    },
    reducers: {
        isDoneCreate: (state) => {
            state.isDone = true
        },
        isDeleteData: (state) => {
            state.isDone = false
        },
        isDeletePropertyData: (state) => {
            state.isDeleteProperty = true
        }
    }
})

export const {isDoneCreate, isDeleteData, isDeletePropertyData} = doneCreateData.actions
export default doneCreateData.reducer