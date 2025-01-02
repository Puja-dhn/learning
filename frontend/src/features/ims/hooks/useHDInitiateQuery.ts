import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";

import { getPendingHDInitiateData } from "../services/ims.services";
import ILogRecomFilterForm from "../types/ILogRecomFilterForm";

const useHDinitiateQuery = (filterData: ILogRecomFilterForm) => {
  return useQuery({
    queryKey: ["hdInitiateQuery", JSON.stringify(filterData)],
    queryFn: async () => {
      const data = await getPendingHDInitiateData(filterData)
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

export default useHDinitiateQuery;
