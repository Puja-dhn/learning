import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import {
  IAectClosureForm,
  ILogSioFilterForm,
  ILogSisForm,
  IAECTDashboardData,
} from "../types";
import ISIOMasterData from "../types/sis/ISIOMasterData";
import ILogSioData from "../types/sis/ILogSioData";
import ISIOPDCAssignData from "../types/sis/ISIOPDCAssignData";

const addNewSIOData = (formData: any) => {
  return http.post<ILogSisForm, AxiosResponse<string>>(
    "/sio/add-new-sio",
    formData,
  );
};

const getSIOMasterData = () => {
  return http.post<
    any,
    AxiosResponse<{ historySIOMasterData: ISIOMasterData }>
  >("/sio/get-sio-master-data");
};

const updateAectStatus = (aectData: IAectClosureForm) => {
  return http.post<IAectClosureForm, AxiosResponse<string>>(
    "/aect/udpate-aect-status",
    aectData,
  );
};

const getSIOData = (filterData: ILogSioFilterForm) => {
  return http.post<
    ILogSioFilterForm,
    AxiosResponse<{ historyLogSioData: ILogSioData[] }>
  >("/sio/get-sio-data", filterData);
};
const getOpenSIOData = (filterData: ILogSioFilterForm) => {
  return http.post<
    ILogSioFilterForm,
    AxiosResponse<{ historyLogSioData: ILogSioData[] }>
  >("/sio/get-opensio-data", filterData);
};

const submitPDCAssign = (pdcData: ISIOPDCAssignData) => {
  return http.post<any, AxiosResponse<string>>("/sio/submit-pdcassign-data", {
    pdcData,
  });
};
const getAssignedSIOData = (filterData: ILogSioFilterForm) => {
  return http.post<
    ILogSioFilterForm,
    AxiosResponse<{ historyLogSioData: ILogSioData[] }>
  >("/sio/get-assignedsio-data", filterData);
};
const submitActionTaken = (pdcData: ISIOPDCAssignData) => {
  return http.post<any, AxiosResponse<string>>("/sio/submit-action-taken", {
    pdcData,
  });
};

export {
  getSIOData,
  addNewSIOData,
  updateAectStatus,
  getSIOMasterData,
  getOpenSIOData,
  submitPDCAssign,
  getAssignedSIOData,
  submitActionTaken,
};
