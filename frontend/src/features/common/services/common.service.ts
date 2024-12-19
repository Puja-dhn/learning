import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import IOrgData from "@/features/common/types/IOrgData";
import IUsers from "../types/IUsers";

const getInactiveUserList = () => {
  return http.get<
    any,
    AxiosResponse<{
      userList: IUsers[];
    }>
  >("/user/get-inactive-users", {});
};

const getOrgData = () => {
  return http.get<any, AxiosResponse<IOrgData>>("/common/orgdata");
};

const getDBDate = () => {
  return http.get<any, AxiosResponse<{ currDate: string }>>(
    "/common/get-db-date",
  );
};

export { getOrgData, getDBDate, getInactiveUserList };
