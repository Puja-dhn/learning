import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import { ILogPermitData, IViewPTWFilter, IPTWMasterData } from "../types";

const getPermitData = (filterData: IViewPTWFilter) => {
  return http.post<
    IViewPTWFilter,
    AxiosResponse<{ historyLogPermitData: ILogPermitData[] }>
  >("/ptw/get-permit-data", filterData);
};

const getPtwMasterData = () => {
  return http.get<
    any,
    AxiosResponse<{ historyPTWMasterData: IPTWMasterData[] }>
  >("/ptw/get-ptw-master-data");
};

export { getPermitData, getPtwMasterData };
