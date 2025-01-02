import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";
import { getHDMasterData } from "../services/ims.services";

const useHSMasterDataQuery = () => {
  return useQuery({
    queryKey: ["hdMasterdataQuery"],
    queryFn: async () => {
      const data = await getHDMasterData()
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

export default useHSMasterDataQuery;
