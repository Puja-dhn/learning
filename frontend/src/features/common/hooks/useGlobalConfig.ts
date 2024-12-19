import {
  setHirarchy,
  setLoginType,
  setAppMode,
  setLastSelection,
} from "@/features/common/globalSlice";
import { useAppDispatch } from "@/store/hooks";
import { IGlobalConfig, ILastSelection } from "../types";

function useGlobalService() {
  const dispatch = useAppDispatch();

  return {
    setLoginType: (newLoginType: string) => {
      dispatch(setLoginType(newLoginType));
    },
    setAppMode: (newAppMode: string) => {
      dispatch(setAppMode(newAppMode));
    },
    setHirarchy: (newHirarchy: IGlobalConfig) => {
      dispatch(setHirarchy(newHirarchy));
    },

    setLastSelection: (newSelection: ILastSelection) => {
      dispatch(setLastSelection(newSelection));
    },
  };
}

export default useGlobalService;
