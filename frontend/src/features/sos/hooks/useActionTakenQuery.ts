import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";
import { getActionTakenData } from "../services/sos.services";

const useActionTakenQuery = (
  ticketNo: number,
  locnId: number,
  orgId: number,
  unitId: number,
) => {
  return useQuery({
    queryKey: ["sosActionTakenDataQuery", { ticketNo, locnId, orgId, unitId }],
    queryFn: async () => {
      const data = await getActionTakenData(ticketNo, locnId, orgId, unitId)
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

export default useActionTakenQuery;
