import { AxiosResponse } from "axios";
import http from "@/features/common/utils/http-common";
import ISOSMasterFilterValues from "../types/ISOSMasterFilterValues";
import ISOMasterData from "../types/ISOSMasterData";
import ISOTRCIncData from "../types/ISOTRCIncData";
import ILogAddContactForm from "../types/ILogAddContactForm";
import IThemeData from "../types/IThemeData";
import IActType from "../types/IActType";
import ISeverity from "../types/ISeverity";
import IActCategory from "../types/IActCategory";
import IActSubCategory from "../types/IActSubCategory";
import IBehaviour from "../types/IBehaviour";
import IStandards from "../types/IStandards";
import IPolicy from "../types/IPolicy";
import ILogAddObservationsForm from "../types/ILogAddObservationsForm";
import ICategoryDetails from "../types/ICategoryDetails";
import IObservationData from "../types/IObservationData";
import ISOSHeaderData from "../types/ISOSHeaderData";
import IAssignPDCData from "../types/IAssignPDCData";
import ILogAssignPdcForm from "../types/ILogAssignPdcForm";
import ILogActionTakenForm from "../types/ILogActionTakenForm";
import ICloseObsForm from "../types/ICloseObsForm";

const getMasterData = (
  ticketNo: number,
  locnId: number,
  orgId: number,
  unitId: number,
) => {
  return http.post<
    ISOSMasterFilterValues,
    AxiosResponse<{ historySOSMasterData: ISOMasterData }>
  >("/sos/fetch-master-data", { ticketNo, locnId, orgId, unitId });
};

const getTRCIncident = (area: string, logNo: string) => {
  return http.post<any, AxiosResponse<{ trcIncData: ISOTRCIncData[] }>>(
    "/sos/fetch-trc-data",
    { area, logNo },
  );
};
const deleteContact = (logNo: string, srno: number) => {
  return http.post<any, AxiosResponse<string>>("/sos/delete-contact", {
    logNo,
    srno,
  });
};

const addNewSOContactData = (contactData: ILogAddContactForm) => {
  return http.post<any, AxiosResponse<string>>("/sos/add-contact-data", {
    contactData,
  });
};
const getThemeDtls = (
  locnId: number,
  orgId: number,
  unitId: number,
  areaId: number,
) => {
  return http.post<
    any,
    AxiosResponse<{
      themeData: IThemeData[];
      themeDataArea: IThemeData[];
      actType: IActType[];
      severity: ISeverity[];
      category: IActCategory[];
      subCategory: IActSubCategory[];
      behaviour: IBehaviour[];
      standards: IStandards[];
      policy: IPolicy[];
      categoryDetails: ICategoryDetails[];
    }>
  >("/sos/get-theme-list", { locnId, orgId, unitId, areaId });
};

const addNewObservationstData = (observationData: ILogAddObservationsForm) => {
  return http.post<any, AxiosResponse<string>>("/sos/add-observation-data", {
    observationData,
  });
};

const getObservationList = (logNo: string, srno: number) => {
  return http.post<
    any,
    AxiosResponse<{
      observationData: IObservationData[];
    }>
  >("/sos/get-observation-list", { logNo, srno });
};

const deleteObservation = (logNo: string, cntsrno: number, srno: number) => {
  return http.post<any, AxiosResponse<string>>("/sos/delete-observation", {
    logNo,
    cntsrno,
    srno,
  });
};

const saveLog = (logNo: string, generalComments: string, ticketNo: string) => {
  return http.post<any, AxiosResponse<string>>("/sos/save-observation", {
    logNo,
    generalComments,
    ticketNo,
  });
};
const clearLog = (logNo: string, ticketNo: string) => {
  return http.post<any, AxiosResponse<string>>("/sos/clear-observation-data", {
    logNo,
    ticketNo,
  });
};
const submitLog = (
  logNo: string,
  generalComments: string,
  ticketNo: string,
  locnId: number,
  orgId: number,
  unitId: number,
) => {
  return http.post<any, AxiosResponse<string>>("/sos/submit-observation-data", {
    logNo,
    generalComments,
    ticketNo,
    locnId,
    orgId,
    unitId,
  });
};

const viewSosData = (
  fromDate: string,
  todate: string,
  obsStatus: string,
  selectedSeverity: string,
  ticketNo: string,
  locnId: string,
  orgId: string,
  unitId: string,
) => {
  return http.post<
    any,
    AxiosResponse<{
      sosHeaderData: ISOSHeaderData[];
    }>
  >("/sos/view-sos-data", {
    fromDate,
    todate,
    obsStatus,
    selectedSeverity,
    ticketNo,
    locnId,
    orgId,
    unitId,
  });
};

const getMasterDataLogWise = (
  ticketNo: string,
  locnId: string,
  orgId: string,
  unitId: string,
  logNo: string,
) => {
  return http.post<
    ISOSMasterFilterValues,
    AxiosResponse<{ historySOSMasterData: ISOMasterData }>
  >("/sos/fetch-master-data-logwise", {
    ticketNo,
    locnId,
    orgId,
    unitId,
    logNo,
  });
};
const getAssignPDCData = (
  ticketNo: number,
  locnId: number,
  orgId: number,
  unitId: number,
) => {
  return http.post<
    ISOSMasterFilterValues,
    AxiosResponse<{ historyObservationata: IAssignPDCData[] }>
  >("/sos/fetch-assignpdc-data", { ticketNo, locnId, orgId, unitId });
};

const submitPDCAssign = (pdcData: ILogAssignPdcForm) => {
  return http.post<any, AxiosResponse<string>>("/sos/submit-pdcassign-data", {
    pdcData,
  });
};

const getActionTakenData = (
  ticketNo: number,
  locnId: number,
  orgId: number,
  unitId: number,
) => {
  return http.post<
    ISOSMasterFilterValues,
    AxiosResponse<{ historyObservationata: IAssignPDCData[] }>
  >("/sos/fetch-actiontaken-data", { ticketNo, locnId, orgId, unitId });
};

const submitActionTaken = (actionData: ILogActionTakenForm) => {
  return http.post<any, AxiosResponse<string>>("/sos/submit-actiontaken-data", {
    actionData,
  });
};

const getCloseObservationData = (
  ticketNo: number,
  locnId: number,
  orgId: number,
  unitId: number,
) => {
  return http.post<
    ISOSMasterFilterValues,
    AxiosResponse<{ historyObservationata: IAssignPDCData[] }>
  >("/sos/fetch-mcloseobs-data", { ticketNo, locnId, orgId, unitId });
};
const closeObservation = (closeData: ICloseObsForm) => {
  return http.post<any, AxiosResponse<string>>("/sos/close-observation", {
    closeData,
  });
};

export {
  getMasterData,
  getTRCIncident,
  addNewSOContactData,
  deleteContact,
  getThemeDtls,
  addNewObservationstData,
  getObservationList,
  deleteObservation,
  saveLog,
  clearLog,
  submitLog,
  viewSosData,
  getMasterDataLogWise,
  getAssignPDCData,
  submitPDCAssign,
  getActionTakenData,
  submitActionTaken,
  getCloseObservationData,
  closeObservation,
};
