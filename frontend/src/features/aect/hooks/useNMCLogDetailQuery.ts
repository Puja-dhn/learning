import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";

import { getNMCData } from "../services/nmc.services";
import { ILogNMCFilterForm } from "../types";

const useNMCLogDetailQuery = (filterData: ILogNMCFilterForm) => {
  return useQuery({
    queryKey: ["nmcDataQuery", JSON.stringify(filterData)],
    queryFn: async () => {
      const data = await getNMCData(filterData)
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

export default useNMCLogDetailQuery;
