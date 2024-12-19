import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import {
  IAectClosureForm,
  ILogAectData,
  ILogAectFilterForm,
  ILogAectForm,
  IAECTDashboardData,
} from "../types";

const addNewAectData = (aectData: ILogAectForm) => {
  return http.post<ILogAectForm, AxiosResponse<string>>(
    "/aect/add-new-aect",
    aectData,
  );
};

const updateAectStatus = (aectData: IAectClosureForm) => {
  return http.post<IAectClosureForm, AxiosResponse<string>>(
    "/aect/udpate-aect-status",
    aectData,
  );
};

const getAECTData = (filterData: ILogAectFilterForm) => {
  return http.post<
    ILogAectFilterForm,
    AxiosResponse<{ historyLogAectData: ILogAectData[] }>
  >("/aect/get-aect-data", filterData);
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
  return http.post<any, AxiosResponse<{ pendingLogAectData: ILogAectData[] }>>(
    "/aect/get-aect-pending",
    { team_id, area_id, division_id, location_id },
  );
};

export {
  getAECTData,
  addNewAectData,
  getAECTPendingClosureData,
  updateAectStatus,
  getAECTDashboardData,
};
