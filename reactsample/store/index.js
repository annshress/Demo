import { createStore, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";

import storage from "redux-persist/lib/storage";
import autoMergeLevel1 from "redux-persist/lib/stateReconciler/autoMergeLevel1";

import rootReducer from "./reducer";

const persistReducerConfig = {
  key: "store",
  storage,
  stateReconciler: autoMergeLevel1,
  whitelist: ["account", "publicAppointmentBooking"]
};

const persistedReducer = persistReducer(persistReducerConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(persistedReducer, composeEnhancers());
export const persistor = persistStore(store);

export default store;
