import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";

import { getAECTDashboardData } from "../services/aect.services";

const useAECTDashboardQuery = (
  area_id: number,
  division_id: number,
  location_id: number,
) => {
  return useQuery({
    queryKey: [
      "aectDashboardQuery",
      JSON.stringify({ area_id, division_id, location_id }),
    ],
    queryFn: async () => {
      const data = await getAECTDashboardData(area_id, division_id, location_id)
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

export default useAECTDashboardQuery;
