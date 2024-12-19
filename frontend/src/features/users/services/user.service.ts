import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import {
  IUserData,
  IUserDataEdit,
  IUserFilter,
  IUserProfileEdit,
} from "../types";
import { IOptionList } from "@/features/ui/types";
import IUserDetails from "@/features/authorization/types/IUserDetails";

const getUserDetails = (
  filterTicketNo: number,
  filterLocation: number,
  filterList: IUserFilter,
) => {
  return http.post<string, AxiosResponse<IUserData[]>>(
    "/user/get-user-details",
    {
      filterTicketNo,
      filterLocation,
      filterList,
    },
  );
};
const updateUserData = (userData: IUserDataEdit) => {
  return http.post<IUserDataEdit, AxiosResponse<string>>(
    "/user/udpate-user-details",
    userData,
  );
};
const updateUserProfile = (userData: IUserProfileEdit) => {
  return http.post<IUserProfileEdit, AxiosResponse<string>>(
    "/user/udpate-user-profile",
    userData,
  );
};

const rectifyUserImages = () => {
  return http.post<any, AxiosResponse<string>>("/user/rectify-user-images", {});
};

const getUserDBList = () => {
  return http.get<
    any,
    AxiosResponse<{
      allLocnList: IOptionList[];
      locnList: IOptionList[];
      subAreaList: IOptionList[];
      sapStatusList: IOptionList[];
      empTypeList: IOptionList[];
      gradeList: IOptionList[];
      roleList: IOptionList[];
      mappingList: IOptionList[];
    }>
  >("/user/get-userdb-list");
};

const getUserList = (
  inputText: string,
  limitType: string = "",
  teamId: number = 0,
  locnId: number = 0,
) => {
  return http.post<string, AxiosResponse<IOptionList[]>>(
    "/user/get-user-list",
    {
      inputText,
      limitType,
      teamId,
      locnId,
    },
  );
};

const getUserTeamMapping = (inputText: string, teamId: number = 0) => {
  return http.post<string, AxiosResponse<string>>(
    "/user/get-userteam-mapping",
    {
      inputText,
      teamId,
    },
  );
};

const getSapUser = (inputText: string) => {
  return http.post<string, AxiosResponse<IUserDetails>>("/auth/get-sap-user", {
    inputText,
  });
};
const checkValidUsers = (inputText: string) => {
  return http.post<string, AxiosResponse<string>>("/user/check-valid-users", {
    inputText,
  });
};

const getTeamUserList = (inputText: string, teamId: number = 0) => {
  return http.post<string, AxiosResponse<IOptionList[]>>(
    "/user/get-teamuser-list",
    {
      inputText,
      teamId,
    },
  );
};

const getUserEmployeeType = (ticketNo: number) => {
  return http.post<string, AxiosResponse<IUserData[]>>(
    "/user/get-employee-type",
    {
      ticketNo,
    },
  );
};
const activateUser = (employee_id: string) => {
  return http.post<string, AxiosResponse<string>>("/user/activate-user", {
    employee_id,
  });
};

export {
  getUserDetails,
  updateUserData,
  updateUserProfile,
  rectifyUserImages,
  getUserDBList,
  getTeamUserList,
  getUserList,
  getUserTeamMapping,
  getSapUser,
  checkValidUsers,
  getUserEmployeeType,
  activateUser,
};
