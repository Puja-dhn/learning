import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";

import { getOpenSIOData } from "../services/sis.services";
import { ILogSioFilterForm } from "../types";

const useSisOpenLogQuery = (filterData: ILogSioFilterForm) => {
  return useQuery({
    queryKey: ["sioDataQuery", JSON.stringify(filterData)],
    queryFn: async () => {
      const data = await getOpenSIOData(filterData)
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

export default useSisOpenLogQuery;
