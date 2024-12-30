import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FunnelIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";
import { useQueryClient } from "react-query";
// import { utils, writeFile } from "xlsx";

import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import * as XLSX from "xlsx";
import { ASSET_BASE_URL } from "@/features/common/constants";
// import { IOptionList } from "@/features/ui/types";
import { IconButton } from "@/features/ui/buttons";
import { ModalPopup } from "@/features/ui/popup";
import { DropdownList, TextArea, TextField } from "@/features/ui/form";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import { useAppSelector } from "@/store/hooks";

import ModalPopupMobile from "@/features/ui/popup/ModalPopupMobile";

import { ILogSIOData } from "@/features/sis/types";
import ISIOPDCAssignData from "@/features/sis/types/sis/ISIOPDCAssignData";
import { IOptionList } from "@/features/ui/types";
import IAreasList from "@/features/sis/types/sis/IAreasList";
import ILogImsFilterForm from "@/features/ims/types/ILogImsFilterForm";
import useIMSMasterDataQuery from "@/features/ims/hooks/useIMSMasterDataQuery";
import ILogImsData from "@/features/ims/types/ILogImsData";
import useImsLogDetailQuery from "@/features/ims/hooks/useImsLogDetailQuery";
import { getIncidentOthersData } from "@/features/ims/services/ims.services";
import IInvestigation from "@/features/ims/types/IInvestigation";
import IRecommendations from "@/features/ims/types/IRecommendations";
import IDocuments from "@/features/ims/types/IDocuments";
import internal from "stream";
import { InputText } from "@/features/ui/elements";

interface ILogImsTeamData {
  historyLogImsData: ILogImsData[];
  INVESTIGATION_DATA: IInvestigation[];
  RECOMMENDATION_DATA: IRecommendations[];
  DOCUMENTS_DATA: IDocuments[];
}
const initialViewImsValues: ILogImsData = {
  disp_logno: 0,
  incident_no: 0,
  inc_date_time: "",
  department_id: "",
  department: "",
  area_id: "",
  area: 0,
  injury_type: "",
  factors: "",
  reported_by: 0,
  exact_location: "",
  potential_outcome: "",
  action_taken: "",
  incident_details: "",
  ims_photos: "",
  immediate_action: "",
  status: "",
  pending_on: "",
  created_at: "",
  created_by: "",
  updated_at: "",
  updated_by: "",
  log_by: "",
  close_remarks: "",
};
const initialFilterValues: ILogImsFilterForm = {
  incident_no: null,
  department: "All",
  area: "All",
  injury_type: "All",
  factors: "All",
  date_from: "",
  date_to: "",
  status: "All",
};

