import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";

import { getAECTData } from "../services/aect.services";
import { ILogAectFilterForm } from "../types";

const useAectLogDetailQuery = (filterData: ILogAectFilterForm) => {
  return useQuery({
    queryKey: ["aectDataQuery", JSON.stringify(filterData)],
    queryFn: async () => {
      const data = await getAECTData(filterData)
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

export default useAectLogDetailQuery;
