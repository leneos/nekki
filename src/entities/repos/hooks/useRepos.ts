import { useDispatch, useSelector } from "@/app/providers/store"
import { useMemo } from "react"
import { reposSliceSelectors } from "@/entities/repos/model/slice"
import { CreateRepoDraft, createRepoThunk, DeleteRepoDraft, deleteRepoThunk, EditRepoDraft, editRepoThunk, getReposThunk, GetReposThunkDraft } from "../model/thunks"

const useRepos = () => {
  const dispatch = useDispatch()
  const repos = useSelector(reposSliceSelectors.repos)
  const stage = useSelector(reposSliceSelectors.stage)
  const error = useSelector(reposSliceSelectors.error)
  const totalCount = useSelector(reposSliceSelectors.totalCount)

  const thunks = useMemo(() => ({
    getRepos: (draft: GetReposThunkDraft) => {
      return dispatch(getReposThunk(draft))
    },
    createRepo: (draft: CreateRepoDraft) => {
      return dispatch(createRepoThunk(draft))
    },
    editRepo: (draft: EditRepoDraft) => {
      return dispatch(editRepoThunk(draft))
    },
    deleteRepo: (draft: DeleteRepoDraft) => {
      return dispatch(deleteRepoThunk(draft))
    },
  }), [dispatch])

  return (
    { stage, error, repos, thunks, totalCount }
  )
}

export default useRepos