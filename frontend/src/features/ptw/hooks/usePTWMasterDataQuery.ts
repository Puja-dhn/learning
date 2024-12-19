import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";
import { getPtwMasterData } from "../services/ptw.services";

const usePTWMasterDataQuery = () => {
  return useQuery({
    queryKey: ["usePTWMasterData"],
    queryFn: async () => {
      const data = await getPtwMasterData()
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

export default usePTWMasterDataQuery;
