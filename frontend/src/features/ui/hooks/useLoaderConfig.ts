import { useAppDispatch } from "@/store/hooks";
import { showLoader, hideLoader } from "../loaderSlice";

function useLoaderConfig() {
  const dispatch = useAppDispatch();

  return {
    show: () => {
      dispatch(showLoader());
    },
    hide: () => {
      dispatch(hideLoader());
    },
  };
}

export default useLoaderConfig;
