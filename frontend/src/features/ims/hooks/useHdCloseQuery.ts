import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";

import { getHdCloseData } from "../services/ims.services";
import ICloseHDFilterForm from "../types/ICloseHDFilterForm";

const useHdCloseQuery = (filterData: ICloseHDFilterForm) => {
  return useQuery({
    queryKey: ["hdCloseQuery", JSON.stringify(filterData)],
    queryFn: async () => {
      const data = await getHdCloseData(filterData)
        .then((res) => res.data)
        .catch(() => {
          throw new Error("Error Fetching Data");
        });
      return removeJSONNull(data);
    },
    cacheTime: 1000 * 60 * 1,
    staleTime: 1000 * 60 * 1,
  });
};

export default useHdCloseQuery;
