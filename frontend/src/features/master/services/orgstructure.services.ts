import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import IOrgStructureList from "../types/IOrgStructureList";
import IOrgStructureForm from "../types/IOrgStructureForm";
import { IOptionList } from "@/features/ui/types";

const getOrgStructureData = (filterData: IOrgStructureList) => {
  return http.post<IOrgStructureList, AxiosResponse<{ historyOrgStructureData: IOrgStructureList[] }>>(
    "/master/get-orgstructure",
    filterData
  );
};

const getUsersData = () => {
  return http.post<IOptionList, AxiosResponse<{ historyUserData : IOptionList[] }>>(
    "/master/get-users"
  );
};

const getOrgStructureByIdData = (filterData: IOrgStructureForm) => {
  return http.post<IOrgStructureForm, AxiosResponse<{ historyOrgStructureData: IOrgStructureForm }>>(
    "/master/get-orgstructure-by-id",
    filterData
  );
};

const addOrgStructureData = (formData: IOrgStructureForm) => {
  return http.post<IOrgStructureForm, AxiosResponse<string>>(
    "/master/add-orgstructure",
    formData
  );
};

const updateOrgStructureData = (formData: IOrgStructureForm) => {
  return http.post<IOrgStructureForm, AxiosResponse<string>>(
    "/master/update-orgstructure",
    formData
  );
};

const deleteOrgStructureData = (formData: IOrgStructureForm) => {
  return http.post<IOrgStructureForm, AxiosResponse<string>>(
    "/master/delete-orgstructure",
    formData
  );
};



const getOrgStructureDBList = () => {
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
  >("/user/get-orgstructure-list");
};

const getOrgStructureList = (inputText: string, limitType: string = "", teamId: number = 0, locnId: number = 0) => {
  return http.post<string, AxiosResponse<IOptionList[]>>(
    "/master/get-orgstructure-list",
    {
      inputText,
      limitType,
      teamId,
      locnId,
    }
  );
};

export {
  getOrgStructureData,
  getOrgStructureByIdData,
  addOrgStructureData,
  updateOrgStructureData,
  deleteOrgStructureData,
  getOrgStructureDBList,
  getOrgStructureList,
  getUsersData
};
