import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import editorReducer from '@/redux/features/editorSlice';

const persistConfig = {
  key: 'editor',
  version: 1,
  storage,
  whitelist: ['elements'],
};

const persistedReducer = persistReducer(persistConfig, editorReducer);

export const makeStore = () => {
  return configureStore({
    reducer: {
      editor: persistedReducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          ignoredPaths: [],
        },
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export const makePersistStore = (store: AppStore) => {
  return persistStore(store);
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type Persistor = ReturnType<typeof makePersistStore>;
