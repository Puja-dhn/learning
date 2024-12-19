import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";
import { getDBDate } from "../services/common.service";

const useDBDateQuery = () => {
  return useQuery({
    queryKey: ["useDBDateQuery"],
    queryFn: async () => {
      const data = await getDBDate()
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
