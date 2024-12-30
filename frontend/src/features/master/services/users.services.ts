import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import IUsersList from "../types/IUsersList";
import IUsersForm from "../types/IUsersForm";
import { IOptionList } from "@/features/ui/types";

const getUsersData = (filterData: IUsersList) => {
  return http.post<IUsersList, AxiosResponse<{ historyUsersData: IUsersList[] }>>(
    "/users/get-users",
    filterData
  );
};

const getUsersByIdData = (filterData: IUsersForm) => {
  return http.post<IUsersForm, AxiosResponse<{ historyUsersData: IUsersForm }>>(
    "/users/get-user-by-id",
    filterData
  );
};

const addUsersData = (formData: IUsersForm) => {
  return http.post<IUsersForm, AxiosResponse<string>>(
    "/users/add-users",
    formData
  );
};

const updateUsersData = (formData: IUsersForm) => {
  return http.post<IUsersForm, AxiosResponse<string>>(
    "/users/update-users",
    formData
  );
};

const deleteUsersData = (formData: IUsersForm) => {
  return http.post<IUsersForm, AxiosResponse<string>>(
    "/users/delete-users",
    formData
  );
};

const getUsersDBList = () => {
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

const getUsersList = (inputText: string, limitType: string = "", teamId: number = 0, locnId: number = 0) => {
  return http.post<string, AxiosResponse<IOptionList[]>>(
    "/user/get-users-list",
    {
      inputText,
      limitType,
      teamId,
      locnId,
    }
  );
};

export {
  getUsersData,
  getUsersByIdData,
  addUsersData,
  updateUsersData,
  deleteUsersData,
  getUsersDBList,
  getUsersList,
};
