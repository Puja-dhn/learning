import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import IContextForm from "../types/IContextForm";
import IContextList from "../types/IContextList";

const getContextData = (filterData: IContextList) => {
  return http.post<
    IContextList,
    AxiosResponse<{ historyContextData: IContextList[] }>
  >("/master/get-context", filterData);
};

const getContextByIdData = (filterData: IContextForm) => {
  return http.post<
    IContextForm,
    AxiosResponse<{ historyContextData: IContextForm }>
  >("/master/get-context-by-id", filterData);
};

const addContextData = (formData: IContextForm) => {
  return http.post<
    IContextForm,
    AxiosResponse<string>
  >("/master/add-context", formData);
};

const updateContextData = (formData: IContextForm) => {
  return http.post<
    IContextForm,
    AxiosResponse<string>
  >("/master/update-context", formData);
};

const deleteContextData = (formData: IContextForm) => {
  return http.post<
    IContextForm,
    AxiosResponse<string>
  >("/master/delete-context", formData);
};

export {
  addContextData,
  updateContextData,
  deleteContextData,
  getContextData,
  getContextByIdData,
};
