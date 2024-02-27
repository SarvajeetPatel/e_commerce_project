import { configureStore } from "@reduxjs/toolkit";
import PageReducer from '../components/ProductSlice'

const Store = configureStore({
    reducer: {
        pagination: PageReducer,
    },
})

export default Store;