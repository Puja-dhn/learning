import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FunnelIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useQueryClient } from "react-query";
import dayjs from "dayjs";
// import { utils, writeFile } from "xlsx";

import {
  OBS_CATEGORY_LIST,
  OBS_STATUS_LIST,
} from "@/features/common/constants";
// import { IOptionList } from "@/features/ui/types";
import { ILogAectData, ILogAectFilterForm } from "@/features/aect/types";
import { Button, IconButton } from "@/features/ui/buttons";
import { ModalPopup } from "@/features/ui/popup";
import { DropdownList, TextField } from "@/features/ui/form";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import { useAppSelector } from "@/store/hooks";
import HirarchyFilterAll from "@/features/common/HirarchyFilterAll";
import { useAectLogDetailQuery } from "@/features/aect/hooks";
import { useDBDateQuery } from "@/features/common/hooks";
import ModalPopupMobile from "@/features/ui/popup/ModalPopupMobile";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

interface ILogAectTeamData {
  historyLogAectData: ILogAectData[];
}

const initialFilterValues: ILogAectFilterForm = {
  ID: null,
  TEAM_ID: -1,
  AREA_ID: -1,
  DIVISION_ID: -1,
  LOCATION_ID: -1,
  OBS_DESC: "",
  CATEGORY: "All",
  LOCATION: "",
  SEVERITY: "All",
  REPORTED_BY: 0,
  REPORTED_DATE_FROM: dayjs(new Date()).format("YYYY-MM-DD"),
  REPORTED_DATE_TO: dayjs(new Date()).format("YYYY-MM-DD"),
  STATUS: "All",
  PDC_DATE_FROM: "",
  PDC_DATE_TO: "",
  ACTION_CLOSED_DATE_FROM: "",
  ACTION_CLOSED_DATE_TO: "",
};

const filterSchema = Yup.object().shape({
  OBS_DESC: Yup.string().max(400, "Maximum 400 characters can be entered"),
  LOCATION: Yup.string().max(200, "Maximum 200 characters can be entered"),
  REPORTED_DATE_FROM: Yup.string().required("Reported Date From is required"),
  REPORTED_DATE_TO: Yup.string().required("Reported Date To is required"),
});

const tableColumns = [
  {
    label: "Log No",
    minWidth: "min-w-[100px]",
    dbCol: "ID",
  },
  {
    label: "Reported Date",
    minWidth: "min-w-[180px]",
    dbCol: "REPORTED_DATE",
  },
  {
    label: "Reported By",
    minWidth: "min-w-[200px]",
    dbCol: "REPORTED_BY_DISP_NAME",
  },
  {
    label: "Observation Description",
    minWidth: "min-w-[300px]",
    dbCol: "OBS_DESC",
  },
  { label: "Severity", minWidth: "min-w-[140px]", dbCol: "SEVERITY" },
  { label: "Category", minWidth: "min-w-[140px]", dbCol: "CATEGORY" },
  { label: "Status", minWidth: "min-w-[140px]", dbCol: "STATUS" },
  { label: "Closure PDC", minWidth: "min-w-[140px]", dbCol: "PDC_DATE" },
  {
    label: "Exact Location",
    minWidth: "min-w-[200px]",
    dbCol: "LOCATION",
  },
  { label: "Team Name", minWidth: "min-w-[140px]", dbCol: "TEAM_NAME" },
  { label: "Area Name", minWidth: "min-w-[250px]", dbCol: "AREA_NAME" },
  { label: "Division Name", minWidth: "min-w-[250px]", dbCol: "DIVISION_NAME" },
  {
    label: "Action Planned",
    minWidth: "min-w-[200px]",
    dbCol: "ACTION_PLANNED",
  },
  { label: "Action Taken", minWidth: "min-w-[250px]", dbCol: "ACTION_TAKEN" },
  {
    label: "Action Closed By",
    minWidth: "min-w-[250px]",
    dbCol: "ACTION_CLOSED_BY_DISP_NAME",
  },
  {
    label: "Action Closed Date",
    minWidth: "min-w-[250px]",
    dbCol: "ACTION_CLOSED_DATE",
  },
];
const handleActionClick = (row: any) => {
  console.log("Action clicked for row:", row);
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
        <PencilSquareIcon className="w-4 h-4" />
      </IconButton>
    ),
  },
  { field: "ID", headerName: "Log No", width: 70 },
  { field: "REPORTED_DATE", headerName: "Reported Date", width: 180 },
  { field: "REPORTED_BY_DISP_NAME", headerName: "Reported By", width: 200 },
  {
    field: "OBS_DESC",
    headerName: "Observation Description",
    width: 300,
  },
  { field: "SEVERITY", headerName: "Severity", width: 140 },
  { field: "CATEGORY", headerName: "Category", width: 140 },
  { field: "STATUS", headerName: "Status", width: 140 },
  { field: "PDC_DATE", headerName: "Closure PDC", width: 140 },
  { field: "LOCATION", headerName: "Exact Location", width: 200 },
  { field: "TEAM_NAME", headerName: "Team Name", width: 140 },
  { field: "AREA_NAME", headerName: "Area Name", width: 250 },
  { field: "DIVISION_NAME", headerName: "Division Name", width: 250 },
  { field: "ACTION_PLANNED", headerName: "Action Planned", width: 200 },
  { field: "ACTION_TAKEN", headerName: "Action Taken", width: 250 },
  {
    field: "ACTION_CLOSED_BY_DISP_NAME",
    headerName: "Action Closed By",
    width: 250,
  },
  { field: "ACTION_CLOSED_DATE", headerName: "Action Closed Date", width: 250 },
];

