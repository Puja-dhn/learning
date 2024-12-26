import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import IIMSMasterData from "../types/IIMSMasterData";
import ILogImsForm from "../types/ILogImsForm";

const addNewImsData = (formData: any) => {
  return http.post<ILogImsForm, AxiosResponse<string>>(
    "/ims/add-new-ims",
    formData,
  );
};
const getIMSMasterData = () => {
  return http.post<
    any,
    AxiosResponse<{ historyIMSMasterData: IIMSMasterData }>
  >("/ims/get-ims-master-data");
};

export { getIMSMasterData, addNewImsData };
