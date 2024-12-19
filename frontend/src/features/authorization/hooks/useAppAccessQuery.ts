import { useQuery } from "react-query";
import { getAppAccess } from "../services/access.service";

const useAppAccessQuery = (userId: number) => {
  return useQuery({
    queryKey: ["appAccessQuery", userId],
    queryFn: async () => {
      const data = await getAppAccess()
        .then((res) => res.data)
        .catch(() => {
          throw new Error("Error Fetching Data");
        });
      return data;
    },
  });
};

export default useAppAccessQuery;
