import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";
import { getOrgStructureData } from "../services/orgstructure.services";
import IOrgStructureList from "../types/IOrgStructureList";

const useOrgStructureDataQuery = (filterData: IOrgStructureList) => {
  return useQuery({
    queryKey: ["orgstructureDataQuery", JSON.stringify(filterData)],
    queryFn: async () => {
      const data = await getOrgStructureData(filterData)
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

export default useOrgStructureDataQuery;
