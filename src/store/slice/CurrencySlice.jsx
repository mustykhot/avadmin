import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exchangeRates: null,
};

const currencySlice = createSlice({
  name: "rates",
  initialState,
  reducers: {
    setExchangeRate: (state, { payload: { data } }) => {
      state.exchangeRates = data;
    },
  },
});
const { actions, reducer } = currencySlice;
export const { setExchangeRate } = actions;

export const selectRates = (state) => state.rates.exchangeRates;
export default reducer;
