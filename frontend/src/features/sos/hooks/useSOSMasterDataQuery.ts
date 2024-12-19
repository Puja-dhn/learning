import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";
import { getMasterData } from "../services/sos.services";

const useSOSMasterDataQuery = (
  ticketNo: number,
  locnId: number,
  orgId: number,
  unitId: number,
) => {
  return useQuery({
    queryKey: ["sosMasterDataQuery", { ticketNo, locnId, orgId, unitId }],
    queryFn: async () => {
      const data = await getMasterData(ticketNo, locnId, orgId, unitId)
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

export default useSOSMasterDataQuery;
