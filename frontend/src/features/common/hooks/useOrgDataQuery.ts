import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";
import { getOrgData } from "../services/common.service";

const useOrgDataQuery = () => {
  return useQuery({
    queryKey: ["orgDataQuery"],
    queryFn: async () => {
      const data = await getOrgData()
        .then((res) => res.data)
        .catch(() => {
          throw new Error("Error Fetching Data");
        });
      return removeJSONNull(data);
    },
  });
};

export default useOrgDataQuery;
