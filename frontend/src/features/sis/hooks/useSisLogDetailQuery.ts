import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";

import { getSIOData } from "../services/sis.services";
import { ILogSioFilterForm } from "../types";

const useSisLogDetailQuery = (filterData: ILogSioFilterForm) => {
  return useQuery({
    queryKey: ["sioDataQuery", JSON.stringify(filterData)],
    queryFn: async () => {
      const data = await getSIOData(filterData)
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

export default useSisLogDetailQuery;
