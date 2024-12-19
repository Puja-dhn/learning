import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FunnelIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useQueryClient } from "react-query";
// import { utils, writeFile } from "xlsx";

import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  OBS_CATEGORY_LIST,
  OBS_STATUS_LIST,
} from "@/features/common/constants";
// import { IOptionList } from "@/features/ui/types";
import { IconButton } from "@/features/ui/buttons";
import { ModalPopup } from "@/features/ui/popup";
import { DropdownList, TextField } from "@/features/ui/form";
import { useAlertConfig, useLoaderConfig } from "@/features/ui/hooks";
import { useAppSelector } from "@/store/hooks";
import HirarchyFilterAll from "@/features/common/HirarchyFilterAll";
import ModalPopupMobile from "@/features/ui/popup/ModalPopupMobile";
import ILogSioData from "@/features/sis/types/sis/ILogSioData";
import { useSisLogDetailQuery } from "@/features/sis/hooks";
import { ILogSioFilterForm } from "@/features/sis/types";

interface ILogSioTeamData {
  historyLogSioData: ILogSioData[];
}

const initialFilterValues: ILogSioFilterForm = {
  id: null,
  department: "",
  category: "",
  area: "",
  severity: "",
};

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
  { field: "id", headerName: "Log No", width: 70 },
  { field: "obs_datetime", headerName: "Observation Date", width: 180 },
  { field: "department", headerName: "Department", width: 200 },
  { field: "area", headerName: "Area", width: 200 },
  { field: "category", headerName: "Category", width: 200 },
  { field: "severity", headerName: "Severity", width: 200 },
  { field: "pending_on", headerName: "Pending On", width: 200 },
  { field: "status", headerName: "Status", width: 200 },
];

const paginationModel = { page: 0, pageSize: 5 };

function ViewSio() {
  const alertToast = useAlertConfig();
  const loader = useLoaderConfig();
  const authState = useAppSelector(({ auth }) => auth, shallowEqual);
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
  const [teamData, setTeamData] = useState<ILogSioTeamData>({
    historyLogSioData: [],
  });

  const [logDetails, setLogDetails] = useState<ILogSioTeamData>({
    historyLogSioData: [],
  });

  const [showLogDetailsDialog, setShowLogDetailsDialog] = useState({
    status: false,
  });

  // const [reportedByList, setReportedByList] = useState<IOptionList[]>([
  //   { id: 0, name: "All Reported By" },
  // ]);
  const queryClient = useQueryClient();

  const [filterList, setFilterList] = useState<ILogSioFilterForm>({
    ...initialFilterValues,
  });

  const isAdmin =
    authState.ROLES &&
    authState.ROLES.length > 0 &&
    authState.ROLES.includes(2);

  const CURR_OBS_SEVERITY_LIST = [
    { id: "Minor", name: "Minor" },
    { id: "Serious", name: "Serious" },
  ];

  const {
    data: sioLogHistoryData,
    isLoading: isSioLogHistoryDataLoading,
    isError: isSioLogHistoryDataError,
  } = useSisLogDetailQuery(filterList);

  const [showFilterDialog, setShowFilterDialog] = useState({
    status: false,
    formInitialValues: initialFilterValues,
  });

  const {
    handleSubmit: handleSubmitFilter,
    reset: resetFilter,
    control: controlFilter,
    formState: formStateFilter,
  } = useForm<ILogSioFilterForm>({
    defaultValues: initialFilterValues,
  });

  const { submitCount: submitCountFilter, errors: errorsFilter } =
    formStateFilter;

  const handleReset = () => {
    resetFilter({
      ...initialFilterValues,
    });
  };

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

  const handleFilterFormSubmit: SubmitHandler<ILogSioFilterForm> = (values) => {
    setShowFilterDialog((oldState) => ({ ...oldState, status: false }));
    setFilterList({ ...values });
  };

  useEffect(() => {
    if (isSioLogHistoryDataLoading) {
      loader.show();
    } else {
      loader.hide();
    }

    if (!isSioLogHistoryDataLoading && isSioLogHistoryDataError) {
      alertToast.show("error", "Error Reading API", true);
    }

    if (
      !isSioLogHistoryDataLoading &&
      !isSioLogHistoryDataError &&
      sioLogHistoryData
    ) {
      // const historyLogAectData = [...aectLogHistoryData.historyLogAectData];
      const historyLogSioData = !isAdmin
        ? [
            ...sioLogHistoryData.historyLogSioData.filter(
              (item) => +item.created_by === authState.ID,
            ),
          ]
        : [...sioLogHistoryData.historyLogSioData];

      setTeamData({
        historyLogSioData,
      });
    }
  }, [sioLogHistoryData, isSioLogHistoryDataLoading, isSioLogHistoryDataError]);

  useEffect(() => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "sioDataQuery",
    });
  }, []);

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "sioDataQuery",
    });
  };

  const handleShowLogDetails = (logNo: number) => {
    const historyLogSioData = [
      ...teamData.historyLogSioData.filter((item) => item.id === logNo),
    ];
    setLogDetails({ historyLogSioData });
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
        <div className="flex items-center justify-center gap-2">View SIO</div>
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
              rows={teamData.historyLogSioData}
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
          {teamData.historyLogSioData.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => handleShowLogDetails(row.id)}
              className="w-full"
            >
              <div className="relative flex items-start bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:shadow-gray-700 dark:border-gray-600">
                {/* Full-Height Vertical Log No */}
                <div className="absolute top-0 left-0 flex items-center justify-center w-6 h-full font-bold text-center text-white bg-[#6388bd] dark:bg-blue-900">
                  <span className="origin-center transform -rotate-90">
                    {row.id}
                  </span>
                </div>

                {/* Content Section */}
                <div className="w-full p-2 ml-5 text-xs text-gray-700 dark:text-gray-300">
                  {/* First Row (Reported Date and Category) */}
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center space-x-4 w-[60%]">
                      <span className="font-semibold">Reported Date:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {row.obs_datetime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 w-[40%]">
                      <span className="font-semibold">Category:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {row.category}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center w-full space-x-4">
                      <span className="font-semibold">Description:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        
                      </span>
                    </div>
                  </div>

                  {/* Second Row (Reported By and Severity) */}
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center space-x-4 w-[60%]">
                      <span className="font-semibold">Reported By:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                     
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 w-[40%]">
                      <span className="font-semibold">Severity:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                       
                      </span>
                    </div>
                  </div>

                  {/* Third Row (Closure PDC and Status) */}
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center space-x-4 w-[60%]">
                      <span className="font-semibold">Closure PDC:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                      
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 w-[40%]">
                      <span className="font-semibold">Status:</span>
                      <span
                        className="font-bold text-gray-600 dark:text-gray-400 "
                      >
                     
                      </span>
                    </div>
                  </div>

                  {/* Chevron Icon for Details */}
                  <div className="absolute top-0 right-0 flex items-center justify-center h-full px-2">
                    <ChevronRightIcon
                      onClick={() => handleShowLogDetails(row.id)}
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
          {logDetails && logDetails.historyLogSioData.length > 0 && (
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
                          
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                          Date:
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                         
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
                          
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Category:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                           
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
                            className="font-bold text-gray-600 dark:text-gray-400 "
                          >
                            
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Closure PDC:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            
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
                           
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="mr-2 font-medium text-gray-800 dark:text-gray-300">
                            Team:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            
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

export default ViewSio;
