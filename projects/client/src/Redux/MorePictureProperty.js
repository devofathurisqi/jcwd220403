import { createSlice } from "@reduxjs/toolkit"

const morePictureProperty = createSlice({
    name: "morePictureProperty",
    initialState: {
        isDrawerOpen: false,
        imageUrl : null,
        picture : null,
        idProperty : null
    },
    reducers: {
        openDrawerForMorePicture: (state, action) => {
            state.isDrawerOpen = true
            state.idProperty = action.payload
        },
        closeDrawerForMorePicture: (state) => {
            state.isDrawerOpen = false
            state.picture = null;
            state.imageUrl = null;
            state.idProperty = null
        },
        setPicture: (state, action) => {
            state.picture = action.payload.picture;
            state.imageUrl = action.payload.imageUrl;
        },
        resetPicture: (state) => {
            state.picture = null;
            state.imageUrl = null;
        },
    }
})

export const {openDrawerForMorePicture, closeDrawerForMorePicture, setPicture, resetPicture} = morePictureProperty.actions
export default morePictureProperty.reducer