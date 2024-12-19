import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import IAppAccess from "../types/IAppAccess";

const getAppAccess = () => {
  return http.get<any, AxiosResponse<IAppAccess>>("/access/appaccess");
};

export default getAppAccess;

export { getAppAccess };
