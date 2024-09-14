import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import createSagaMiddleware, { Saga } from "redux-saga";

export const appReducer = combineSlices();

export const sagaMiddleware = createSagaMiddleware();

export const appStore = configureStore({
  reducer: appReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

const sagas = new Map();
export const runUniqueSaga = (key: string, saga: Saga) => {
  if (sagas.has(key)) {
    return;
  }
  sagaMiddleware.run(saga);
  sagas.set(key, saga);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppState = any;
export type AppDispatch = typeof appStore.dispatch;

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispath = useDispatch.withTypes<AppDispatch>();
export const useAppStore = useStore.withTypes<typeof appStore>();
