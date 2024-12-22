import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";

import { getPTWData } from "../services/ptw.services";
import ILogPtwFilterForm from "../types/ptw/ILogPtwFilterForm";

const usePtwLogDetailQuery = (filterData: ILogPtwFilterForm) => {
  return useQuery({
    queryKey: ["sioDataQuery", JSON.stringify(filterData)],
    queryFn: async () => {
      const data = await getPTWData(filterData)
        .then((res:any) => res.data)
        .catch(() => {
          throw new Error("Error Fetching Data");
        });
      return removeJSONNull(data);
    },
    cacheTime: 1000 * 60 * 1,
    staleTime: 1000 * 60 * 1,
  });
};

export default usePtwLogDetailQuery;
