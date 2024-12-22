import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";

import IPTWMasterData from "../types/ptw/IPTWMasterData";
import ILogPTWForm from "../types/ptw/ILogPTWForm";
import ILogPtwData from "../types/ptw/ILogPtwData";
import ILogPtwFilterForm from "../types/ptw/ILogPtwFilterForm";




const getPTWMasterData = () => {
  return http.post<
    any,
    AxiosResponse<{ historyPTWMasterData: IPTWMasterData }>
  >("/ptw/get-ptw-master-data");
};
const addNewPTWData = (formData: any) => {
  return http.post<ILogPTWForm, AxiosResponse<string>>(
    "/ptw/add-new-ptw",
    formData,
  );
};
const getPTWData = (filterData: ILogPtwFilterForm) => {
  return http.post<
    ILogPtwFilterForm,
    AxiosResponse<{ historyLogPtwData: ILogPtwData[] }>
  >("/ptw/get-ptw-data", filterData);
};
const getOpenPTWData = (filterData: ILogPtwFilterForm) => {
  return http.post<
    ILogPtwFilterForm,
    AxiosResponse<{ historyLogPtwData: ILogPtwData[] }>
  >("/ptw/get-openptw-data", filterData);
};




export {
  getPTWMasterData,
  addNewPTWData,
  getPTWData,
  getOpenPTWData
};
