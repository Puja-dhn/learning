import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import { ILogNMCForm, ILogNMCFilterForm, ILogNMCData } from "../types";

const addNewNMCData = (nmcData: ILogNMCForm) => {
  return http.post<ILogNMCForm, AxiosResponse<string>>(
    "/nmc/add-new-nmc",
    nmcData,
  );
};

const getNMCData = (filterData: ILogNMCFilterForm) => {
  return http.post<
    ILogNMCFilterForm,
    AxiosResponse<{ historyLogNMCData: ILogNMCData[] }>
  >("/nmc/get-nmc-data", filterData);
};

export { addNewNMCData, getNMCData };
