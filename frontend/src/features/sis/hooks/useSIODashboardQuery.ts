import { useQuery } from "react-query";
import { removeJSONNull } from "@/features/common/utils/json-util";
import { getSIODashboardData } from "../services/sis.services";

const useCPADashboardQuery = (
  department: number,
  fromDate: string,
  toDate: string,
) => {
  return useQuery({
    queryKey: [
      "cpaDashboardQuery",
      JSON.stringify({
        department,
        fromDate,
        toDate,
      }),
    ],
    queryFn: async () => {
      const data = await getSIODashboardData(department, fromDate, toDate)
        .then((res:any) => res.data)
        .catch(() => {
          throw new Error("Error Fetching Data");
        });
      return removeJSONNull(data);
    },
    cacheTime: 1000 * 60 * 1,
    staleTime: 1000 * 60 * 1,
  });
};

export default useCPADashboardQuery;
