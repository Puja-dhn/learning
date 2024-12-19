import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";
import { getPermitData } from "../services/ptw.services";
import { IViewPTWFilter } from "../types";

const useDBDateQuery = (filterData: IViewPTWFilter) => {
  return useQuery({
    queryKey: ["useViewPTWDetails", JSON.stringify(filterData)],
    queryFn: async () => {
      const data = await getPermitData(filterData)
        .then((res) => res.data)
        .catch(() => {
          throw new Error("Error Fetching Data");
        });
      return removeJSONNull(data);
    },
    cacheTime: 0,
    staleTime: 0,
  });
};

export default useDBDateQuery;
