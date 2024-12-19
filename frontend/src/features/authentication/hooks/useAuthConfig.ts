import { useAppDispatch } from "@/store/hooks";
import { setLoggedUser, setAuthToken, resetAuth } from "../authSlice";
import { IAuthenticatedUser } from "../types";

function useAuthConfig() {
  const dispatch = useAppDispatch();

  return {
    setLoggedUser: (newUser: IAuthenticatedUser) => {
      dispatch(setLoggedUser(newUser));
    },
    setAuthToken: (newAuthToken: string) => {
      dispatch(setAuthToken(newAuthToken));
    },
    resetAuth: () => {
      dispatch(resetAuth());
    },
  };
}

export default useAuthConfig;
