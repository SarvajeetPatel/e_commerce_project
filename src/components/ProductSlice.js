import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentPage: 1,
    itemsPerPage: 10,
    tokens: " ",
}

const ProductSlice = createSlice({
    name: 'pagination',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = Number(action.payload);
        },
        setItemsPerPage: (state, action) => {
            state.itemsPerPage = action.payload;
        },
        setTokens: (state , action) => {
            state.tokens = action.payload;
            console.log(action.payload , "action payload")
        },
    }
})

export const { setCurrentPage, setItemsPerPage, setTokens } = ProductSlice.actions;
export default ProductSlice.reducer;