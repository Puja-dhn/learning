import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";
import { getUserDBList } from "@/features/users/services/user.service";

const useUserDBQuery = () => {
  return useQuery({
    queryKey: ["userDBQuery"],
    queryFn: async () => {
      const data = await getUserDBList()
        .then((res) => res.data)
        .catch(() => {
          throw new Error("Error Fetching Data");
        });
      return removeJSONNull(data);
    },
  });
};

export default useUserDBQuery;
