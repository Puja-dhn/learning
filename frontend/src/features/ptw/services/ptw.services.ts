import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";

import IPTWMasterData from "../types/ptw/IPTWMasterData";
import ILogPTWForm from "../types/ptw/ILogPTWForm";
import ILogPtwData from "../types/ptw/ILogPtwData";
import ILogPtwFilterForm from "../types/ptw/ILogPtwFilterForm";
import ILogPTWApproveForm from "../types/ptw/ILogPTWApproveForm";
import ILogPTWCloseForm from "../types/ptw/ILogPTWCloseForm";
import IViolationMasterData from "../types/ptw/IViolationMasterData";
import ILogViolationForm from "../types/ptw/ILogViolationForm";
import ILogViolationFilterForm from "../types/ptw/ILogViolationFilterForm";
import ILogViolationData from "../types/ptw/ILogViolationData";
import ILogVIOCloseForm from "../types/ptw/ILogVIOCloseForm";

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
const submitCustodianApproval = (pdcData: ILogPTWApproveForm) => {
  return http.post<any, AxiosResponse<string>>("/ptw/submit-ptwapproval-data", {
    pdcData,
  });
};
const closePtw = (pdcData: ILogPTWCloseForm) => {
  return http.post<any, AxiosResponse<string>>("/ptw/close-ptw", {
    pdcData,
  });
};
const getViolationMasterData = () => {
  return http.post<
    any,
    AxiosResponse<{ historyViolationMasterData: IViolationMasterData[] }>
  >("/ptw/get-violation-master-data");
};
const addNewViolationData = (formData: any) => {
  return http.post<ILogViolationForm, AxiosResponse<string>>(
    "/ptw/add-new-violation",
    formData,
  );
};
const getViolationData = (filterData: ILogViolationFilterForm) => {
  return http.post<
    ILogViolationFilterForm,
    AxiosResponse<{ historyViolationData: ILogViolationData[] }>
  >("/ptw/get-violation-data", filterData);
};
const getOpenViolationData = (filterData: ILogViolationFilterForm) => {
  return http.post<
    ILogViolationFilterForm,
    AxiosResponse<{ historyViolationData: ILogViolationData[] }>
  >("/ptw/get-openviolation-data", filterData);
};
const closeViolations = (pdcData: ILogVIOCloseForm) => {
  return http.post<any, AxiosResponse<string>>("/ptw/close-violations", {
    pdcData,
  });
};

export {
  getPTWMasterData,
  addNewPTWData,
  getPTWData,
  getOpenPTWData,
  submitCustodianApproval,
  closePtw,
  getViolationMasterData,
  addNewViolationData,
  getViolationData,
  getOpenViolationData,
  closeViolations,
};
