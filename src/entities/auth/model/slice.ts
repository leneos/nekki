import { getOctokit } from '@/shared/octokit'
import { showErrorToast } from '@/shared/toasts/show-error-toast'
import { LoadingStages } from '@/shared/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RestEndpointMethodTypes } from 'node_modules/@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types'
import { RequestError } from 'octokit'

const SLICE_NAME = 'auth'

export type User = RestEndpointMethodTypes["users"]["getByUsername"]["response"]['data'] | null

export interface LoginThunkDraft {
  username: string
  token: string
}

export const loginThunk = createAsyncThunk(
  `${SLICE_NAME}/login`,
  async ({
    username,
    token,
  }: LoginThunkDraft, {
    rejectWithValue
  }) => {
    const octokit = getOctokit(token)
    try {
      const res = await octokit.rest.users.getAuthenticated()
      if (res.data.login === username) {
        return ({ user: res.data, token })
      }
      return rejectWithValue({ message: 'Invalid username or token' })
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

interface AuthState {
  user: User
  token: string
  stage: LoadingStages
  error: string | null
}

const initialState: AuthState = {
  user: null,
  stage: 'idle',
  error: null,
  token: ''
}

const authSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  selectors: {
    user: (state) => state.user,
    stage: (state) => state.stage,
    error: (state) => state.error,
  },
  reducers: {
    logout: (state) => {
      state.stage = 'idle'
      state.user = null
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.pending, (state) => {
      state.stage = 'loading'
      state.user = null
      state.token = ''
    })
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.stage = 'success'
      state.user = action.payload.user
      state.token = action.payload.token
    })
    builder.addCase(loginThunk.rejected, (state, action) => {
      const error = action?.payload as RequestError
      const errorMessage = error.message || "Something went wrong"
      state.stage = 'error'
      state.error = errorMessage
      state.user = null
      state.token = ''
      showErrorToast(errorMessage)
    })
  },
})

export const authSliceSelectors = authSlice.selectors

export const { logout: logoutReducer } = authSlice.actions

const authSliceReducer = authSlice.reducer

export default authSliceReducer