import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import IContextAddForm from "../types/IContextAddForm";



const addNewContextData = (formData: any) => {
  return http.post<IContextAddForm, AxiosResponse<string>>(
    "/master/add-new-context",
    formData,
  );
};


export {

    addNewContextData,

};
