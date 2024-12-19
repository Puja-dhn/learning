import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";
import { getUserDetails } from "../services/user.service";
import { IUserFilter } from "../types";

const useUserDetailsQuery = (
  filterTicketNo: number,
  filterLocation: number,
  filterList: IUserFilter,
) => {
  return useQuery({
    queryKey: [
      "userDetailsQuery",
      filterTicketNo,
      filterLocation,
      JSON.stringify(filterList),
    ],
    queryFn: async () => {
      const data = await getUserDetails(
        filterTicketNo,
        filterLocation,
        filterList,
      )
        .then((res) => res.data)
        .catch(() => {
          throw new Error("Error Fetching Data");
        });
      return removeJSONNull(data);
    },
  });
};

export default useUserDetailsQuery;
