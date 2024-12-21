import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";

import IPTWMasterData from "../types/ptw/IPTWMasterData";




const getPTWMasterData = () => {
  return http.post<
    any,
    AxiosResponse<{ historyPTWMasterData: IPTWMasterData }>
  >("/ptw/get-ptw-master-data");
};





export {
  getPTWMasterData
};
