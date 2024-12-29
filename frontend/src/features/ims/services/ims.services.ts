import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import IIMSMasterData from "../types/IIMSMasterData";
import ILogImsForm from "../types/ILogImsForm";
import ILogImsFilterForm from "../types/ILogImsFilterForm";
import ILogImsData from "../types/ILogImsData";
import IIMSOthersData from "../types/IIMSOthersData";
import ITeamDtls from "../types/ITeamDtls";
import IInjuryDtls from "../types/IInjuryDtls";
import IImsTeamFormData from "../types/IImsTeamFormData";
import IImsCloseFormData from "../types/IImsCloseFormData";
import IImsMedicalFormData from "../types/IImsMedicalFormData";
import ILogInvestigationData from "../types/ILogInvestigationData";
import ILogRecomFilterForm from "../types/ILogRecomFilterForm";
import ILogRecommendationData from "../types/ILogRecommendationData";
import IRecomCloseForm from "../types/IRecomCloseForm";

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

const getIMSData = (filterData: ILogImsFilterForm) => {
  return http.post<
    ILogImsFilterForm,
    AxiosResponse<{
      historyLogImsData: ILogImsData[];
      INJURY_DETAILS: IInjuryDtls[];
      SUGG_TEAM: ITeamDtls[];
      WITNESS_TEAM: ITeamDtls[];
    }>
  >("/ims/get-ims-data", filterData);
};
const getIncidentOthersData = (incidentNo: number) => {
  return http.post<
    number,
    AxiosResponse<{ historyIMSOthersData: IIMSOthersData }>
  >("/ims/get-ims-others-data", incidentNo);
};
const getIMSTeamFormationData = (filterData: ILogImsFilterForm) => {
  return http.post<
    ILogImsFilterForm,
    AxiosResponse<{
      historyLogImsData: ILogImsData[];
      INJURY_DETAILS: IInjuryDtls[];
      SUGG_TEAM: ITeamDtls[];
      WITNESS_TEAM: ITeamDtls[];
    }>
  >("/ims/get-ims-teamformation-data", filterData);
};
const submitTeamFormation = (pdcData: IImsTeamFormData) => {
  return http.post<any, AxiosResponse<string>>(
    "/ims/submit-teamformnation-data",
    {
      pdcData,
    },
  );
};
const getIMSCloseData = (filterData: ILogImsFilterForm) => {
  return http.post<
    ILogImsFilterForm,
    AxiosResponse<{
      historyLogImsData: ILogImsData[];
      INJURY_DETAILS: IInjuryDtls[];
      SUGG_TEAM: ITeamDtls[];
      WITNESS_TEAM: ITeamDtls[];
    }>
  >("/ims/get-ims-close-data", filterData);
};
const closeIncident = (pdcData: IImsCloseFormData) => {
  return http.post<any, AxiosResponse<string>>("/ims/close-incident", {
    pdcData,
  });
};

const getIMSCategorizationData = (filterData: ILogImsFilterForm) => {
  return http.post<
    ILogImsFilterForm,
    AxiosResponse<{
      historyLogImsData: ILogImsData[];
      INJURY_DETAILS: IInjuryDtls[];
      SUGG_TEAM: ITeamDtls[];
      WITNESS_TEAM: ITeamDtls[];
    }>
  >("/ims/get-ims-categorization-data", filterData);
};

const submitIncidentCategory = (pdcData: IImsMedicalFormData) => {
  return http.post<any, AxiosResponse<string>>(
    "/ims/submit-incident-category",
    {
      pdcData,
    },
  );
};

const getIMSInvestigationData = (filterData: ILogImsFilterForm) => {
  return http.post<
    ILogImsFilterForm,
    AxiosResponse<{
      historyLogImsData: ILogImsData[];
      INJURY_DETAILS: IInjuryDtls[];
      SUGG_TEAM: ITeamDtls[];
      WITNESS_TEAM: ITeamDtls[];
    }>
  >("/ims/get-ims-investigation-data", filterData);
};

const submitInvestigationData = (pdcData: ILogInvestigationData) => {
  return http.post<any, AxiosResponse<string>>(
    "/ims/submit-investigation-data",
    {
      pdcData,
    },
  );
};

const getRecommendationData = (filterData: ILogRecomFilterForm) => {
  return http.post<
    ILogRecomFilterForm,
    AxiosResponse<{
      historyLogImsData: ILogRecommendationData[];
    }>
  >("/ims/get-recommendation-data", filterData);
};
const closeRecommendation = (pdcData: IRecomCloseForm) => {
  return http.post<any, AxiosResponse<string>>("/ims/close-recommendation", {
    pdcData,
  });
};

export {
  getIMSMasterData,
  addNewImsData,
  getIMSData,
  getIncidentOthersData,
  getIMSTeamFormationData,
  submitTeamFormation,
  getIMSCloseData,
  closeIncident,
  getIMSCategorizationData,
  submitIncidentCategory,
  getIMSInvestigationData,
  submitInvestigationData,
  getRecommendationData,
  closeRecommendation
};
