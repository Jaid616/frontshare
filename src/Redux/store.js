import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice.js'
import partySlice from './partySlice.js';
import itemSlice from './itemSlice.js';
import billSlice from './billSlice.js';
import bankSlice from './bankSlice.js';
import journalEntrySlice from './journalEntry.js'
import paymentSlice from './paymentSlice.js'
import expensesSlice from './expenses.js'
import settingsSlice from './settingsSlice.js'

const store = configureStore({
    reducer: {
        'auth': userSlice,
        'party': partySlice,
        'item': itemSlice,
        'bill': billSlice,
        'bank': bankSlice,
        "journalentry": journalEntrySlice,
        "payment": paymentSlice,
        "expense": expensesSlice,
        "settings": settingsSlice
    }
})

export default store;