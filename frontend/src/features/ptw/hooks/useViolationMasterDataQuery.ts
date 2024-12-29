import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";

import { getViolationMasterData } from "../services/ptw.services";

const useViolationMasterDataQuery = () => {
  return useQuery({
    queryKey: ["violationMasterDataQuery"],
    queryFn: async () => {
      const data = await getViolationMasterData()
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

export default useViolationMasterDataQuery;
