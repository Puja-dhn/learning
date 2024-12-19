import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";

import { getAECTPendingClosureData } from "../services/aect.services";

const useAectLogPendingQuery = (
  team_id: number,
  area_id: number,
  division_id: number,
  location_id: number,
) => {
  return useQuery({
    queryKey: ["aectDataPendingQuery"],
    queryFn: async () => {
      const data = await getAECTPendingClosureData(
        team_id,
        area_id,
        division_id,
        location_id,
      )
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

export default useAectLogPendingQuery;
