import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";

import ILogImsFilterForm from "../types/ILogImsFilterForm";
import { getIMSData, getIMSTeamFormationData } from "../services/ims.services";

const useImsTeamFormationQuery = (filterData: ILogImsFilterForm) => {
  return useQuery({
    queryKey: ["imsTeamFormationDataQuery", JSON.stringify(filterData)],
    queryFn: async () => {
      const data = await getIMSTeamFormationData(filterData)
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

export default useImsTeamFormationQuery;
