import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";

import ILogViolationFilterForm from "../types/ptw/ILogViolationFilterForm";
import { getOpenViolationData, getViolationData } from "../services/ptw.services";

const useVioClosedLogDetailQuery = (filterData: ILogViolationFilterForm) => {
  return useQuery({
    queryKey: ["violationOpenDataQuery", JSON.stringify(filterData)],
    queryFn: async () => {
      const data = await getOpenViolationData(filterData)
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

export default useVioClosedLogDetailQuery;
