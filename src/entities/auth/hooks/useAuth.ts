import { useDispatch, useSelector } from "@/app/providers/store"
import { useMemo } from "react"
import { authSliceSelectors, loginThunk, LoginThunkDraft, logoutReducer } from "@/entities/auth/model/slice"

const useAuth = () => {
  const dispatch = useDispatch()
  const user = useSelector(authSliceSelectors.user)
  const stage = useSelector(authSliceSelectors.stage)
  const error = useSelector(authSliceSelectors.error)

  const thunks = useMemo(() => ({
    login: (draft: LoginThunkDraft) => {
      return dispatch(loginThunk(draft))
    },
    logout: () => {
      return dispatch(logoutReducer())
    }
  }), [dispatch])

  return (
    { user, stage, thunks, error }
  )
}

export default useAuth