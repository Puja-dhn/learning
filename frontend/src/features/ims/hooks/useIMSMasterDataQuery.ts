import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";
import { getIMSMasterData } from "../services/ims.services";

const useIMSMasterDataQuery = () => {
  return useQuery({
    queryKey: ["imsMasterdataQuery"],
    queryFn: async () => {
      const data = await getIMSMasterData()
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

export default useIMSMasterDataQuery;
