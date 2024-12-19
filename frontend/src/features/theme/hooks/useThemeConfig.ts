import { useAppDispatch } from "@/store/hooks";
import { setSiteTheme } from "../siteThemeSlice";
import { ISiteTheme } from "../types";

function useThemeConfig() {
  const dispatch = useAppDispatch();

  return {
    toggleDarkTheme: (newSiteTheme: ISiteTheme) => {
      dispatch(setSiteTheme(newSiteTheme));
    },
  };
}

export default useThemeConfig;
