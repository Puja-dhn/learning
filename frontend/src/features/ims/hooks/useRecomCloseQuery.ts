import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";

import ILogImsFilterForm from "../types/ILogImsFilterForm";
import { getIMSCloseData, getIMSData, getIMSTeamFormationData, getRecommendationData } from "../services/ims.services";
import ILogRecomFilterForm from "../types/ILogRecomFilterForm";

const useRecomCloseQuery = (filterData: ILogRecomFilterForm) => {
  return useQuery({
    queryKey: ["recomCloseQuery", JSON.stringify(filterData)],
    queryFn: async () => {
      const data = await getRecommendationData(filterData)
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

export default useRecomCloseQuery;
