import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";

import { getContextData } from "../services/master.services";
import IContextList from "../types/IContextList";

const useContextDataQuery = (filterData: IContextList) => {
  return useQuery({
    queryKey: ["contexDataQuery", JSON.stringify(filterData)],
    queryFn: async () => {
      const data = await getContextData(filterData)
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

export default useContextDataQuery;
