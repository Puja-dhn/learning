import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";
import { getInactiveUserList } from "../services/common.service";

const useInactiveUserList = () => {
  return useQuery({
    queryKey: ["inactiveUserList"],
    queryFn: async () => {
      const data = await getInactiveUserList()
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

export default useInactiveUserList;
