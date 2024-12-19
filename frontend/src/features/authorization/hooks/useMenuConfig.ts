import { useAppDispatch } from "@/store/hooks";
import { resetSelMenu, setSelMenu } from "../menuSlice";
import { IMenuItem } from "../types";

function useMenuConfig() {
  const dispatch = useAppDispatch();

  return {
    setSelMenu: (newMenu: IMenuItem) => {
      dispatch(setSelMenu(newMenu));
    },

    resetSelMenu: () => {
      dispatch(resetSelMenu());
    },
  };
}

export default useMenuConfig;
