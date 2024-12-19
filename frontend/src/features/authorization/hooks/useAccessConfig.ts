import { useAppDispatch } from "@/store/hooks";
import { resetAppAccess, setApp, setAppAccess } from "../accessSlice";
import IAppAccess from "../types/IAppAccess";

function useAccessConfig() {
  const dispatch = useAppDispatch();

  return {
    setAppAccess: (newAppAccess: IAppAccess) => {
      dispatch(setAppAccess(newAppAccess));
    },
    setApp: (newAppId: number) => {
      dispatch(setApp({ appId: newAppId }));
    },
    resetAppAccess: () => {
      dispatch(resetAppAccess());
    },
  };
}

export default useAccessConfig;
