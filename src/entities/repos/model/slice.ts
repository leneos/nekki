import { LoadingStages } from '@/shared/types'
import { createSlice } from '@reduxjs/toolkit'
import { RestEndpointMethodTypes } from 'node_modules/@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types'
import { RequestError } from 'octokit'
import { getReposThunk } from './thunks'
import { SLICE_NAME } from './constants'
import { showErrorToast } from '@/shared/toasts/show-error-toast'

export type Repo = RestEndpointMethodTypes["repos"]["listForAuthenticatedUser"]['response']['data'][number]

interface ReposState {
  repos: Repo[] | null
  totalCount: number
  error: string | null
  stage: LoadingStages
}

const initialState: ReposState = {
  repos: [],
  totalCount: 0,
  error: null,
  stage: 'idle',
}

const reposSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  selectors: {
    repos: (state) => state.repos,
    error: (state) => state.error,
    stage: (state) => state.stage,
    totalCount: (state) => state.totalCount,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getReposThunk.pending, (state) => {
      state.stage = 'loading'
      state.repos = []
      state.error = null
    })
      .addCase(getReposThunk.fulfilled, (state, action) => {
        state.stage = 'success'
        state.repos = action.payload.repos
        state.totalCount = action.payload.totalCount
        state.error = null
      })
      .addCase(getReposThunk.rejected, (state, action) => {
        const error = action?.payload as RequestError
        const errorMessage = error.message || "Something went wrong"
        state.stage = 'error'
        state.error = errorMessage
        state.repos = []
        showErrorToast(errorMessage)
      })
  },
})

export const reposSliceSelectors = reposSlice.selectors

const reposSliceReducer = reposSlice.reducer

export default reposSliceReducer