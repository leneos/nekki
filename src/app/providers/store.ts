import { configureStore } from '@reduxjs/toolkit'
import authSliceReducer from '@/entities/auth/model/slice'
import {
  TypedUseSelectorHook,
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from 'react-redux'
import reposSliceReducer from '@/entities/repos/model/slice'

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    repos: reposSliceReducer
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

const useSelector: TypedUseSelectorHook<RootState> = useAppSelector

const useDispatch = () => useAppDispatch<AppDispatch>()

export { useSelector, useDispatch }
