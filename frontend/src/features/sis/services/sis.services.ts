import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import { ILogSioFilterForm, ILogSisForm } from "../types";
import ISIOMasterData from "../types/sis/ISIOMasterData";
import ILogSioData from "../types/sis/ILogSioData";
import ISIOPDCAssignData from "../types/sis/ISIOPDCAssignData";
import ISIODashboardData from "../types/sis/ISIODashboardData";

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

const getSIODashboardData = (
  department: number,
  fromDate: string,
  toDate: string,
) => {
  return http.post<
    {
      department: number;
      fromDate: string;
      toDate: string;
    },
    AxiosResponse<ISIODashboardData>
  >("/voc/get-dashboard-data", {
    department,
    fromDate,
    toDate,
  });
};

export {
  getSIOData,
  addNewSIOData,
  getSIOMasterData,
  getOpenSIOData,
  submitPDCAssign,
  getAssignedSIOData,
  submitActionTaken,
  getSIODashboardData,
};
