import { useAppDispatch } from "@/store/hooks";
import { showAlertToast, hideAlertToast } from "../alertToastSlice";

function useAlertConfig() {
  const dispatch = useAppDispatch();

  return {
    show: (
      severity: "success" | "warning" | "info" | "error",
      message: string,
      autoClose: boolean,
      autoCloseTime?: number,
    ) => {
      dispatch(showAlertToast({ severity, message, autoClose, autoCloseTime }));
    },
    hide: () => {
      dispatch(hideAlertToast());
    },
  };
}

export default useAlertConfig;
