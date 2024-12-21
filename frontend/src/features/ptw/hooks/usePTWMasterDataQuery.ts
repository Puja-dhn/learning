import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";

import { getPTWMasterData } from "../services/ptw.services";

const usePTWMasterDataQuery = () => {
  return useQuery({
    queryKey: ["sioMasterdataQuery"],
    queryFn: async () => {
      const data = await getPTWMasterData()
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

export default usePTWMasterDataQuery;
