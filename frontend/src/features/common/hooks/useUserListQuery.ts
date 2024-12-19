import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";
import { getUserList } from "@/features/users/services/user.service";

const useUserListQuery = (inputText: string, limitType: string = "") => {
  return useQuery({
    queryKey: ["userListQuery"],
    queryFn: async () => {
      const data = await getUserList(inputText, limitType)
        .then((res) => res.data)
        .catch(() => {
          throw new Error("Error Fetching Data");
        });
      return removeJSONNull(data);
    },
  });
};

export default useUserListQuery;
