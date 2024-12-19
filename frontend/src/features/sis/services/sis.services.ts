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

const getAECTDashboardData = (
  area_id: number,
  division_id: number,
  location_id: number,
) => {
  return http.post<
    {
      area_id: number;
      division_id: number;
      location_id: number;
    },
    AxiosResponse<IAECTDashboardData>
  >("/aect/get-dashboard-data", {
    area_id,
    division_id,
    location_id,
  });
};

const getAECTPendingClosureData = (
  team_id: number,
  area_id: number,
  division_id: number,
  location_id: number,
) => {
  return http.post<any, AxiosResponse<{ pendingLogAectData: ILogSioData[] }>>(
    "/aect/get-aect-pending",
    { team_id, area_id, division_id, location_id },
  );
};

export {
  getSIOData,
  addNewSIOData,
  getAECTPendingClosureData,
  updateAectStatus,
  getAECTDashboardData,
  getSIOMasterData,
  getOpenSIOData
};
