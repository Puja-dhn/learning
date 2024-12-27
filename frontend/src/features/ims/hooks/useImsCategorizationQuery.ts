import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";

import ILogImsFilterForm from "../types/ILogImsFilterForm";
import { getIMSCategorizationData } from "../services/ims.services";

const useImsCategorizationQuery = (filterData: ILogImsFilterForm) => {
  return useQuery({
    queryKey: ["imsCatwegorizationDataQuery", JSON.stringify(filterData)],
    queryFn: async () => {
      const data = await getIMSCategorizationData(filterData)
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

export default useImsCategorizationQuery;
