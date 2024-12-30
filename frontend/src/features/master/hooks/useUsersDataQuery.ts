import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";
import { getUsersData } from "../services/users.services";
import IUsersList from "../types/IUsersList";

const useUsersDataQuery = (filterData: IUsersList) => {
  return useQuery({
    queryKey: ["usersDataQuery", JSON.stringify(filterData)],
    queryFn: async () => {
      const data = await getUsersData(filterData)
        .then((res) => res.data)
        .catch(() => {
          throw new Error("Error Fetching Data");
        });
      return removeJSONNull(data);
    },
    cacheTime: 1000 * 60 * 1,  // Cache data for 1 minute
    staleTime: 1000 * 60 * 1,  // Data considered fresh for 1 minute
  });
};

export default useUsersDataQuery;