const paginationModel = { page: 0, pageSize: 5 };

function ViewAect() {
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
  const globalState = useAppSelector(({ global }) => global, shallowEqual);
  const [isDesktop, setIsDesktop] = useState(false);
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
  const [teamData, setTeamData] = useState<ILogAectTeamData>({
    historyLogAectData: [],
  });

  const [logDetails, setLogDetails] = useState<ILogAectTeamData>({
    historyLogAectData: [],
  });

  const [showLogDetailsDialog, setShowLogDetailsDialog] = useState({
    status: false,
  });

  // const [reportedByList, setReportedByList] = useState<IOptionList[]>([
  //   { id: 0, name: "All Reported By" },
  // ]);
  const queryClient = useQueryClient();

  const appModePaddingClass =
    globalState.appMode === "FullScreen" ? "p-0 px-2.5 " : " p-2.5  pb-0 ";

  const [filterList, setFilterList] = useState<ILogAectFilterForm>({
    ...initialFilterValues,
  });

  const isAdmin =
    authState.ROLES &&
    authState.ROLES.length > 0 &&
    authState.ROLES.includes(2);

  let CURR_OBS_SEVERITY_LIST = [
    { id: "Minor", name: "Minor" },
    { id: "Serious", name: "Serious" },
  ];
  

  const {
    data: aectLogHistoryData,
    isLoading: isAectLogHistoryDataLoading,
    isError: isAectLogHistoryDataError,
  } = useAectLogDetailQuery(filterList);

  const [showFilterDialog, setShowFilterDialog] = useState({
    status: false,
    formInitialValues: initialFilterValues,
  });

  const {
    handleSubmit: handleSubmitFilter,
    reset: resetFilter,
    control: controlFilter,
    formState: formStateFilter,
  } = useForm<ILogAectFilterForm>({
    defaultValues: initialFilterValues,
    resolver: yupResolver(filterSchema),
  });

  const { submitCount: submitCountFilter, errors: errorsFilter } =
    formStateFilter;

  const {
    data: dbDateData,
    isLoading: isDBDateDataLoading,
    isError: isDBDateDataError,
  } = useDBDateQuery();

  useEffect(() => {
    if (isDBDateDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isDBDateDataLoading && isDBDateDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (!isDBDateDataLoading && !isDBDateDataError && dbDateData) {
      const currDBDate =
        !isDBDateDataLoading &&
        !isDBDateDataError &&
        dbDateData &&
        dbDateData.currDate
          ? new Date(dbDateData.currDate)
          : new Date();

      initialFilterValues.REPORTED_DATE_FROM =
        dayjs(currDBDate).format("YYYY-MM-DD");
      initialFilterValues.REPORTED_DATE_TO =
        dayjs(currDBDate).format("YYYY-MM-DD");
      resetFilter({
        ...initialFilterValues,
        REPORTED_DATE_FROM: dayjs(currDBDate).format("YYYY-MM-DD"),
        REPORTED_DATE_TO: dayjs(currDBDate).format("YYYY-MM-DD"),
      });
      setShowFilterDialog((oldState) => ({
        ...oldState,
        formInitialValues: {
          ...oldState.formInitialValues,
          REPORTED_DATE_FROM: dayjs(currDBDate).format("YYYY-MM-DD"),
          REPORTED_DATE_TO: dayjs(currDBDate).format("YYYY-MM-DD"),
        },
      }));
      setFilterList({
        ...initialFilterValues,
        REPORTED_DATE_FROM: dayjs(currDBDate).format("YYYY-MM-DD"),
        REPORTED_DATE_TO: dayjs(currDBDate).format("YYYY-MM-DD"),
      });
    }
  }, [dbDateData, isDBDateDataError, isDBDateDataLoading]);

  const handleReset = () => {
    resetFilter({
      ...initialFilterValues,
      AREA_ID: globalState.areaId,
      DIVISION_ID: globalState.divisionId,
      LOCATION_ID: globalState.locationId,
    });
  };

  const handleFilterDialogOpen = () => {
    resetFilter({
      ...filterList,
      AREA_ID: globalState.areaId,
      DIVISION_ID: globalState.divisionId,
      LOCATION_ID: globalState.locationId,
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

  const handleFilterFormSubmit: SubmitHandler<ILogAectFilterForm> = (
    values,
  ) => {
    setShowFilterDialog((oldState) => ({ ...oldState, status: false }));
    setFilterList({ ...values });
  };

  useEffect(() => {
    if (
      globalState.locationId >= 0 &&
      globalState.divisionId >= 0 &&
      globalState.areaId >= 0
    ) {
      resetFilter({
        ...filterList,
        AREA_ID: globalState.areaId,
        DIVISION_ID: globalState.divisionId,
        LOCATION_ID: globalState.locationId,
      });
      setFilterList((oldState) => ({
        ...oldState,
        AREA_ID: globalState.areaId,
        DIVISION_ID: globalState.divisionId,
        LOCATION_ID: globalState.locationId,
      }));
    }
  }, [globalState]);

  useEffect(() => {
    if (isAectLogHistoryDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isAectLogHistoryDataLoading && isAectLogHistoryDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (
      !isAectLogHistoryDataLoading &&
      !isAectLogHistoryDataError &&
      aectLogHistoryData
    ) {
      // const historyLogAectData = [...aectLogHistoryData.historyLogAectData];
      const historyLogAectData = !isAdmin
        ? [
            ...aectLogHistoryData.historyLogAectData.filter(
              (item) => item.REPORTED_BY === authState.ID,
            ),
          ]
        : [...aectLogHistoryData.historyLogAectData];

      setTeamData({
        historyLogAectData,
      });
    }
  }, [
    aectLogHistoryData,
    isAectLogHistoryDataLoading,
    isAectLogHistoryDataError,
    globalState,
  ]);

  useEffect(() => {
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[0] === "aectDataQuery" ||
        query.queryKey[0] === "orgDataAllQuery",
    });
  }, []);

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[0] === "aectDataQuery" ||
        query.queryKey[0] === "orgDataAllQuery",
    });
  };

  const handleShowLogDetails = (logNo: number) => {
    const historyLogAectData = [
      ...teamData.historyLogAectData.filter((item) => item.ID === logNo),
    ];
    setLogDetails({ historyLogAectData });
    setShowLogDetailsDialog({
      status: true,
    });
  };
  const handleLogDetailsDialogClose = () => {
    setShowLogDetailsDialog((oldState) => ({
      ...oldState,
      status: false,
    }));
  };

  const customNoRowsOverlay = () => {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        No Data Available
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full gap-2 p-4 overflow-hidden text-sm md:p-6">
      <div className="h-[50px] flex justify-between items-center p-1.5 px-2.5 border-[1px] text-md font-semibold text-center bg-[#f0f8ff] rounded-lg shadow-md dark:bg-gray-600 dark:text-cyan-200 dark:border-gray-500">
        <div className="flex items-center justify-center gap-2">View AECT</div>
        <div className="flex items-center justify-end gap-4 ml-20">
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
              rows={teamData.historyLogAectData}
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
          {teamData.historyLogAectData.map((row) => (
            <button
              key={row.ID}
              type="button"
              onClick={() => handleShowLogDetails(row.ID)}
              className="w-full"
            >
              <div className="relative flex items-start bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:shadow-gray-700 dark:border-gray-600">
                {/* Full-Height Vertical Log No */}
                <div className="absolute top-0 left-0 flex items-center justify-center w-6 h-full font-bold text-center text-white bg-[#6388bd] dark:bg-blue-900">
                  <span className="origin-center transform -rotate-90">
                    {row.ID}
                  </span>
                </div>

                {/* Content Section */}
                <div className="w-full p-2 ml-5 text-xs text-gray-700 dark:text-gray-300">
                  {/* First Row (Reported Date and Category) */}
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center space-x-4 w-[60%]">
                      <span className="font-semibold">Reported Date:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {row.REPORTED_DATE}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 w-[40%]">
                      <span className="font-semibold">Category:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {row.CATEGORY}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center w-full space-x-4">
                      <span className="font-semibold">Description:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {row.OBS_DESC.length > 40
                          ? `${row.OBS_DESC.slice(0, 40)}...`
                          : row.OBS_DESC}
                      </span>
                    </div>
                  </div>

                  {/* Second Row (Reported By and Severity) */}
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center space-x-4 w-[60%]">
                      <span className="font-semibold">Reported By:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {row.REPORTED_BY_DISP_NAME}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 w-[40%]">
                      <span className="font-semibold">Severity:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {row.SEVERITY}
                      </span>
                    </div>
                  </div>

                  {/* Third Row (Closure PDC and Status) */}
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center space-x-4 w-[60%]">
                      <span className="font-semibold">Closure PDC:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {row.PDC_DATE}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 w-[40%]">
                      <span className="font-semibold">Status:</span>
                      <span
                        className={`text-gray-600 dark:text-gray-400 font-bold ${
                          row.STATUS === "Open"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {row.STATUS}
                      </span>
                    </div>
                  </div>

                  {/* Chevron Icon for Details */}
                  <div className="absolute top-0 right-0 flex items-center justify-center h-full px-2">
                    <ChevronRightIcon
                      onClick={() => handleShowLogDetails(row.ID)}
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
      {/* Table for larger screens (hidden on mobile) */}

      {/* Mobile Layout - Button view for log details (only visible on mobile) */}

      <ModalPopup
        heading="Search Aect Data"
        onClose={handleFilterDialogClose}
        openStatus={showFilterDialog.status}
        hasSubmit
        onSubmit={() => {
          handleSubmitFilter(handleFilterFormSubmit)();
        }}
        onReset={() => {
          handleReset();
        }}
        hasReset
        size="large"
        showError
        hasError={
          !(Object.keys(errorsFilter).length === 0) && submitCountFilter > 0
        }
      >
        <form className="bg-[#ecf3f9] dark:bg-gray-600 grid gap-2.5 p-2.5">
          <HirarchyFilterAll
            // hidden={isHiddenHirarchy}
            className="bg-transparent"
          />

          <div className="flex flex-wrap justify-evenly items-center p-2.5 border-[1px]  border-gray-300 rounded-lg dark:border-gray-500">
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <TextField
                type="number"
                name="ID"
                label="Log No"
                control={controlFilter}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-3/4">
              <TextField
                name="OBS_DESC"
                label="Observation"
                control={controlFilter}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <TextField
                type="date"
                name="REPORTED_DATE_FROM"
                label="Reported Date From"
                control={controlFilter}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <TextField
                type="date"
                name="REPORTED_DATE_TO"
                label="Reported Date To"
                control={controlFilter}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <TextField
                name="LOCATION"
                label="Exact Location"
                control={controlFilter}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <DropdownList
                name="STATUS"
                label="Status"
                control={controlFilter}
                optionList={[
                  { id: "All", name: "All Status" },
                  ...OBS_STATUS_LIST,
                ]}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <TextField
                type="date"
                name="PDC_DATE_FROM"
                label="PDC Date From"
                control={controlFilter}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <TextField
                type="date"
                name="PDC_DATE_TO"
                label="PDC Date To"
                control={controlFilter}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <DropdownList
                name="CATEGORY"
                label="Category"
                control={controlFilter}
                optionList={[
                  { id: "All", name: "All Category" },
                  ...OBS_CATEGORY_LIST,
                ]}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/4">
              <DropdownList
                name="SEVERITY"
                label="Severity"
                control={controlFilter}
                optionList={[
                  { id: "All", name: "All Severity" },
                  ...CURR_OBS_SEVERITY_LIST,
                ]}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/2">
              <TextField
                type="date"
                name="ACTION_CLOSED_DATE_FROM"
                label="Closure Date From"
                control={controlFilter}
              />
            </div>
            <div className="p-2 basis-full sm:basis-1/2 lg:basis-1/2">
              <TextField
                type="date"
                name="ACTION_CLOSED_DATE_TO"
                label="Closure Date To"
                control={controlFilter}
              />
            </div>
            {/* <div className="p-2 basis-full lg:basis-2/4">
              <DropdownList
                name="REPORTED_BY"
                label="Reported By"
                control={controlFilter}
                optionList={reportedByList}
                changeHandler={(value) => {
                  setValueFilter("REPORTED_BY", +value);
                }}
              />
            </div> */}
          </div>
        </form>
      </ModalPopup>
      <ModalPopupMobile
        heading="Log Details"
        onClose={handleLogDetailsDialogClose}
        openStatus={showLogDetailsDialog.status}
        hasSubmit={false}
        hasReset={false}
        size="fullscreen"
        showError
      >
        <div className="p-2 text-sm dark:bg-gray-700 h-[100%]">
          {logDetails && logDetails.historyLogAectData.length > 0 && (
            <div className="p-2 bg-white dark:bg-gray-800 h-[100%]">
              <div className="space-y-4 text-[12px]">
                <div className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800">
                  <div className="p-2 bg-[#dee9ff] rounded-t-lg dark:bg-gray-600">
                    <h2 className="font-semibold text-gray-800 text-md dark:text-gray-200">
                      Log Information
                    </h2>
                  </div>
                  <div className="p-3 ">
                    <div className="flex border-b-[#00000036] border-b-[1px]">
                      <div className="flex-1">
                        <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                          Log No:
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {logDetails.historyLogAectData[0].ID}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                          Date:
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {logDetails.historyLogAectData[0].REPORTED_DATE}
                        </span>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Log By:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {
                              logDetails.historyLogAectData[0]
                                .REPORTED_BY_DISP_NAME
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Observation Description:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {logDetails.historyLogAectData[0].OBS_DESC}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Severity:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {logDetails.historyLogAectData[0].SEVERITY}
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Category:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {logDetails.historyLogAectData[0].CATEGORY}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Status:
                          </span>
                          <span
                            className={`text-gray-600 dark:text-gray-400 font-bold ${
                              logDetails.historyLogAectData[0].STATUS === "Open"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {logDetails.historyLogAectData[0].STATUS}
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Closure PDC:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {logDetails.historyLogAectData[0].PDC_DATE}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Location:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {logDetails.historyLogAectData[0].LOCATION}
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Team:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {logDetails.historyLogAectData[0].TEAM_NAME}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Area:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {logDetails.historyLogAectData[0].AREA_NAME}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Division:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {logDetails.historyLogAectData[0].DIVISION_NAME}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Action Planned:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {logDetails.historyLogAectData[0].ACTION_PLANNED}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Action Taken:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {logDetails.historyLogAectData[0].ACTION_TAKEN}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Action Closed By:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {
                              logDetails.historyLogAectData[0]
                                .ACTION_CLOSED_BY_DISP_NAME
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <div className="flex border-b-[#00000036] border-b-[1px]">
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Action CLosed Date:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {
                              logDetails.historyLogAectData[0]
                                .ACTION_CLOSED_DATE
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ModalPopupMobile>
    </div>
  );
}

export default ViewAect;
