import { RootState } from '@/app/providers/store'
import { getOctokit } from '@/shared/octokit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { SLICE_NAME } from './constants'

export const getReposThunk = createAsyncThunk(
  `${SLICE_NAME}/getReposThunk`,
  async (_, {
    rejectWithValue,
    getState
  }) => {
    const state = getState() as RootState
    const token = state.auth.token
    const username = state.auth.user?.login

    if (!token) {
      return rejectWithValue(new Error('Token not found'))
    }

    if (!username) {
      return rejectWithValue(new Error('Username not found'))
    }

    const octokit = getOctokit(token)

    try {
      const repos = await octokit.rest.repos.listForUser({
        username,
      })
      return repos.data
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export type CreateRepoDraft = {
  name: string
  description: string
  visibility: 'public' | 'private'
}

export const createRepoThunk = createAsyncThunk(
  `${SLICE_NAME}/createRepoThunk`,
  async (draft: CreateRepoDraft, {
    rejectWithValue,
    getState
  }) => {
    const state = getState() as RootState
    const token = state.auth.token

    if (!token) {
      return rejectWithValue(new Error('Token not found'))
    }

    const octokit = getOctokit(token)

    try {
      const res = await octokit.rest.repos.createForAuthenticatedUser({
        name: draft.name,
        description: draft.description,
        visibility: draft.visibility,
        private: draft.visibility === 'private'
      })
      return res.data
    } catch (error) {
      return rejectWithValue(error)
    }
  })

export type EditRepoDraft = {
  repo: string
  name: string
  description: string
  visibility: 'public' | 'private'
}


export const editRepoThunk = createAsyncThunk(
  `${SLICE_NAME}/editRepoThunk`,
  async (draft: EditRepoDraft, {
    rejectWithValue,
    getState
  }) => {
    const state = getState() as RootState
    const token = state.auth.token
    const owner = state.auth.user?.login

    if (!token) {
      return rejectWithValue(new Error('Token not found'))
    }

    if (!owner) {
      return rejectWithValue(new Error('Username not found'))
    }

    const octokit = getOctokit(token)

    try {
      const res = await octokit.rest.repos.update({
        owner,
        repo: draft.repo,
        name: draft.name,
        description: draft.description,
        visibility: draft.visibility
      })
      return res.data
    } catch (error) {
      return rejectWithValue(error)
    }
  })

export type DeleteRepoDraft = {
  name: string
}

export const deleteRepoThunk = createAsyncThunk(
  `${SLICE_NAME}/deleteRepoThunk`,
  async ({ name }: DeleteRepoDraft, {
    rejectWithValue,
    getState
  }) => {
    const state = getState() as RootState
    const token = state.auth.token
    const owner = state.auth.user?.login

    if (!token) {
      return rejectWithValue(new Error('Token not found'))
    }

    if (!owner) {
      return rejectWithValue(new Error('Username not found'))
    }

    const octokit = getOctokit(token)

    try {
      await octokit.rest.repos.delete({
        owner,
        repo: name
      })
      return true
    } catch (error) {
      return rejectWithValue(error)
    }
  })