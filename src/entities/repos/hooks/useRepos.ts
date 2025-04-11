import { useDispatch, useSelector } from "@/app/providers/store"
import { useMemo } from "react"
import { reposSliceSelectors } from "@/entities/repos/model/slice"
import { CreateRepoDraft, createRepoThunk, DeleteRepoDraft, deleteRepoThunk, EditRepoDraft, editRepoThunk, getReposThunk } from "../model/thunks"

const useRepos = () => {
  const dispatch = useDispatch()
  const repos = useSelector(reposSliceSelectors.repos)
  const stage = useSelector(reposSliceSelectors.stage)
  const error = useSelector(reposSliceSelectors.error)

  const thunks = useMemo(() => ({
    getRepos: () => {
      return dispatch(getReposThunk())
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
    { stage, error, repos, thunks }
  )
}

export default useRepos