import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FunnelIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
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
import {
  closeIncident,
  closeRecommendation,
  getIncidentOthersData,
  submitTeamFormation,
} from "@/features/ims/services/ims.services";
import useImsTeamFormationQuery from "@/features/ims/hooks/useImsTeamFormationQuery";
import IImsTeamFormData from "@/features/ims/types/IImsTeamFormData";
import { InputText } from "@/features/ui/elements";
import useImsCloseQuery from "@/features/ims/hooks/useImsCloseQuery";
import IImsCloseFormData from "@/features/ims/types/IImsCloseFormData";
import ILogRecomFilterForm from "@/features/ims/types/ILogRecomFilterForm";
import useRecomCloseQuery from "@/features/ims/hooks/useRecomCloseQuery";
import ILogRecommendationData from "@/features/ims/types/ILogRecommendationData";
import IRecomCloseForm from "@/features/ims/types/IRecomCloseForm";

interface ILogImsTeamData {
  historyLogImsData: ILogRecommendationData[];
}
const initialCloseRecomValues: IRecomCloseForm = {
  id: 0,
  close_remarks: "",
};
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
const initialFilterValues: ILogRecomFilterForm = {
  incident_no: null,
  date_from: "",
  date_to: "",
  status: "Submitted",
};

function CloseRecommendation() {
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const [isDesktop, setIsDesktop] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<any>([]);
  const [departments, setDepartments] = useState<IOptionList[]>([]);
  const [users, setUsers] = useState<IOptionList[]>([]);
  const [injuryType, setInjuryType] = useState<IOptionList[]>([]);
  const [factors, setFactors] = useState<IOptionList[]>([]);
  const [areas, setAreas] = useState<IAreasList[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<IOptionList[]>([]);
  const [suggTeamRow, setSuggTeamRow] = useState<any[]>([]);
  const [suggTeamNewRow, setSuggTeamNewRow] = useState({
    id: "",
    name: "",
  });
  const queryClient = useQueryClient();
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
      setUsers(historyImsMasterData[0].USERS);
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
  });

  const [logDetails, setLogDetails] = useState<ILogImsTeamData>({
    historyLogImsData: [],
  });

  const [showLogDetailsDialog, setShowLogDetailsDialog] = useState({
    status: false,
  });

  const [showPDCAssignDialog, setShowPDCAssignDialog] = useState({
    status: false,
  });
  const [injuryRow, setInjuryRow] = useState<any[]>([]);
  const [witTeamRow, setWitTeamRow] = useState<any[]>([]);

  const [injuryFilterRow, setInjuryFilterRow] = useState<any[]>([]);
  const [witTeamFilterRow, setWitTeamFilterRow] = useState<any[]>([]);
  const [suggTeamFilterRow, setSuggTeamFilterRow] = useState<any[]>([]);

  const {
    handleSubmit: handleSubmitPDCDetails,
    reset: resetActionTaken,
    control: controlAction,
    setValue,
    watch: watchView,
  } = useForm<IRecomCloseForm>({
    defaultValues: initialCloseRecomValues,
  });

  const handlePDCAssignDialogClose = () => {
    setShowPDCAssignDialog((oldState) => ({ ...oldState, status: false }));
  };
  const handleActionClick = (row: ILogRecommendationData) => {
    resetActionTaken({
      id: row.id,
    });

    setShowPDCAssignDialog({
      status: true,
    });
  };

  const handleAssignPDCSubmit: SubmitHandler<IRecomCloseForm> = (values) => {
    loader.show();
    closeRecommendation(values)
      .then(() => {
        alertToast.show(
          "success",
          "Recommendation closed successfully",
          true,
          2000,
        );
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "recomCloseQuery",
        });
        setShowPDCAssignDialog((oldState) => ({
          ...oldState,
          status: false,
        }));
      })

      .catch((err) => {
        if (err.response && err.response.status) {
          alertToast.show("warning", err.response.data.errorMessage, true);
        }
      })
      .finally(() => {
        loader.hide();
      });
  };
  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        // Check if the row status is 'Submitted'
        if (params.row.status === "Submitted") {
          return (
            <IconButton
              className="ml-2"
              onClick={() => handleActionClick(params.row)}
            >
              <PencilSquareIcon className="w-4 h-4" />
            </IconButton>
          );
        }
        // If the status is not 'Submitted', return null (no button will show)
        return null;
      },
    },
    { field: "disp_logno", headerName: "Log No", width: 70 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "inc_date_time", headerName: "Incident Date Time", width: 250 },
    { field: "department", headerName: "Department", width: 240 },
    { field: "area", headerName: "Area", width: 250 },
    { field: "recommendation", headerName: "Recommendation", width: 220 },
    { field: "responsibility", headerName: "Responsibility", width: 220 },
    { field: "factor", headerName: "Factor", width: 200 },
    { field: "control_type", headerName: "Control Type", width: 200 },
    { field: "target_date", headerName: "Target Date", width: 200 },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  // const [reportedByList, setReportedByList] = useState<IOptionList[]>([
  //   { id: 0, name: "All Reported By" },
  // ]);

  const [filterList, setFilterList] = useState<ILogRecomFilterForm>({
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
  } = useRecomCloseQuery(filterList);

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
  } = useForm<ILogRecomFilterForm>({
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

  const handleFilterFormSubmit: SubmitHandler<ILogRecomFilterForm> = (
    values,
  ) => {
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
      const historyLogImsData = [...imsLogHistoryData.historyLogImsData];

      setTeamData({
        historyLogImsData,
      });
    }
  }, [imsLogHistoryData, isImsLogHistoryDataLoading, isImsLogHistoryDataError]);

  useEffect(() => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "recomCloseQuery",
    });
  }, []);

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "recomCloseQuery",
    });
  };

  const handleShowLogDetails = (logNo: number) => {
    const historyLogImsData = [
      ...teamData.historyLogImsData.filter(
        (item) => item.incident_no === logNo,
      ),
    ];
    setLogDetails({ historyLogImsData });

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

  const handleExport = () => {
    const rows = teamData.historyLogImsData.map((item) => ({
      "Log No": item.disp_logno,
      Status: item.status,
      "Incident Date Time": item.inc_date_time,
      Department: item.department,
      Area: item.area,
      Recommendation: item.recommendation,
      Responsibility: item.responsibility,
      Factor: item.factor,
      "Control type": item.control_type,
      "Target Date": item.target_date,
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
          Recommendation
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
              rows={teamData.historyLogImsData}
              columns={columns}
              getRowId={(row) =>
                row.TEAM_ID || row.ID || Math.random().toString(36).substring(2)
              }
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
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
        heading="Search Recommendation"
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
                  { id: "Submitted", name: "Open" },
                  { id: "Closed", name: "Closed" },
                ]}
              />
            </div>
          </div>
        </form>
      </ModalPopup>

      <ModalPopup
        heading="Close Recommendation"
        onClose={handlePDCAssignDialogClose}
        openStatus={showPDCAssignDialog.status}
        hasSubmit
        onSubmit={() => {
          handleSubmitPDCDetails(handleAssignPDCSubmit)();
        }}
        size="medium"
        showError
        hasError={
          !(Object.keys(errorsFilter).length === 0) && submitCountFilter > 0
        }
      >
        <div className="relative flex flex-col w-full h-full p-2 overflow-auto ">
          <div className="p-2 bg-white shadow-lg dark:bg-gray-800">
            <div className="grid gap-1 border-[1px] border-gray-200 rounded-lg p-2 dark:border-gray-500 dark:bg-gray-800">
              <div className="grid grid-cols-1 ">
                <div className="p-1">
                  <TextArea
                    name="close_remarks"
                    label="Remarks"
                    control={controlAction}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalPopup>
    </div>
  );
}

export default CloseRecommendation;