function ViewIms() {
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const [isDesktop, setIsDesktop] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<any>([]);
  const [departments, setDepartments] = useState<IOptionList[]>([]);
  const [injuryType, setInjuryType] = useState<IOptionList[]>([]);
  const [factors, setFactors] = useState<IOptionList[]>([]);
  const [areas, setAreas] = useState<IAreasList[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<IOptionList[]>([]);
  const [modalImage, setModalImage] = useState<string>("");

  const {
    data: imsMasterData,
    isLoading: isIMSMasterDataLoading,
    isError: isIMSMasterDataError,
  } = useIMSMasterDataQuery();

  useEffect(() => {
    if (isIMSMasterDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isIMSMasterDataLoading && isIMSMasterDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (!isIMSMasterDataLoading && !isIMSMasterDataError && imsMasterData) {
      const historyImsMasterData = [imsMasterData.historyIMSMasterData];

      setDepartments(historyImsMasterData[0].DEPARTMENT);
      setInjuryType(historyImsMasterData[0].INJURYTYPE);
      setFactors(historyImsMasterData[0].FACTORS);
      setAreas(historyImsMasterData[0].AREA);
    }
  }, [imsMasterData, isIMSMasterDataLoading, isIMSMasterDataError]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    // Initialize the screen size check
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const [teamData, setTeamData] = useState<ILogImsTeamData>({
    historyLogImsData: [],
    INVESTIGATION_DATA: [],
    RECOMMENDATION_DATA: [],
    DOCUMENTS_DATA: [],
  });

  const [logDetails, setLogDetails] = useState<ILogImsTeamData>({
    historyLogImsData: [],
    INVESTIGATION_DATA: [],
    RECOMMENDATION_DATA: [],
    DOCUMENTS_DATA: [],
  });

  const [showLogDetailsDialog, setShowLogDetailsDialog] = useState({
    status: false,
  });

  const [showPDCAssignDialog, setShowPDCAssignDialog] = useState({
    status: false,
  });
  const [showImageDialog, setShowImageDialog] = useState({
    status: false,
  });
  const [injuryRow, setInjuryRow] = useState<any[]>([]);
  const [witTeamRow, setWitTeamRow] = useState<any[]>([]);
  const [suggTeamRow, setSuggTeamRow] = useState<any[]>([]);

  const [injuryFilterRow, setInjuryFilterRow] = useState<any[]>([]);
  const [witTeamFilterRow, setWitTeamFilterRow] = useState<any[]>([]);
  const [suggTeamFilterRow, setSuggTeamFilterRow] = useState<any[]>([]);

  const [factRows, setFactRows] = useState<any>([]);
  const [physicalFactorRows, setPhysicalFactorRows] = useState<any>([]);
  const [humanFactorRows, setHumanFactorRows] = useState<any>([]);
  const [systemFactorRows, setSystemFactorRows] = useState<any>([]);
  const [recomendationRows, setRecomendationRows] = useState<any>([]);
  const [investigations, setInvestigations] = useState<any>([]);
  const [documentsRow, setDocumentsRow] = useState<any>([]);

  const {
    reset: resetActionTaken,
    control: controlAction,
    watch: watchView,
  } = useForm<ILogImsData>({
    defaultValues: initialViewImsValues,
  });

  const handlePDCAssignDialogClose = () => {
    setShowPDCAssignDialog((oldState) => ({ ...oldState, status: false }));
  };
  const handleActionClick = (row: ILogImsData) => {
    const injFilter = injuryRow.filter(
      (item) => item.header_id === row.incident_no,
    );
    setInjuryFilterRow(injFilter);
    const suggFilter = suggTeamRow.filter(
      (item) => item.header_id === row.incident_no,
    );
    setSuggTeamFilterRow(suggFilter);
    const wittFilter = witTeamRow.filter(
      (item) => item.header_id === row.incident_no,
    );
    setWitTeamFilterRow(wittFilter);

    if (teamData.INVESTIGATION_DATA.length > 0) {
      const invData = teamData.INVESTIGATION_DATA.filter(
        (item) => +item.incident_id === +row.incident_no,
      );
      const recomdata = teamData.RECOMMENDATION_DATA.filter(
        (item) => +item.incident_id === +row.incident_no,
      );
      const imagedata = teamData.DOCUMENTS_DATA.filter(
        (item) => +item.incident_id === +row.incident_no,
      );
      if (invData[0].list_facts !== "") {
        setFactRows(JSON.parse(invData[0].list_facts));
        setPhysicalFactorRows(JSON.parse(invData[0].physical_factors));
        setHumanFactorRows(JSON.parse(invData[0].human_factors));
        setSystemFactorRows(JSON.parse(invData[0].system_factors));
        setInvestigations(invData[0]);
      }
      if (recomdata.length > 0) {
        setRecomendationRows(recomdata);
      }
      if (imagedata.length > 0) {
        setDocumentsRow(imagedata);
      }
    }

    setImagePreviews(JSON.parse(row.ims_photos));
    resetActionTaken({
      disp_logno: row.disp_logno,
      incident_no: row.incident_no,
      inc_date_time: row.inc_date_time,
      department_id: row.department_id,
      department: row.department,
      area_id: row.area_id,
      area: row.area,
      injury_type: row.injury_type,
      factors: row.factors,
      reported_by: row.reported_by,
      exact_location: row.exact_location,
      potential_outcome: row.potential_outcome,
      action_taken: row.action_taken,
      incident_details: row.incident_details,
      immediate_action: row.immediate_action,
      status: row.status,
    });

    setShowPDCAssignDialog({
      status: true,
    });
  };
  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <IconButton
          className="ml-2"
          onClick={() => handleActionClick(params.row)}
        >
          <EyeIcon className="w-4 h-4" />
        </IconButton>
      ),
    },
    { field: "disp_logno", headerName: "Log No", width: 70 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "inc_date_time", headerName: "Incident Date Time", width: 250 },
    { field: "department", headerName: "Department", width: 240 },
    { field: "area", headerName: "Area", width: 250 },
    { field: "injury_type", headerName: "Injury Type", width: 220 },
    { field: "factors", headerName: "Factors", width: 220 },
    { field: "pending_on", headerName: "Pending On", width: 200 },
    { field: "log_by", headerName: "Log By", width: 200 },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  // const [reportedByList, setReportedByList] = useState<IOptionList[]>([
  //   { id: 0, name: "All Reported By" },
  // ]);
  const queryClient = useQueryClient();

  const [filterList, setFilterList] = useState<ILogImsFilterForm>({
    ...initialFilterValues,
  });

  const isAdmin =
    authState.ROLES &&
    authState.ROLES.length > 0 &&
    authState.ROLES.includes(2);

  const CURR_OBS_STATUS_LIST = [
    { id: "Open", name: "Open" },
    { id: "Team Formed", name: "Team Formed" },
    { id: "Investigation", name: "Investigation" },
    { id: "Closed", name: "Closed" },
  ];

  const {
    data: imsLogHistoryData,
    isLoading: isImsLogHistoryDataLoading,
    isError: isImsLogHistoryDataError,
  } = useImsLogDetailQuery(filterList);

  const [showFilterDialog, setShowFilterDialog] = useState({
    status: false,
    formInitialValues: initialFilterValues,
  });

  const {
    handleSubmit: handleSubmitFilter,
    reset: resetFilter,
    control: controlFilter,
    watch: watchValues,
    formState: formStateFilter,
  } = useForm<ILogImsFilterForm>({
    defaultValues: initialFilterValues,
  });

  const { submitCount: submitCountFilter, errors: errorsFilter } =
    formStateFilter;

  const handleFilterDialogOpen = () => {
    resetFilter({
      ...filterList,
    });
    setShowFilterDialog({
      status: true,
      formInitialValues: {
        ...filterList,
      },
    });
  };

  const handleFilterDialogClose = () => {
    setShowFilterDialog((oldState) => ({ ...oldState, status: false }));
  };

  const handleFilterFormSubmit: SubmitHandler<ILogImsFilterForm> = (values) => {
    setShowFilterDialog((oldState) => ({ ...oldState, status: false }));
    setFilterList({ ...values });
  };

  useEffect(() => {
    if (isImsLogHistoryDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isImsLogHistoryDataLoading && isImsLogHistoryDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (
      !isImsLogHistoryDataLoading &&
      !isImsLogHistoryDataError &&
      imsLogHistoryData
    ) {
      // const historyLogAectData = [...aectLogHistoryData.historyLogAectData];
      const historyLogImsData = !isAdmin
        ? [
            ...imsLogHistoryData.historyLogImsData.filter(
              (item) => +item.created_by === authState.ID,
            ),
          ]
        : [...imsLogHistoryData.historyLogImsData];
      setTeamData((prevState) => ({
        ...prevState,
        historyLogImsData,
        INVESTIGATION_DATA: imsLogHistoryData.INVESTIGATION_DATA,
        RECOMMENDATION_DATA: imsLogHistoryData.RECOMMENDATION_DATA,
        DOCUMENTS_DATA: imsLogHistoryData.DOCUMENTS_DATA,
      }));

      setInjuryRow(imsLogHistoryData.INJURY_DETAILS);
      setSuggTeamRow(imsLogHistoryData.SUGG_TEAM);
      setWitTeamRow(imsLogHistoryData.WITNESS_TEAM);
      if (imsLogHistoryData.INVESTIGATION_DATA.length > 0) {
        const factsList = imsLogHistoryData.INVESTIGATION_DATA[0].list_facts;
        if (factsList !== "") {
          setFactRows(JSON.parse(factsList));
        }
      }
    }
  }, [imsLogHistoryData, isImsLogHistoryDataLoading, isImsLogHistoryDataError]);

  useEffect(() => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "imsDataQuery",
    });
  }, []);

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "imsDataQuery",
    });
  };

  useEffect(() => {
    if (+watchValues("department") > 0) {
      const fArea = areas.filter(
        (item) => +item.parent_id === +watchValues("department"),
      );
      setFilteredAreas(fArea);
    }
  }, [watchValues("department")]);

  const handleShowLogDetails = (logNo: number) => {
    const historyLogImsData = [
      ...teamData.historyLogImsData.filter(
        (item) => item.incident_no === logNo,
      ),
    ];
    setLogDetails((prevState) => ({
      ...prevState,
      historyLogImsData,
      INVESTIGATION_DATA: teamData.INVESTIGATION_DATA,
      RECOMMENDATION_DATA: teamData.RECOMMENDATION_DATA,
      DOCUMENTS_DATA: teamData.DOCUMENTS_DATA,
    }));
    //setLogDetails({ historyLogImsData, RECOMMENDATION_DATA: [] });

    setShowLogDetailsDialog({
      status: true,
    });
  };

  const formatDate = (date: any) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleImageDialogClose = () => {
    setShowImageDialog((oldState) => ({ ...oldState, status: false }));
    setModalImage("");
  };
  const openImageModal = (image: any) => {
    setModalImage(image);
    setShowImageDialog({ status: true });
  };

  const handleExport = () => {
    const rows = teamData.historyLogImsData.map((item) => ({
      "Log No": item.disp_logno,
      Status: item.status,
      "Incident Date Time": item.inc_date_time,
      Department: item.department,
      Area: item.area,
      "Injury Type": item.injury_type,
      factors: item.factors,
      "Pending On": item.pending_on,
      "Log By": item.log_by,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "export.xlsx");
  };
  return (
    <div className="flex flex-col w-full h-full gap-2 p-4 overflow-hidden text-sm md:p-6">
      <div className="h-[50px] flex justify-between items-center p-1.5 px-2.5 border-[1px] text-md font-semibold text-center bg-[#f0f8ff] rounded-lg shadow-md dark:bg-gray-600 dark:text-cyan-200 dark:border-gray-500">
        <div className="flex items-center justify-center gap-2">
          View Incident
        </div>
        <div className="flex items-center justify-end gap-4 ml-20">
          <IconButton onClick={handleExport}>
            <ArrowDownTrayIcon className="w-4 h-4" />
          </IconButton>
          <IconButton onClick={handleFilterDialogOpen}>
            <FunnelIcon className="w-4 h-4" />
          </IconButton>
          <IconButton onClick={handleRefresh}>
            <ArrowPathIcon className="w-4 h-4" />
          </IconButton>
        </div>
      </div>
      {isDesktop ? (
        <div className="h-full overflow-auto border-[1px] dark:border-gray-700 ">
          <Paper sx={{ height: "100%", width: "100%" }}>
            <DataGrid
              checkboxSelection={false}
              rows={teamData.historyLogImsData}
              columns={columns}
              getRowId={(row) =>
                row.TEAM_ID || row.ID || Math.random().toString(36).substring(2)
              }
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              sx={{
                border: 0,
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#f5f5f5", // Background color for the header
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold", // Make the text bold
                },
              }}
            />
          </Paper>
          {/* <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {tableColumns.map((col) => (
                  <th
                    key={col.dbCol}
                    className={`py-3 px-6 sticky top-0 bg-gray-50 dark:bg-gray-700 ${col.minWidth}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamData.historyLogAectData.map((row) => (
                <tr
                  key={row.ID}
                  className="border-[1px] bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  {tableColumns.map((col) => (
                    <td
                      key={`${row.ID}_${col.dbCol}`}
                      className="px-6 py-4 font-normal text-cyan-700 whitespace-nowrap dark:text-white"
                    >
                      {row[col.dbCol as keyof ILogAectData]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table> */}
        </div>
      ) : (
        <div className="flex flex-col h-full gap-2 overflow-auto ">
          {teamData.historyLogImsData.map((row) => (
            <button
              key={row.incident_no}
              type="button"
              onClick={() => handleShowLogDetails(row.incident_no)}
              className="w-full"
            >
              <div className="relative flex items-start bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:shadow-gray-700 dark:border-gray-600">
                {/* Full-Height Vertical Log No */}
                <div className="absolute top-0 left-0 flex items-center justify-center w-6 h-full  text-center text-white bg-[#6388bd] dark:bg-blue-900">
                  <span className="origin-center transform -rotate-90">
                    {row.disp_logno}
                  </span>
                </div>

                {/* Content Section */}
                <div className="w-full p-2 ml-5 text-xs text-gray-700 dark:text-gray-300">
                  {/* First Row (Reported Date and Category) */}
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center space-x-4 w-[50%]">
                      <span className="font-semibold">Date:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatDate(row.inc_date_time)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 w-[40%]">
                      <span className="font-semibold">Injury Type:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {row.injury_type}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-2">
                    <div className="flex items-center w-full space-x-4">
                      <span className="font-semibold">Area:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {" "}
                        {row.area}
                      </span>
                    </div>
                  </div>

                  {/* Second Row (Reported By and Severity) */}
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center space-x-4 ">
                      <span className="font-semibold">Reported By:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {row.pending_on}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center space-x-4 ">
                      <span className="font-semibold">Status:</span>
                      <span
                        className={`${
                          row.status === "Open"
                            ? "text-red-500"
                            : row.status === "Team Formed"
                            ? "text-green-500"
                            : row.status === "Investigation"
                            ? "text-orange-500"
                            : "text-gray-600"
                        } dark:text-gray-400`}
                      >
                        {row.status}
                      </span>
                    </div>
                  </div>

                  {/* Chevron Icon for Details */}
                  <div className="absolute top-0 right-0 flex items-center justify-center h-full px-2">
                    <ChevronRightIcon
                      onClick={() => handleShowLogDetails(row.incident_no)}
                      height={20}
                      className="text-[#014098] transition-colors duration-300 cursor-pointer hover:text-blue-700"
                    />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <ModalPopup
        heading="Search Incident Data"
        onClose={handleFilterDialogClose}
        openStatus={showFilterDialog.status}
        hasSubmit
        onSubmit={() => {
          handleSubmitFilter(handleFilterFormSubmit)();
        }}
        size="large"
        showError
        hasError={
          !(Object.keys(errorsFilter).length === 0) && submitCountFilter > 0
        }
      >
        <form className="bg-[#ecf3f9] dark:bg-gray-600 grid gap-2.5 p-2.5">
          <div className="flex flex-wrap justify-evenly items-center p-2.5 border-[1px]  border-gray-300 rounded-lg dark:border-gray-500">
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <TextField
                type="number"
                name="incident_no"
                label="Incident No"
                control={controlFilter}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <DropdownList
                name="department"
                label="Department"
                control={controlFilter}
                optionList={[
                  { id: "All", name: "All Departments" },
                  ...departments,
                ]}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <DropdownList
                name="area"
                label="Area"
                control={controlFilter}
                optionList={[{ id: "All", name: "All Area" }, ...filteredAreas]}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <DropdownList
                name="injury_type"
                label="Injury Type"
                control={controlFilter}
                optionList={[{ id: "All", name: "All" }, ...injuryType]}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <DropdownList
                name="factors"
                label="Cause Of Incident"
                control={controlFilter}
                optionList={[{ id: "All", name: "All" }, ...factors]}
              />
            </div>

            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <TextField
                type="date"
                name="date_from"
                label="Date From"
                control={controlFilter}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <TextField
                type="date"
                name="date_to"
                label="Date To"
                control={controlFilter}
              />
            </div>

            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <DropdownList
                name="status"
                label="Status"
                control={controlFilter}
                optionList={[
                  { id: "All", name: "All Status" },
                  ...CURR_OBS_STATUS_LIST,
                ]}
              />
            </div>
          </div>
        </form>
      </ModalPopup>

      <ModalPopup
        heading="View Incident"
        onClose={handlePDCAssignDialogClose}
        openStatus={showPDCAssignDialog.status}
        hasSubmit={false}
        size="fullscreen"
        showError
        hasError={
          !(Object.keys(errorsFilter).length === 0) && submitCountFilter > 0
        }
      >
        <div className="relative flex flex-col w-full h-full p-2 overflow-auto ">
          <div className="p-2 bg-white shadow-lg dark:bg-gray-800">
            <div className="grid gap-1 border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
              <div className="pb-2 border-b-2 border-gray-200 dark:border-gray-500">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  General Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="p-1">
                  <TextField
                    name="inc_date_time"
                    label="Incident Date Time"
                    control={controlAction}
                    disabled
                  />
                </div>
                <div className="p-1">
                  <TextField
                    name="department"
                    label="Department"
                    control={controlAction}
                    disabled
                  />
                </div>
                <div className="p-1">
                  <TextField
                    name="area"
                    label="Area"
                    control={controlAction}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="p-1">
                  <TextField
                    name="reported_by"
                    label="Reported By"
                    control={controlAction}
                    disabled
                  />
                </div>
                <div className="p-1">
                  <TextField
                    name="injury_type"
                    label="Injury Type"
                    control={controlAction}
                    disabled
                  />
                </div>
                <div className="p-1">
                  <TextField
                    name="factors"
                    label="Cause Of Incident"
                    control={controlAction}
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="p-1">
                  <TextArea
                    name="exact_location"
                    label="Exact Location"
                    control={controlAction}
                    disabled
                  />
                </div>
                <div className="p-1">
                  <TextArea
                    name="potential_outcome"
                    label="Potential Outcome"
                    control={controlAction}
                    disabled
                  />
                </div>
                <div className="p-1">
                  <TextArea
                    name="action_taken"
                    label="Immediate Action taken"
                    control={controlAction}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 ">
                <div className="p-1">
                  <TextArea
                    name="incident_details"
                    label="Incident Details"
                    control={controlAction}
                    disabled
                  />
                </div>
              </div>
              <div className="py-1">
                <div className="border-b-[#00000036] border-b-[1px] pb-2">
                  <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                    Incident Photos:
                  </span>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {imagePreviews.map((preview: any, index: any) => (
                      <div key={index} className="relative">
                        <img
                          src={`${ASSET_BASE_URL}imsimages/logims/${
                            preview || ""
                          }`}
                          alt={`preview-${index}`}
                          className="object-cover h-20 rounded-lg cursor-pointer w-30"
                          onClick={() =>
                            openImageModal(
                              `${ASSET_BASE_URL}imsimages/logims/${preview}`,
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {watchView("injury_type") === "Medical Center FAC" && (
                  <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                    <div className="">
                      <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                        <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                          Injured Person Details &nbsp;
                        </h3>
                      </div>

                      <div className="mt-1">
                        <table className="min-w-full border-collapse table-auto ">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Sl. No.
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Company Type
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Employee ID
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Name
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Department
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Company
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Age
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Sex
                              </th>

                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                BodyPart
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                InjuryNature
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {injuryFilterRow.map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {index + 1}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.company_type}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.employee_id}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.name}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.department}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.company}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.age}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.sex}
                                </td>

                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.body_part}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.injury_nature}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        Suggested Team (Investigation Team) &nbsp;
                      </h3>
                    </div>

                    <div className="mt-1">
                      <table className="min-w-full border-collapse table-auto">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[25%]">
                              Sl. No.
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[25%]">
                              Employee ID
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[50%]">
                              Name
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {suggTeamFilterRow &&
                            suggTeamFilterRow.length > 0 &&
                            suggTeamFilterRow.map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {index + 1}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.employee_id}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.name}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                  <div className="">
                    <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                      <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                        Witness &nbsp;
                      </h3>
                    </div>

                    <div className="mt-1">
                      <table className="min-w-full border-collapse table-auto">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[25%]">
                              Sl. No.
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[25%]">
                              Employee ID
                            </th>
                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[25%]">
                              Name
                            </th>

                            <th className="px-4 py-2 text-sm text-left text-gray-700 border-b w-[25%]">
                              Department/Company
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700">
                          {witTeamFilterRow &&
                            witTeamFilterRow.length > 0 &&
                            witTeamFilterRow.map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {index + 1}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.employee_id}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.name}
                                </td>

                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {item.department}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {factRows.length > 0 && (
                  <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                    <div className="">
                      <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                        <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                          List Of Facts &nbsp;
                        </h3>
                      </div>

                      <div className="mt-1">
                        <table className="min-w-full border-collapse table-auto ">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Sl. No.
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Facts
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {factRows &&
                              factRows.length > 0 &&
                              factRows.map((item: any) => (
                                <tr key={item.id}>
                                  <td className="px-4 py-2 text-gray-700 border-b">
                                    {item.id}
                                  </td>
                                  <td className="px-4 py-2 text-gray-700 border-b">
                                    {item.facts}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {investigations && (
                  <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                    <div className="">
                      <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                        <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                          Risk Management &nbsp;
                        </h3>
                      </div>

                      <div className="mt-1">
                        <div className="px-4 py-2 text-gray-700">
                          <span>Was the risk identified in HIRA / JSA?</span>
                          &nbsp;
                          <input
                            type="radio"
                            name="risk_identified"
                            value="Yes"
                            checked={investigations.risk_identified === "Yes"}
                          />
                          &nbsp; Yes &nbsp;
                          <input
                            type="radio"
                            name="risk_identified"
                            value="No"
                            checked={investigations.risk_identified === "No"}
                          />
                          &nbsp; No
                        </div>
                      </div>
                      {investigations.risk_identified === "Yes" && (
                        <div className="mt-1">
                          <div className="px-4 py-2 text-gray-700">
                            <span>Was the identified control?</span>
                            &nbsp;
                            <input
                              type="radio"
                              name="identified_control"
                              value="Yes"
                              checked={
                                investigations.identified_control === "Yes"
                              }
                            />
                            &nbsp; Yes &nbsp;
                            <input
                              type="radio"
                              name="identified_control"
                              value="No"
                              checked={
                                investigations.identified_control === "No"
                              }
                            />
                            &nbsp; No
                          </div>
                        </div>
                      )}
                      {investigations.identified_control === "Yes" && (
                        <div className="mt-1">
                          <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="px-4 py-2 text-gray-700 ">
                              <span className="">
                                What was the identified control ?
                              </span>
                              &nbsp;
                              <select
                                name="control_type"
                                value={investigations.control_type}
                                disabled
                                className=" bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-700"
                              >
                                <option value="">Select</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Administrative">
                                  Administrative
                                </option>
                                <option value="PPE">PPE</option>
                              </select>
                            </div>
                            <div className="mt-[10px]">
                              <span className="text-gray-700">Description</span>
                              <InputText
                                value={investigations.control_description}
                                className="w-full "
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {investigations.identified_control === "Yes" && (
                        <div className="mt-1">
                          <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="px-4 py-2 text-gray-700">
                              <span>Why Control was not adequate</span>
                              <InputText
                                value={investigations.control_description}
                                className="w-full"
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {physicalFactorRows.length > 0 && (
                  <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                    <div className="">
                      <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                        <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                          Physical Factors &nbsp;
                        </h3>
                      </div>

                      <div className="mt-1">
                        <table className="min-w-full border-collapse table-auto ">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Sl. No.
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {physicalFactorRows &&
                              physicalFactorRows.length > 0 &&
                              physicalFactorRows.map((item: any) => (
                                <tr key={item.id}>
                                  <td className="px-4 py-2 text-gray-700 border-b">
                                    {item.id}
                                  </td>
                                  <td className="px-4 py-2 text-gray-700 border-b">
                                    {item.description}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                {humanFactorRows.length > 0 && (
                  <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                    <div className="">
                      <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                        <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                          Human Factors &nbsp;
                        </h3>
                      </div>

                      <div className="mt-1">
                        <table className="min-w-full border-collapse table-auto ">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Sl. No.
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {humanFactorRows &&
                              humanFactorRows.length > 0 &&
                              humanFactorRows.map((item: any) => (
                                <tr key={item.id}>
                                  <td className="px-4 py-2 text-gray-700 border-b">
                                    {item.id}
                                  </td>
                                  <td className="px-4 py-2 text-gray-700 border-b">
                                    {item.description}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                {systemFactorRows.length > 0 && (
                  <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                    <div className="">
                      <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                        <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                          System Factors &nbsp;
                        </h3>
                      </div>

                      <div className="mt-1">
                        <table className="min-w-full border-collapse table-auto ">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Sl. No.
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Description
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {systemFactorRows &&
                              systemFactorRows.length > 0 &&
                              systemFactorRows.map((item: any) => (
                                <tr key={item.id}>
                                  <td className="px-4 py-2 text-gray-700 border-b">
                                    {item.id}
                                  </td>
                                  <td className="px-4 py-2 text-gray-700 border-b">
                                    {item.description}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                {recomendationRows.length > 0 && (
                  <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                    <div className="">
                      <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                        <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                          Recommendations &nbsp;
                        </h3>
                      </div>

                      <div className="mt-1">
                        <table className="min-w-full border-collapse table-auto ">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Sl. No.
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Recommendation
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Responsibility
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Fcator
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Control Type
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Target Date
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {recomendationRows &&
                              recomendationRows.length > 0 &&
                              recomendationRows.map((item: any) => (
                                <tr key={item.id}>
                                  <td className="px-4 py-2 text-gray-700 border-b">
                                    {item.id}
                                  </td>
                                  <td className="px-4 py-2 text-gray-700 border-b">
                                    {item.recommendation}
                                  </td>
                                  <td className="px-4 py-2 text-gray-700 border-b">
                                    {item.responsibility}
                                  </td>
                                  <td className="px-4 py-2 text-gray-700 border-b">
                                    {item.factor}
                                  </td>
                                  <td className="px-4 py-2 text-gray-700 border-b">
                                    {item.control_type}
                                  </td>
                                  <td className="px-4 py-2 text-gray-700 border-b">
                                    {item.target_date}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                {documentsRow.length > 0 && (
                  <div className="grid border-[1px] border-gray-200 rounded-lg  dark:border-gray-500 dark:bg-gray-800">
                    <div className="">
                      <div className="flex items-center p-2 bg-[#e1e1e1]  rounded-lg">
                        <h3 className="font-semibold text-gray-700 text-md dark:text-gray-300">
                          Upload Documents &nbsp;
                        </h3>
                      </div>
                      <div className="mt-1">
                        <table className="min-w-full border-collapse table-auto ">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Sl. No.
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Document type
                              </th>
                              <th className="px-4 py-2 text-sm text-left text-gray-700 border-b">
                                Documents
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Render added rows */}
                            {documentsRow.map((row: any, index: any) => (
                              <tr key={row.id}>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {index + 1}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  {row.document_type}
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">
                                  <img
                                    src={`${ASSET_BASE_URL}imsimages/investigation/${
                                      row.document || ""
                                    }`}
                                    alt={`preview-${index}`}
                                    className="object-cover w-10 h-10 rounded-lg cursor-pointer"
                                    onClick={() =>
                                      openImageModal(
                                        `${ASSET_BASE_URL}imsimages/investigation/${row.document}`,
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ModalPopup>
      <ModalPopup
        heading="View Image"
        onClose={handleImageDialogClose}
        openStatus={showImageDialog.status}
        hasSubmit={false}
        size="fullscreen"
      >
        <div className="relative flex flex-col w-full h-full p-2 overflow-auto ">
          <img
            src={modalImage}
            alt="previewimage"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
      </ModalPopup>
    </div>
  );
}

export default ViewIms;
